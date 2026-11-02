// Sesiones privadas nuevas: verifica visibilidad real, no solo aria-hidden.
import assert from "node:assert/strict";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp" };
const server = http.createServer(async (request, response) => {
    try {
        let file = path.join(path.resolve("dist"), decodeURIComponent(new URL(request.url, "http://localhost").pathname));
        if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
        response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
        response.end(await readFile(file));
    } catch {
        response.writeHead(404);
        response.end();
    }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = process.argv[2] || `http://127.0.0.1:${server.address().port}`;
const origin = new URL(base).origin;
if (!process.argv[2]) {
    const html = await readFile("dist/index.html", "utf8");
    const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match => match[1]);
    assert.ok(scripts.some(src => src.startsWith("/_astro/")));
    for (const src of scripts.filter(src => src.startsWith("/"))) {
        assert.equal((await stat(path.join("dist", src))).isFile(), true, `Falta script del build: ${src}`);
    }
    console.log("OK: los scripts referenciados por el HTML existen en dist.");
}
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const errors = [];
const failedAssets = [];
async function pageIn(context, width, blockedStorage = false, blockedScripts = false) {
    const page = await context.newPage();
    await page.setViewport({ width, height: 900 });
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
        if (response.url().startsWith(origin) && response.status() >= 400) failedAssets.push({ status: response.status(), url: response.url() });
    });
    await page.setRequestInterception(true);
    page.on("request", async request => {
        if (blockedScripts && request.resourceType() === "script") await request.abort();
        else if (request.url().startsWith(origin) || request.url().startsWith("data:")) await request.continue();
        else await request.abort();
    });
    if (blockedStorage) await page.evaluateOnNewDocument(() => {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
    });
    await page.goto(base, { waitUntil: "networkidle0" });
    return page;
}
async function visibleBanner(page, initialized = true) {
    await page.waitForFunction(() => {
        const banner = document.querySelector("#cookie-banner");
        return banner?.getAttribute("aria-hidden") === "false" && getComputedStyle(banner).opacity === "1";
    }, { timeout: 10000 });
    const state = await page.$eval("#cookie-banner", banner => {
        const style = getComputedStyle(banner);
        const bounds = banner.getBoundingClientRect();
        const button = banner.querySelector("#cookie-reject-optional");
        const control = button.getBoundingClientRect();
        const hit = document.elementFromPoint(control.x + control.width / 2, control.y + control.height / 2);
        return { display: style.display, visibility: style.visibility, inert: banner.inert, inside: bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight, clickable: button.contains(hit), initialized: banner.dataset.initialized };
    });
    assert.notEqual(state.display, "none");
    assert.notEqual(state.visibility, "hidden");
    assert.equal(state.inert, false);
    assert.equal(state.inside, true);
    assert.equal(state.clickable, true);
    if (initialized) assert.equal(state.initialized, "true");
    return state;
}
try {
    for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
        const context = await browser.createBrowserContext();
        const page = await pageIn(context, width);
        const state = await visibleBanner(page);
        console.log(`OK: incógnito nuevo ${width}px: visible, dentro de pantalla y botones accesibles (${JSON.stringify(state)}).`);
        if ([1440, 390].includes(width)) await page.screenshot({ path: `C:/Users/PC-user/AppData/Local/Temp/opencode/cookie-banner-${width}.png` });
        if (width === 1440) {
            await page.click("#cookie-reject-optional");
            const sibling = await pageIn(context, width);
            assert.equal(await sibling.$eval("#cookie-banner", element => element.getAttribute("aria-hidden")), "true");
            await sibling.$eval("[data-cookie-settings]", element => element.click());
            await visibleBanner(sibling);
            console.log("OK: otra pestaña de la misma sesión privada comparte el rechazo; Configurar cookies reabre el banner.");
        }
        await context.close();
    }
    const context = await browser.createBrowserContext();
    const page = await pageIn(context, 390, true);
    await visibleBanner(page);
    await context.close();
    const unavailable = await browser.createBrowserContext();
    const fallback = await pageIn(unavailable, 390, false, true);
    await visibleBanner(fallback, false);
    assert.equal(await fallback.$eval("#cookie-accept-all", button => button.disabled), true);
    assert.equal(await fallback.evaluate(() => localStorage.getItem("psico_cookie_consent")), null);
    await unavailable.close();
    console.log("OK: con scripts bloqueados el aviso sigue visible, sin falsa aceptación y con controles deshabilitados.");
    assert.deepEqual(errors, []);
    assert.deepEqual(failedAssets, []);
    console.log("OK: también aparece con localStorage bloqueado; sin errores JS ni assets HTTP fallidos. Tráfico externo bloqueado.");
} finally {
    await browser.close();
    server.close();
}
