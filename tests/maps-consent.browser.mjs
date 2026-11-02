// Prueba dist sin modificar sus scripts. Google se intercepta: no sale tráfico.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
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
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const errors = [];
async function newPage(context, javascript = true, blockedStorage = false) {
    const page = await context.newPage();
    const maps = [];
    const analytics = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setJavaScriptEnabled(javascript);
    if (blockedStorage) await page.evaluateOnNewDocument(() => {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
    });
    await page.setRequestInterception(true);
    page.on("request", async request => {
        const url = request.url();
        if (url.startsWith("https://maps.google.com/")) {
            maps.push({ url, referrer: request.headers().referer });
            await request.respond({ status: 200, contentType: "text/html", body: "Mapa interceptado" });
        } else if (url.startsWith(base) || url.startsWith("data:")) await request.continue();
        else {
            if (/google-analytics|googletagmanager/.test(url)) analytics.push(url);
            await request.abort();
        }
    });
    await page.goto(`${base}/contacto/?test=private#map-heading`, { waitUntil: "networkidle0" });
    await page.$eval("[data-consent-map]", element => element.scrollIntoView({ block: "center" }));
    return { page, maps, analytics };
}
const click = (page, selector) => page.$eval(selector, element => element.click());
const noFrame = async page => assert.equal(await page.$("[data-consent-map] iframe"), null);
const enable = async page => {
    await page.focus("[data-map-accept]");
    await page.keyboard.press("Enter");
    await page.waitForSelector("[data-consent-map] iframe");
    await page.waitForNetworkIdle();
};
try {
    const context = await browser.createBrowserContext();
    const { page, maps, analytics } = await newPage(context);
    await noFrame(page);
    assert.equal(maps.length, 0);
    await click(page, "#cookie-reject-optional");
    await page.waitForNetworkIdle();
    assert.equal(maps.length, 0);
    await click(page, "[data-cookie-settings]");
    await click(page, "#cookie-accept-all");
    await page.waitForNetworkIdle();
    assert.equal(analytics.length, 1);
    assert.equal(maps.length, 0, "Aceptar estadísticas no autoriza Maps.");
    await click(page, "[data-cookie-settings]");
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), click(page, "#cookie-reject-optional")]);
    await page.$eval("[data-consent-map]", element => element.scrollIntoView({ block: "center" }));
    const gaCount = analytics.length;
    await enable(page);
    assert.equal(maps.length, 1);
    assert.equal(maps[0].referrer, undefined);
    assert.doesNotMatch(maps[0].url, /private/);
    assert.equal(analytics.length, gaCount, "Autorizar Maps no activa GA4.");
    await page.focus("[data-map-revoke]");
    await page.keyboard.press("Enter");
    await noFrame(page);
    assert.equal(await page.$eval("[data-map-accept]", element => document.activeElement === element), true);
    await enable(page);
    await click(page, "[data-map-accept]");
    assert.equal(await page.$$eval("[data-consent-map] iframe", frames => frames.length), 1);
    const sibling = await newPage(context);
    await noFrame(sibling.page);
    assert.equal(sibling.maps.length, 0);
    await enable(sibling.page);
    await click(page, "[data-cookie-settings]");
    await click(page, "#cookie-reject-optional");
    await noFrame(page);
    await sibling.page.waitForFunction(() => !document.querySelector("[data-consent-map] iframe"));
    await page.reload({ waitUntil: "networkidle0" });
    await noFrame(page);
    console.log("OK: scroll/rechazo/aceptación de Analytics no cargan Maps; autorización independiente, teclado, retirada y sincronización entre pestañas.");

    for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
        await page.setViewport({ width, height: 900 });
        await page.$eval("[data-consent-map]", element => element.scrollIntoView({ block: "center" }));
        const bounds = await page.$eval("[data-consent-map]", element => {
            const control = element.querySelector("[data-map-accept]").getBoundingClientRect();
            const frame = element.getBoundingClientRect();
            return { height: frame.height, controlFits: control.top >= frame.top && control.bottom <= frame.bottom, overflow: document.documentElement.scrollWidth > innerWidth };
        });
        assert.equal(bounds.height, width < 640 ? 320 : 400);
        assert.equal(bounds.controlFits, true);
        assert.equal(bounds.overflow, false);
        if ([1440, 390].includes(width)) await page.screenshot({ path: `C:/Users/PC-user/AppData/Local/Temp/opencode/maps-consent-${width}.png` });
        await enable(page);
        assert.equal(await page.$eval("[data-consent-map]", element => element.getBoundingClientRect().height), bounds.height);
        await click(page, "[data-map-revoke]");
    }
    await context.close();
    for (const [label, javascript, blockedStorage] of [["sin JavaScript", false, false], ["almacenamiento bloqueado", true, true]]) {
        const isolated = await browser.createBrowserContext();
        const item = await newPage(isolated, javascript, blockedStorage);
        await noFrame(item.page);
        assert.equal(item.maps.length, 0);
        assert.ok(await item.page.$$eval(".contact-page-map a[href]", links => links.some(link => link.textContent.includes("Cómo llegar") && link.href.startsWith("https://"))));
        if (javascript) {
            await enable(item.page);
            assert.equal(item.maps.length, 1);
            await click(item.page, "[data-map-revoke]");
            await noFrame(item.page);
        }
        await isolated.close();
        console.log(`OK: ${label}, sin carga automática y con dirección/enlace disponibles.`);
    }
    assert.deepEqual(errors, []);
    console.log("OK: marco original 320/400px y sin overflow en siete tamaños; Google interceptado, sin certificar cookies internas del servicio real.");
} finally {
    await browser.close();
    server.close();
}
