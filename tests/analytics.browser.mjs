// Ejecutar tras compilar dist. La rama aprobada se compila únicamente en memoria;
// no se activa PUBLIC_GA_PRIVACY_REVIEWED en el proyecto. Google/Web3Forms simulados.
import assert from "node:assert/strict";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { build } from "vite";
import { auditOutboundHtml, auditBuiltOutbound, inspectRemoteTag } from "../scripts/analytics-privacy.mjs";

const approvedBuild = process.argv.includes("--approved-build");
const enabledDirectory = process.argv.slice(2).find(argument => !argument.startsWith("--")) || "dist";
const fixtureBuild = await build({
    configFile: false, envFile: false, logLevel: "error",
    build: { write: false, minify: false, rollupOptions: { input: "src/scripts/analytics.ts" } },
    define: { "import.meta.env.PUBLIC_GA_MEASUREMENT_ID": '"G-WJFYNXS3TV"', "import.meta.env.PUBLIC_GA_PRIVACY_REVIEWED": '"true"' },
});
const fixtureOutput = Array.isArray(fixtureBuild) ? fixtureBuild[0] : fixtureBuild;
const analyticsFixture = fixtureOutput.output.find(chunk => chunk.type === "chunk" && chunk.isEntry).code;
const executablePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp" };
const servers = [];

async function serve(directory, approvedFixture = false) {
    const server = http.createServer(async (request, response) => {
        try {
            if (approvedFixture && request.url === "/analytics-test-entry.js") {
                response.writeHead(200, { "Content-Type": "application/javascript" });
                response.end(analyticsFixture);
                return;
            }
            let file = path.join(path.resolve(directory), decodeURIComponent(new URL(request.url, "http://localhost").pathname));
            if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
            let content = await readFile(file);
            if (approvedFixture && file.endsWith(".html")) {
                const html = content.toString();
                let fixtureHtml = html;
                for (const script of html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)) {
                    if (!script[1].startsWith("/_astro/")) continue;
                    const source = await readFile(path.join(directory, script[1]), "utf8");
                    if (source.includes("ga-disable-")) fixtureHtml = fixtureHtml.replace(script[0], '<script type="module" src="/analytics-test-entry.js"></script>');
                }
                content = Buffer.from(fixtureHtml);
            }
            response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
            response.end(content);
        } catch {
            response.writeHead(404);
            response.end();
        }
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    servers.push(server);
    return `http://127.0.0.1:${server.address().port}`;
}

const tagFixture = `
    (() => {
        const commands = window.dataLayer;
        let context = {};
        const emit = (name, extra = {}) => {
            if (window['ga-disable-G-WJFYNXS3TV']) return;
            fetch('https://www.google-analytics.com/g/collect', {
                method: 'POST', body: JSON.stringify({ name, parameters: { send_to: 'G-WJFYNXS3TV', ...context, ...extra } })
            });
        };
        const processCommand = command => {
            const [kind, name, parameters] = Array.from(command);
            if (kind === 'set' && typeof name === 'object') context = { ...context, ...name };
            if (kind === 'config') {
                document.cookie = '_ga=fixture; path=/; SameSite=Lax';
                document.cookie = '_ga_WJFYNXS3TV=fixture; path=/; SameSite=Lax';
                context = { page_location: parameters.page_location, page_referrer: parameters.page_referrer, page_title: parameters.page_title };
                if (parameters.send_page_view !== false) emit('page_view');
            }
            if (kind === 'event') emit(name, parameters);
        };
        commands.forEach(processCommand);
        const push = commands.push.bind(commands);
        commands.push = (...items) => {
            const length = push(...items);
            items.forEach(processCommand);
            return length;
        };
        // Simulación de las tres opciones de medición mejorada aprobadas.
        let scrolled = false;
        window.addEventListener('scroll', () => {
            if (!scrolled && scrollY + innerHeight >= document.documentElement.scrollHeight * 0.9) {
                scrolled = true;
                emit('scroll', { percent_scrolled: 90 });
            }
        });
        document.addEventListener('click', event => {
            const link = event.target.closest?.('a[href]');
            if (!link || !['http:', 'https:'].includes(link.protocol) || link.origin === location.origin) return;
            emit('click', { link_url: link.href, link_domain: link.hostname, link_id: link.id, link_classes: link.className, outbound: true });
        });
    })();
`;

const browser = await puppeteer.launch({ executablePath, headless: true });
const pageErrors = [];
const results = [];

async function session(base, initialStorage = {}, blockStorage = false, sharedContext) {
    const context = sharedContext || await browser.createBrowserContext();
    const page = await context.newPage();
    const requests = [];
    let success = true;
    let submissions = 0;
    await page.setRequestInterception(true);
    page.on("pageerror", error => pageErrors.push(error.message));
    page.on("request", async request => {
        const url = request.url();
        if (url.startsWith("https://www.googletagmanager.com/gtag/js")) {
            requests.push({ type: "tag", url, referrer: request.headers().referer });
            await request.respond({ status: 200, contentType: "application/javascript", body: tagFixture });
        } else if (url.startsWith("https://www.google-analytics.com/")) {
            requests.push({ type: "event", payload: JSON.parse(request.postData()) });
            await request.respond({ status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
        } else if (url.startsWith("https://api.web3forms.com/")) {
            const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Accept" };
            if (request.method() === "OPTIONS") {
                await request.respond({ status: 204, headers });
                return;
            }
            submissions++;
            await request.respond({ status: success ? 200 : 400, headers, contentType: "application/json", body: JSON.stringify({ success }) });
        } else if (url.startsWith(base) || url.startsWith("data:")) {
            await request.continue();
        } else {
            await request.abort();
        }
    });
    await page.evaluateOnNewDocument((storage, blocked) => {
        if (blocked) {
            Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
        } else if (!sessionStorage.getItem("test-initialized")) {
            for (const [key, value] of Object.entries(storage)) localStorage.setItem(key, value);
            sessionStorage.setItem("test-initialized", "yes");
        }
        document.addEventListener("click", event => {
            const link = event.target.closest?.("a[href]");
            if (link && (link.protocol === "tel:" || link.pathname === "/ir-a-whatsapp/" || link.origin !== location.origin)) event.preventDefault();
        }, true);
    }, initialStorage, blockStorage);
    return { context, page, requests, setSuccess: value => { success = value; }, submissions: () => submissions };
}

const events = session => session.requests.filter(request => request.type === "event").map(request => request.payload);
const noGaCookies = async page => assert.equal((await page.cookies()).some(cookie => cookie.name.startsWith("_ga")), false);
const openSettings = async page => {
    await page.$eval("[data-cookie-settings]", element => element.click());
    await page.waitForFunction(() => document.querySelector("#cookie-banner").getAttribute("aria-hidden") === "false");
};
const click = async (page, selector) => page.$eval(selector, element => element.click());

try {
    const approvedTags = { resource: { tags: [
        { function: "__dest_ga", vtp_destinationId: "G-WJFYNXS3TV" },
        { function: "__ogt_auto_events", vtp_enablePageView: true, vtp_enableHistoryEvents: false, vtp_enableScroll: true, vtp_enableOutboundClick: true, vtp_enableVideo: false, vtp_enableDownload: false, vtp_enableForm: false },
        { function: "__ccd_em_page_view", vtp_instanceDestinationId: "G-WJFYNXS3TV", vtp_historyEvents: false },
        { function: "__ccd_em_scroll", vtp_instanceDestinationId: "G-WJFYNXS3TV" },
        { function: "__ccd_em_outbound_click", vtp_instanceDestinationId: "G-WJFYNXS3TV" },
    ] } };
    assert.ok(inspectRemoteTag(JSON.stringify(approvedTags), "G-WJFYNXS3TV").checks.every(check => check.status === "pass"));
    const documentViewsOnly = structuredClone(approvedTags);
    documentViewsOnly.resource.tags = documentViewsOnly.resource.tags.filter(tag => tag.function !== "__ccd_em_page_view");
    assert.ok(inspectRemoteTag(JSON.stringify(documentViewsOnly), "G-WJFYNXS3TV").checks.every(check => check.status === "pass"));
    documentViewsOnly.resource.tags[1].vtp_enablePageView = false;
    assert.equal(inspectRemoteTag(JSON.stringify(documentViewsOnly), "G-WJFYNXS3TV").checks.find(check => check.feature === "Vistas de página").status, "fail");
    const unsafeTags = structuredClone(approvedTags);
    unsafeTags.resource.tags.push({ function: "__ogt_1p_data_v2", vtp_isEnabled: true });
    assert.equal(inspectRemoteTag(JSON.stringify(unsafeTags), "G-WJFYNXS3TV").checks.find(check => check.feature === "Datos proporcionados por usuarios").status, "fail");
    assert.equal(inspectRemoteTag("unexpected-format", "G-WJFYNXS3TV").checks[0].status, "unknown");
    for (const [feature, field, collector] of [
        ["Vídeos", "vtp_enableVideo", "__ccd_em_video"],
        ["Descargas", "vtp_enableDownload", "__ccd_em_download"],
        ["Formularios automáticos", "vtp_enableForm", "__ccd_em_form"],
    ]) {
        for (const detectorOnly of [true, false]) {
            const configuration = structuredClone(approvedTags);
            if (detectorOnly) configuration.resource.tags[1][field] = true;
            else configuration.resource.tags.push({ function: collector, vtp_instanceDestinationId: "G-WJFYNXS3TV" });
            assert.equal(inspectRemoteTag(JSON.stringify(configuration), "G-WJFYNXS3TV").checks.find(check => check.feature === feature).status, "fail");
        }
    }
    for (const name of ["click", "page_view", "scroll", "form_start", "form_submit"]) {
        const configuration = structuredClone(approvedTags);
        configuration.resource.tags.push({ function: "__ccd_conversion_marking", events: JSON.stringify({ stringValue: name }) });
        assert.equal(inspectRemoteTag(JSON.stringify(configuration), "G-WJFYNXS3TV").checks.find(check => check.feature === "Sin conversiones genéricas duplicadas").status, "fail");
    }
    assert.equal(auditOutboundHtml('<a href="https://wa.me/34614992148?text=private">WhatsApp</a>', "https://psicoinfantilcastellon.com").length > 0, true);
    assert.equal(auditOutboundHtml('<a href="https://web3forms.com/privacy?email=private">Privacidad</a>', "https://psicoinfantilcastellon.com").length > 0, true);
    for (const attributes of ['id="patient&#64;example.invalid"', 'class="patient-123456789"', 'id=patient%40example.invalid']) {
        assert.ok(auditOutboundHtml(`<a href="https://web3forms.com/privacy" ${attributes}>Privacidad</a>`, "https://psicoinfantilcastellon.com").length > 0);
    }
    assert.ok(auditOutboundHtml('<a data-href="https://web3forms.com/privacy" href=https://example.invalid/private>Salida</a>', "https://psicoinfantilcastellon.com").length > 0);
    assert.deepEqual(await auditBuiltOutbound("dist", "https://psicoinfantilcastellon.com"), []);
    results.push("Validación por función: acepta medición mejorada segura; rechaza PII y URLs no revisadas");
    const blockedBase = await serve("dist");
    const base = await serve(enabledDirectory, true);
    const blocked = await session(blockedBase);
    await blocked.page.goto(blockedBase, { waitUntil: "networkidle0" });
    await click(blocked.page, "#cookie-accept-all");
    if (approvedBuild) {
        await blocked.page.waitForFunction(() => document.cookie.includes("_ga="));
        await blocked.page.waitForNetworkIdle();
        assert.equal(blocked.requests.filter(request => request.type === "tag").length, 1);
        assert.equal(events(blocked).filter(event => event.name === "page_view").length, 1);
        results.push("Build aprobado: una etiqueta y una visita después de aceptar");
    } else {
        assert.equal(blocked.requests.length, 0, "El build sin revisión debe bloquear GA incluso al aceptar.");
        await noGaCookies(blocked.page);
        results.push("Bloqueo de privacidad activo en el build normal");
    }
    await blocked.context.close();

    const current = await session(base);
    const { page, requests } = current;
    await page.goto(`${base}/?email=private-sentinel%40example.invalid&utm_source=campaign-sentinel#message-sentinel`, { waitUntil: "networkidle0", referer: "https://example.invalid/private-referrer?email=referrer-sentinel" });
    await page.waitForFunction(() => document.querySelector("#cookie-banner").getAttribute("aria-hidden") === "false");
    assert.equal(requests.length, 0);
    await noGaCookies(page);
    const defaults = await page.evaluate(() => Array.from(window.dataLayer[0]));
    assert.equal(defaults[0], "consent");
    assert.ok(Object.values(defaults[2]).every(value => value === "denied"));
    await click(page, "#cookie-reject-optional");
    assert.equal(requests.length, 0);
    await page.reload({ waitUntil: "networkidle0" });
    assert.equal(requests.length, 0);
    assert.equal(await page.$eval("#cookie-banner", element => element.getAttribute("aria-hidden")), "true");
    results.push("Sin consentimiento y tras rechazo: cero solicitudes y cero cookies GA");

    await openSettings(page);
    await click(page, "#cookie-accept-all");
    await page.waitForFunction(() => document.cookie.includes("_ga="));
    await page.waitForNetworkIdle();
    assert.equal(requests.filter(request => request.type === "tag").length, 1);
    assert.equal(events(current).filter(event => event.name === "page_view").length, 1);
    assert.ok(!requests.find(request => request.type === "tag").referrer);
    const commands = await page.evaluate(() => window.dataLayer.map(command => Array.from(command)));
    const grant = commands.find(command => command[0] === "consent" && command[1] === "update");
    assert.deepEqual(grant[2], { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    assert.equal(commands.find(command => command[0] === "config")[2].send_page_view, true);
    assert.equal(commands.filter(command => command[0] === "event" && command[1] === "page_view").length, 0);
    await openSettings(page);
    await click(page, "#cookie-accept-all");
    await click(page, 'a[href^="tel:"]');
    await click(page, 'a[href="/ir-a-whatsapp/"]');
    await page.waitForNetworkIdle();
    assert.deepEqual(events(current).map(event => event.name), ["page_view", "click_telefono", "click_whatsapp"]);
    results.push("Aceptación: una etiqueta, un page_view, publicidad denegada y clics sin duplicados");
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForNetworkIdle();
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await click(page, "#google-profile-link");
    await page.waitForNetworkIdle();
    assert.equal(events(current).filter(event => event.name === "scroll").length, 1);
    assert.equal(events(current).filter(event => event.name === "click").length, 1);
    assert.equal(events(current).find(event => event.name === "click").parameters.link_url, "https://maps.google.com/?cid=4225123225601099366");
    assert.equal(events(current).filter(event => event.name === "click_whatsapp").length, 1);
    const redirect = await (await fetch(`${base}/ir-a-whatsapp/?email=private-sentinel`)).text();
    assert.match(redirect, /0;url=https:\/\/wa.me\/34614992148/);
    assert.doesNotMatch(redirect, /gtag|google-analytics|analytics-test-entry|private-sentinel/);
    assert.doesNotMatch(await readFile("dist/sitemap-0.xml", "utf8"), /ir-a-whatsapp/);
    const redirectPage = await browser.newPage();
    const redirectRequests = [];
    await redirectPage.setRequestInterception(true);
    redirectPage.on("request", async request => {
        if (request.url().startsWith(base)) await request.continue();
        else {
            redirectRequests.push({ url: request.url(), referrer: request.headers().referer });
            await request.respond({ status: 200, contentType: "text/html", body: '<link rel="icon" href="data:,">Destino interceptado' });
        }
    });
    const whatsappRequest = redirectPage.waitForRequest(request => request.url().startsWith("https://wa.me/"));
    await redirectPage.goto(`${base}/ir-a-whatsapp/?email=private-sentinel#private-fragment`);
    await whatsappRequest;
    await redirectPage.close();
    assert.deepEqual(redirectRequests, [{ url: "https://wa.me/34614992148", referrer: undefined }]);
    results.push("Scroll automático único, salida pública auditada y WhatsApp sin salida automática ni teléfono en Analytics");

    async function submit() {
        await page.evaluate(() => {
            const values = { nombre: "name-sentinel", telefono: "000000000", email: "qa-sentinel@example.invalid", edad: "age-sentinel", mensaje: "sensitive-message-sentinel" };
            const form = document.querySelector("#formulario");
            for (const [name, value] of Object.entries(values)) form.elements.namedItem(name).value = value;
            form.elements.namedItem("privacidad").checked = true;
            form.requestSubmit();
        });
        await page.waitForFunction(() => document.querySelector("#formulario").getAttribute("aria-busy") !== "true");
        await page.waitForNetworkIdle();
    }
    // Un formulario no válido tampoco puede generar un lead.
    await page.$eval("#formulario", form => form.requestSubmit());
    assert.equal(current.submissions(), 0);
    current.setSuccess(false);
    await submit();
    assert.equal(events(current).filter(event => event.name === "generate_lead").length, 0);
    current.setSuccess(true);
    await submit();
    assert.equal(events(current).filter(event => event.name === "generate_lead").length, 1);
    assert.equal(current.submissions(), 2);
    const serialized = JSON.stringify(events(current));
    assert.doesNotMatch(serialized, /sentinel|000000000|34614992148|wa\.me|web3forms/);
    for (const event of events(current)) {
        const automaticParameters = event.name === "click" ? ["link_url", "link_domain", "link_id", "link_classes", "outbound"] : event.name === "scroll" ? ["percent_scrolled"] : [];
        assert.deepEqual(Object.keys(event.parameters).sort(), ["page_location", "page_referrer", "page_title", "send_to", ...automaticParameters].sort());
        assert.doesNotMatch(event.parameters.page_location, /\?|#/);
        assert.equal(event.parameters.page_referrer, "");
    }
    results.push("Lead solo con confirmación: sin eventos en errores ni datos del formulario/URLs");

    const oldCount = events(current).length;
    await page.goto(`${base}/contacto/`, { waitUntil: "networkidle0" });
    assert.equal(events(current).length, oldCount + 1);
    assert.equal(events(current).at(-1).name, "page_view");
    const sibling = await session(base, {}, false, current.context);
    await sibling.page.goto(base, { waitUntil: "networkidle0" });
    assert.equal(events(sibling).filter(event => event.name === "page_view").length, 1);
    await openSettings(page);
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        sibling.page.waitForNavigation({ waitUntil: "networkidle0" }),
        click(page, "#cookie-reject-optional"),
    ]);
    await noGaCookies(page);
    await noGaCookies(sibling.page);
    const afterWithdrawal = requests.length;
    const siblingAfterWithdrawal = sibling.requests.length;
    await click(page, 'a[href^="tel:"]');
    await click(sibling.page, 'a[href^="tel:"]');
    await page.goto(`${base}/`, { waitUntil: "networkidle0" });
    assert.equal(requests.length, afterWithdrawal);
    assert.equal(sibling.requests.length, siblingAfterWithdrawal);
    results.push("Preferencia persistida, visita única y retirada sincronizada entre pestañas, sin cookies ni medición posterior");
    await current.context.close();

    for (const [label, storage, storageBlocked, expectedTag] of [
        ["elección anterior", { psico_cookie_consent: "all" }, false, true],
        ["consentimiento caducado", { psico_cookie_consent: "all", psico_cookie_consent_updated_at: "1" }, false, false],
        ["valor inválido", { psico_cookie_consent: "unexpected" }, false, false],
        ["almacenamiento bloqueado", {}, true, false],
        ["cerrar sin aceptar", {}, false, false],
    ]) {
        const item = await session(base, storage, storageBlocked);
        await item.page.goto(base, { waitUntil: "networkidle0" });
        assert.equal(item.requests.some(request => request.type === "tag"), expectedTag, label);
        if (storageBlocked) {
            await click(item.page, "#cookie-reject-optional");
            assert.equal(item.requests.length, 0);
        }
        if (label === "cerrar sin aceptar") {
            await click(item.page, "#cookie-banner-close");
            await item.page.reload({ waitUntil: "networkidle0" });
            assert.equal(item.requests.length, 0);
            assert.equal(await item.page.evaluate(() => localStorage.getItem("psico_cookie_consent")), "necessary_only");
        }
        await item.context.close();
        results.push(`Comprobado: ${label}`);
    }
    assert.deepEqual(pageErrors, []);
    console.log(results.map(result => `OK: ${result}`).join("\n"));
    console.log("Pruebas con etiqueta y Web3Forms simulados; no verifican recepción en el panel real de GA4.");
} finally {
    await browser.close();
    for (const server of servers) server.close();
}
