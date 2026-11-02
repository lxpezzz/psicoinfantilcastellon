// Ejecuta gtag real, pero intercepta TODOS los envíos: no registra datos en GA4.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { build } from "vite";
import puppeteer from "puppeteer";

const id = "G-WJFYNXS3TV";
const productionBuild = process.argv.includes("--production-build");
const response = await fetch(`https://www.googletagmanager.com/gtag/js?id=${id}`);
assert.ok(response.ok);
const realTag = await response.text();
const bundle = await build({
    configFile: false, envFile: false, logLevel: "error",
    define: { "import.meta.env.PUBLIC_GA_MEASUREMENT_ID": JSON.stringify(id), "import.meta.env.PUBLIC_GA_PRIVACY_REVIEWED": '"true"' },
    build: { write: false, minify: false, rollupOptions: { input: "src/scripts/analytics.ts" } },
});
const fixture = bundle.output.find(chunk => chunk.type === "chunk" && chunk.isEntry).code;
const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp" };
const server = http.createServer(async (request, res) => {
    try {
        const pathname = new URL(request.url, "http://localhost").pathname;
        if (pathname === "/real-tag-test.js") {
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(fixture);
            return;
        }
        let file = path.join(path.resolve("dist"), decodeURIComponent(pathname));
        if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
        let content = await readFile(file);
        if (!productionBuild && file.endsWith(".html")) {
            let html = content.toString();
            for (const script of html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)) {
                if (!script[1].startsWith("/_astro/")) continue;
                const source = await readFile(path.join("dist", script[1]), "utf8");
                if (source.includes("ga-disable-")) html = html.replace(script[0], '<script type="module" src="/real-tag-test.js"></script>');
            }
            content = Buffer.from(html);
        }
        res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
        res.end(content);
    } catch {
        res.writeHead(404);
        res.end();
    }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const requests = [];
const errors = [];
let formSuccess = false;
let tags = 0;
const events = () => requests.flatMap(({ url, body }) => {
    const common = new URL(url).searchParams;
    return (body ? body.split("\n") : [""]).map(line => Object.fromEntries([...common, ...new URLSearchParams(line)]));
});
const count = name => events().filter(event => event.en === name).length;
const pause = page => page.evaluate(() => new Promise(resolve => setTimeout(resolve, 6000)));
try {
    const page = await browser.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on("request", async request => {
        const url = request.url();
        if (url.startsWith(`https://www.googletagmanager.com/gtag/js?id=${id}`)) {
            tags++;
            await request.respond({ status: 200, contentType: "application/javascript", body: realTag });
        } else if (/^https:\/\/[^/]*google-analytics\.com\//.test(url)) {
            requests.push({ url, body: await request.fetchPostData() || "" });
            await request.respond({ status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
        } else if (url.startsWith("https://maps.google.com/")) {
            // HTTP 204 conserva el documento, sin cancelar el clic antes de gtag.
            await request.respond({ status: 204 });
        } else if (url.startsWith("https://api.web3forms.com/")) {
            const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Accept", "Access-Control-Allow-Methods": "POST, OPTIONS" };
            await request.respond({ status: request.method() === "OPTIONS" ? 204 : formSuccess ? 200 : 400, headers, contentType: "application/json", body: request.method() === "OPTIONS" ? undefined : JSON.stringify({ success: formSuccess }) });
        } else if (url.startsWith(base) || url.startsWith("data:")) await request.continue();
        else await request.abort();
    });
    await page.evaluateOnNewDocument(() => {
        document.addEventListener("click", event => {
            const link = event.target.closest?.("a[href]");
            if (link && (link.protocol === "tel:" || link.pathname === "/ir-a-whatsapp/")) event.preventDefault();
        }, true);
    });
    const click = selector => page.$eval(selector, element => element.click());
    const settings = () => click("[data-cookie-settings]");
    await page.goto(`${base}/?email=qa-sentinel%40example.invalid#qa-sentinel`, { waitUntil: "networkidle0", referer: "https://example.invalid/qa-sentinel" });
    assert.equal(tags, 0);
    assert.equal(requests.length, 0);
    assert.equal((await page.browserContext().cookies()).some(cookie => cookie.name.startsWith("_ga")), false);
    await click("#cookie-reject-optional");
    await pause(page);
    assert.equal(tags, 0);
    assert.equal(requests.length, 0);
    assert.equal((await page.browserContext().cookies()).some(cookie => cookie.name.startsWith("_ga")), false);
    await settings();
    await click("#cookie-accept-all");
    await page.waitForFunction(() => document.cookie.includes("_ga="));
    await pause(page);
    assert.equal(tags, 1);
    assert.equal(count("page_view"), 1);
    await settings();
    await click("#cookie-accept-all");
    await click('a[href^="tel:"]');
    await click('a[href="/ir-a-whatsapp/"]');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await pause(page);
    await page.$eval("#google-profile-link", link => { link.target = "_self"; });
    await click("#google-profile-link");
    await pause(page);
    assert.equal(count("page_view"), 1);
    assert.equal(count("click_telefono"), 1);
    assert.equal(count("click_whatsapp"), 1);
    assert.equal(count("scroll"), 1, `Eventos reales: ${JSON.stringify(events())}`);
    assert.equal(count("click"), 1);
    async function submit() {
        await page.evaluate(() => {
            const form = document.querySelector("#formulario");
            for (const [name, value] of Object.entries({ nombre: "qa-sentinel", telefono: "000000000", email: "qa-sentinel@example.invalid", edad: "qa-sentinel", mensaje: "qa-sentinel" })) form.elements.namedItem(name).value = value;
            form.elements.namedItem("privacidad").checked = true;
            form.requestSubmit();
        });
        await page.waitForFunction(() => document.querySelector("#formulario").getAttribute("aria-busy") !== "true");
        await pause(page);
    }
    await submit();
    assert.equal(count("generate_lead"), 0);
    formSuccess = true;
    await submit();
    assert.equal(count("generate_lead"), 1);
    assert.equal(count("form_start") + count("form_submit"), 0);
    const beforeHistory = events();
    assert.doesNotMatch(JSON.stringify(beforeHistory), /qa-sentinel|000000000|34614992148|user_data|qa-sentinel%40/);
    for (const event of beforeHistory) {
        assert.equal(event.dl, "https://psicoinfantilcastellon.com/");
        assert.ok(!event.dr);
    }
    console.log("OK: gtag real: sin carga antes del consentimiento/rechazo; visita, scroll, salida y contactos únicos; lead solo tras éxito; parámetros filtrados.");
    const oldViews = count("page_view");
    await page.evaluate(() => history.pushState({}, "", "/qa-history-sentinel/?history=qa-history-sentinel#qa-history-sentinel"));
    await pause(page);
    await page.evaluate(() => {
        history.replaceState({}, "", "/qa-history-replaced/?history=qa-history-sentinel");
        window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await pause(page);
    assert.equal(count("page_view"), oldViews, "Los cambios de historial no deben generar visitas.");
    assert.doesNotMatch(JSON.stringify(events().slice(beforeHistory.length)), /qa-history-sentinel/);
    console.log(`Historial real: ${count("page_view") - oldViews} page_view adicionales; marcador de URL capturado: ${JSON.stringify(events().slice(beforeHistory.length)).includes("qa-history-sentinel")}.`);
    const viewsBeforeNavigation = count("page_view");
    await page.goto(`${base}/contacto/`, { waitUntil: "networkidle0" });
    await pause(page);
    assert.equal(count("page_view"), viewsBeforeNavigation + 1);
    console.log("OK: navegación Astro a otro documento: una única visita adicional.");
    await settings();
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), click("#cookie-reject-optional")]);
    const afterWithdrawal = requests.length;
    await click('a[href^="tel:"]');
    await pause(page);
    assert.equal(requests.length, afterWithdrawal);
    assert.equal((await page.browserContext().cookies()).some(cookie => cookie.name.startsWith("_ga")), false);
    assert.deepEqual(errors, []);
    console.log("OK: retirada con gtag real, sin nuevas solicitudes ni cookies GA. Todos los envíos se interceptaron; no se verifica recepción/atribución en el panel.");
    console.log(productionBuild ? "Probado el JavaScript de dist sin sustituir el módulo Analytics." : "Probada la aprobación local solo en memoria.");
} finally {
    await browser.close();
    server.close();
}
