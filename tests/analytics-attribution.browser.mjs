// Prueba la atribución saneada (unitaria + navegador con etiqueta simulada y gtag real interceptado).
// No activa PUBLIC_GA_ATTRIBUTION_REVIEWED en .env ni envía datos a GA4 real.
import assert from "node:assert/strict";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { build } from "vite";
import puppeteer from "puppeteer";
import { resolveSanitizedAttribution } from "../src/scripts/analytics-attribution.mjs";

// 1. Pruebas unitarias de lista blanca y saneado
{
    assert.deepEqual(
        resolveSanitizedAttribution(
            "https://www.google.es/search?q=psicologo+infantil+nombre-privado&client=safari#frag",
            "",
            "https://psicoinfantilcastellon.com",
        ),
        { page_referrer: "https://www.google.es/", campaign: null },
    );
    assert.deepEqual(
        resolveSanitizedAttribution(
            "https://www.bing.com/search?q=tdah-castellon-privado",
            "",
            "https://psicoinfantilcastellon.com",
        ),
        { page_referrer: "https://www.bing.com/", campaign: null },
    );
    // Maps no se fuerza como organic: conserva únicamente su origen.
    assert.deepEqual(
        resolveSanitizedAttribution(
            "https://maps.google.com/maps/place/foo?cid=123&private=1",
            "",
            "https://psicoinfantilcastellon.com",
        ),
        { page_referrer: "https://maps.google.com/", campaign: null },
    );
    // Referrer no permitido (webmail / dominio privado / mismo origen) se descarta por completo.
    for (const blocked of [
        "https://mail.google.com/mail/u/0/#inbox/123",
        "https://docs.google.com/document/d/private",
        "https://example.invalid/private?email=sentinel",
        "https://psicoinfantilcastellon.com/tratamiento-tdah/",
        "javascript:alert(1)",
    ]) {
        assert.deepEqual(
            resolveSanitizedAttribution(blocked, "", "https://psicoinfantilcastellon.com"),
            { page_referrer: "", campaign: null },
            `Debe descartar referrer no permitido: ${blocked}`,
        );
    }
    // UTM de Google Business Profile estrictamente permitidos.
    assert.deepEqual(
        resolveSanitizedAttribution(
            "https://maps.google.com/maps",
            "?utm_source=Google&utm_medium=GBP&utm_campaign=ficha_google&utm_content=web&utm_term=private-sentinel&email=a@b.es",
            "https://psicoinfantilcastellon.com",
        ),
        {
            page_referrer: "",
            campaign: { source: "google", medium: "gbp", name: "ficha_google", content: "web" },
        },
    );
    // utm_content no listado se ignora aunque la campaña coincida.
    assert.deepEqual(
        resolveSanitizedAttribution(
            "",
            "?utm_source=google&utm_medium=gbp&utm_campaign=ficha_google&utm_content=patient-sentinel",
            "https://psicoinfantilcastellon.com",
        ),
        {
            page_referrer: "",
            campaign: { source: "google", medium: "gbp", name: "ficha_google" },
        },
    );
    // Campañas arbitrarias no listadas se ignoran por completo.
    assert.deepEqual(
        resolveSanitizedAttribution(
            "",
            "?utm_source=newsletter&utm_medium=email&utm_campaign=patient-sentinel",
            "https://psicoinfantilcastellon.com",
        ),
        { page_referrer: "", campaign: null },
    );
    console.log("OK: pruebas unitarias de atribución saneada (buscadores, Maps, GBP UTM, exclusión de PII/webmail).");
}

// 2. Compilar en memoria analytics.ts con atribución habilitada y probar contra gtag real (interceptado)
const id = "G-WJFYNXS3TV";
const realTagResponse = await fetch(`https://www.googletagmanager.com/gtag/js?id=${id}`);
assert.ok(realTagResponse.ok);
const realTag = await realTagResponse.text();

const bundle = await build({
    configFile: false,
    envFile: false,
    logLevel: "error",
    define: {
        "import.meta.env.PUBLIC_GA_MEASUREMENT_ID": JSON.stringify(id),
        "import.meta.env.PUBLIC_GA_PRIVACY_REVIEWED": '"true"',
        "import.meta.env.PUBLIC_GA_ATTRIBUTION_REVIEWED": '"true"',
    },
    build: { write: false, minify: false, rollupOptions: { input: "src/scripts/analytics.ts" } },
});
const fixtureCode = bundle.output.find(chunk => chunk.type === "chunk" && chunk.isEntry).code;
const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp" };

const server = http.createServer(async (request, response) => {
    try {
        const pathname = new URL(request.url, "http://localhost").pathname;
        if (pathname === "/analytics-attribution-entry.js") {
            response.writeHead(200, { "Content-Type": "application/javascript" });
            response.end(fixtureCode);
            return;
        }
        let file = path.join(path.resolve("dist"), decodeURIComponent(pathname));
        if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
        let content = await readFile(file);
        if (file.endsWith(".html")) {
            let html = content.toString();
            for (const script of html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)) {
                if (!script[1].startsWith("/_astro/")) continue;
                const source = await readFile(path.join("dist", script[1]), "utf8");
                if (source.includes("ga-disable-")) {
                    html = html.replace(script[0], '<script type="module" src="/analytics-attribution-entry.js"></script>');
                }
            }
            content = Buffer.from(html);
        }
        response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
        response.end(content);
    } catch {
        response.writeHead(404);
        response.end();
    }
});

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
});

async function runScenario({ label, urlPath, referer }) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const collected = [];
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on("request", async request => {
        const url = request.url();
        if (url.startsWith(`https://www.googletagmanager.com/gtag/js?id=${id}`)) {
            await request.respond({ status: 200, contentType: "application/javascript", body: realTag });
        } else if (/^https:\/\/[^/]*google-analytics\.com\//.test(url)) {
            collected.push({ url, body: (await request.fetchPostData()) || "" });
            await request.respond({ status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
        } else if (url.startsWith(base) || url.startsWith("data:")) {
            await request.continue();
        } else {
            await request.abort();
        }
    });
    // En producción la web corre bajo HTTPS; sobre http://127.0.0.1 el navegador
    // degrada Referer desde https://, por lo que simulamos document.referrer real.
    if (referer) {
        await page.evaluateOnNewDocument(value => {
            Object.defineProperty(document, "referrer", { get: () => value, configurable: true });
        }, referer);
    }
    await page.goto(`${base}${urlPath}`, { waitUntil: "networkidle0" });
    assert.equal(collected.length, 0, `${label}: no debe enviar nada antes del consentimiento`);
    await page.$eval("#cookie-accept-all", element => element.click());
    await page.waitForFunction(() => document.cookie.includes("_ga="));
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 6000)));
    const events = collected.flatMap(({ url, body }) => {
        const common = new URL(url).searchParams;
        return (body ? body.split("\n") : [""]).map(line =>
            Object.fromEntries([...common, ...new URLSearchParams(line)]),
        );
    });
    const serialized = JSON.stringify(events);
    assert.doesNotMatch(serialized, /private-sentinel|mail\.google|email|patient/, `${label}: fuga de PII`);
    assert.deepEqual(errors, [], `${label}: errores JS`);
    await context.close();
    return events;
}

try {
    const googleEvents = await runScenario({
        label: "Google Search referrer",
        urlPath: "/?email=private-sentinel%40example.invalid",
        referer: "https://www.google.es/search?q=psicologo+infantil+private-sentinel",
    });
    const googleView = googleEvents.find(event => event.en === "page_view");
    assert.ok(googleView, "Debe emitir page_view para Google referrer");
    assert.equal(googleView.dl, "https://psicoinfantilcastellon.com/");
    assert.equal(googleView.dr, "https://www.google.es/");
    assert.ok(!googleView.cs, "No debe forzar campaign_source manual en Google referrer");
    console.log("OK: gtag real con referrer Google -> dr=https://www.google.es/, sin query ni (direct) forzado.");

    const bingEvents = await runScenario({
        label: "Bing Search referrer",
        urlPath: "/",
        referer: "https://www.bing.com/search?q=private-sentinel",
    });
    const bingView = bingEvents.find(event => event.en === "page_view");
    assert.equal(bingView.dr, "https://www.bing.com/");
    console.log("OK: gtag real con referrer Bing -> dr=https://www.bing.com/.");

    const blockedEvents = await runScenario({
        label: "Webmail/privado bloqueado",
        urlPath: "/",
        referer: "https://mail.google.com/mail/u/0/#inbox/private-sentinel",
    });
    const blockedView = blockedEvents.find(event => event.en === "page_view");
    assert.ok(!blockedView.dr, "No debe enviar dr para referrers no listados");
    console.log("OK: gtag real con referrer no permitido -> dr omitido.");

    const gbpEvents = await runScenario({
        label: "Google Business Profile UTM permitidos",
        urlPath: "/contacto/?utm_source=google&utm_medium=gbp&utm_campaign=ficha_google&utm_content=cita&utm_term=private-sentinel",
        referer: "https://maps.google.com/maps/place/private-sentinel",
    });
    const gbpView = gbpEvents.find(event => event.en === "page_view");
    assert.equal(gbpView.dl, "https://psicoinfantilcastellon.com/contacto/");
    assert.ok(!gbpView.dr);
    assert.equal(gbpView.cs, "google");
    assert.equal(gbpView.cm, "gbp");
    assert.equal(gbpView.cn, "ficha_google");
    assert.equal(gbpView.cc, "cita");
    console.log("OK: gtag real con UTM de GBP -> dl canónica limpia, cs=google, cm=gbp, cn=ficha_google, cc=cita.");
} finally {
    await browser.close();
    server.close();
}
