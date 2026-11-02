// Verifica el estado previo al módulo y cada frame observado durante navegación.
import assert from "node:assert/strict";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { CONSENT_KEY, CONSENT_DATE_KEY, CONSENT_LIFETIME } from "../src/scripts/cookie-consent-state.mjs";

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
try {
    for (const width of [1440, 390]) {
        for (const [label, choice, date, hidden, modules = false] of [
            ["aceptado", "all", String(Date.now()), true],
            ["rechazado", "necessary_only", String(Date.now()), true],
            ["anterior sin fecha", "all", null, true],
            ["incógnito nuevo", null, null, false],
            ["valor inválido", "invalid", String(Date.now()), false],
            ["caducado", "all", String(Date.now() - CONSENT_LIFETIME - 60000), false],
            ["fecha futura", "all", String(Date.now() + 60000), false],
            ["fecha corrupta", "all", "not-a-date", false],
            ["aceptado con módulos", "all", String(Date.now()), true, true],
            ["rechazado con módulos", "necessary_only", String(Date.now()), true, true],
        ]) {
            const context = await browser.createBrowserContext();
            const page = await context.newPage();
            await page.setViewport({ width, height: 900 });
            page.on("pageerror", error => errors.push(error.message));
            await page.setRequestInterception(true);
            // Bloquear los módulos elimina cualquier posibilidad de que oculten
            // el banner después del primer pintado y falseen esta comprobación.
            page.on("request", async request => {
                if ((!modules && request.resourceType() === "script") || !request.url().startsWith(base)) await request.abort();
                else await request.continue();
            });
            await page.evaluateOnNewDocument((key, dateKey, value, savedDate) => {
                if (!sessionStorage.getItem("head-test-seeded")) {
                    if (value !== null) localStorage.setItem(key, value);
                    if (savedDate !== null) localStorage.setItem(dateKey, savedDate);
                    sessionStorage.setItem("head-test-seeded", "true");
                }
                window.bannerFrames = [];
                function inspect() {
                    const banner = document.getElementById("cookie-banner");
                    if (banner) {
                        const style = getComputedStyle(banner);
                        window.bannerFrames.push(style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0);
                    }
                    requestAnimationFrame(inspect);
                }
                requestAnimationFrame(inspect);
            }, CONSENT_KEY, CONSENT_DATE_KEY, choice, date);
            for (const route of ["/", "/contacto/", "/privacidad/"]) {
                await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });
                const state = await page.evaluate((key, dateKey) => ({
                    known: document.documentElement.hasAttribute("data-cookie-consent-known"),
                    displayed: (() => {
                        const style = getComputedStyle(document.getElementById("cookie-banner"));
                        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0;
                    })(),
                    initialized: document.getElementById("cookie-banner").dataset.initialized,
                    frames: window.bannerFrames,
                    choice: localStorage.getItem(key), date: localStorage.getItem(dateKey),
                    iframe: !!document.querySelector("[data-consent-map] iframe"),
                }), CONSENT_KEY, CONSENT_DATE_KEY);
                assert.equal(state.known, hidden);
                assert.equal(state.displayed, !hidden);
                assert.equal(state.initialized, modules ? "true" : undefined);
                assert.ok(state.frames.length > 0);
                assert.ok(state.frames.every(visible => visible === !hidden), `${label}: frame incorrecto`);
                assert.equal(state.choice, choice);
                assert.equal(state.date, date);
                assert.equal(state.iframe, false);
            }
            await page.reload({ waitUntil: "networkidle0" });
            assert.equal(await page.$eval("#cookie-banner", element => {
                const style = getComputedStyle(element);
                return style.display === "none" || Number(style.opacity) === 0;
            }), hidden);
            const before = await page.$eval("main", element => element.getBoundingClientRect().toJSON());
            await page.$eval("[data-cookie-settings]", element => element.click());
            if (modules) await page.waitForFunction(() => getComputedStyle(document.getElementById("cookie-banner")).opacity === "1");
            assert.equal(await page.$eval("#cookie-banner", element => getComputedStyle(element).display === "none"), false);
            assert.deepEqual(await page.$eval("main", element => element.getBoundingClientRect().toJSON()), before);
            await context.close();
            console.log(`OK: ${width}px ${label}: head síncrono, frames, navegación, recarga, preferencias intactas y reapertura sin módulo/shift.`);
        }
    }
    // Sin ejecutar ningún script, el HTML no esconde el aviso.
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setJavaScriptEnabled(false);
    await page.goto(base, { waitUntil: "networkidle0" });
    assert.equal(await page.$eval("#cookie-banner", element => getComputedStyle(element).display === "none"), false);
    await context.close();
    assert.deepEqual(errors, []);
    console.log("OK: sin JavaScript el aviso sigue visible; ninguna modificación de preferencias desde el head.");
} finally {
    await browser.close();
    server.close();
}
