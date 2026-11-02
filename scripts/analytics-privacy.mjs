import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const policy = JSON.parse(await readFile(new URL("../src/data/analytics-privacy.json", import.meta.url), "utf8"));

// Se analiza únicamente JSON de configuración, nunca se ejecuta código remoto.
export function inspectRemoteTag(source, measurementId) {
    const marker = source.match(/"resource"\s*:\s*\{/);
    if (!marker) return { checks: [{ feature: "Formato remoto", status: "unknown" }] };
    const start = source.indexOf("{", marker.index);
    let depth = 0;
    let inString = false;
    let escaped = false;
    let resource;
    try {
        for (let index = start; index < source.length; index++) {
            const character = source[index];
            if (inString) {
                if (escaped) escaped = false;
                else if (character === "\\") escaped = true;
                else if (character === '"') inString = false;
            } else if (character === '"') inString = true;
            else if (character === "{") depth++;
            else if (character === "}" && --depth === 0) {
                resource = JSON.parse(source.slice(start, index + 1));
                break;
            }
        }
    } catch {
        return { checks: [{ feature: "Formato remoto", status: "unknown" }] };
    }
    if (!Array.isArray(resource?.tags)) return { checks: [{ feature: "Formato remoto", status: "unknown" }] };

    const tags = resource.tags;
    const detector = tags.find(tag => tag.function === "__ogt_auto_events");
    const hasCollector = expression => tags.some(tag => expression.test(tag.function) && tag.vtp_instanceDestinationId === measurementId);
    const checks = [];
    const check = (feature, passed) => checks.push({ feature, status: passed === undefined ? "unknown" : passed ? "pass" : "fail" });

    check("Destino GA4", tags.some(tag => tag.function === "__dest_ga" && tag.vtp_destinationId === measurementId));
    // La visita por carga la emite config(send_page_view:true). Google puede
    // omitir __ccd_em_page_view cuando se desactiva el historial; no es necesaria.
    check("Vistas de página", typeof detector?.vtp_enablePageView === "boolean" ? detector.vtp_enablePageView === policy.enhancedMeasurement.pageViews : undefined);
    for (const [key, label, detectorField, collector] of [
        ["scrolls", "Scroll", "vtp_enableScroll", /__ccd_em_scroll$/],
        ["outboundClicks", "Clics de salida", "vtp_enableOutboundClick", /__ccd_em_outbound_click$/],
        ["videos", "Vídeos", "vtp_enableVideo", /__ccd_em_video/],
        ["downloads", "Descargas", "vtp_enableDownload", /__ccd_em_(download|file_download)/],
        ["forms", "Formularios automáticos", "vtp_enableForm", /__ccd_em_form/],
    ]) {
        const expected = policy.enhancedMeasurement[key];
        const detected = detector?.[detectorField];
        check(label, typeof detected === "boolean" ? detected === expected && hasCollector(collector) === expected : undefined);
    }
    // Google no siempre publica un interruptor de detección separado para búsqueda.
    check("Búsqueda interna", hasCollector(/__ccd_em_(site_search|search)/) === policy.enhancedMeasurement.siteSearch);
    const pageView = tags.find(tag => tag.function === "__ccd_em_page_view" && tag.vtp_instanceDestinationId === measurementId);
    check("Historial (push/replace/popState)", detector?.vtp_enableHistoryEvents === false && pageView?.vtp_historyEvents !== true);
    check("Datos proporcionados por usuarios", !tags.some(tag => /__ogt_1p_data/.test(tag.function) && (tag.vtp_isEnabled !== false || tag.vtp_isAutoEnabled === true || tag.vtp_isManualEnabled === true)));
    const conversionSettings = tags.filter(tag => tag.function === "__ccd_conversion_marking");
    check("Sin conversiones genéricas duplicadas", !conversionSettings.some(tag => /"stringValue"\s*:\s*"(?:click|page_view|scroll|form_start|form_submit)"/.test(JSON.stringify(tag).replaceAll('\\"', '"'))));
    return { checks };
}

function decodeAttribute(value) {
    return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, decimal) => String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10)));
}

function readAttribute(anchor, name) {
    const match = anchor.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
    return decodeAttribute(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
}

export function auditOutboundHtml(html, origin) {
    origin = new URL(origin).origin;
    const problems = [];
    const reviewed = new Set(policy.reviewedOutboundUrls.map(value => new URL(value).href));
    for (const anchor of html.matchAll(/<a\b[^>]*>/gi)) {
        const href = readAttribute(anchor[0], "href");
        if (!href) continue;
        let url;
        try {
            url = new URL(href, origin);
        } catch {
            problems.push("URL de enlace no válida; requiere revisión");
            continue;
        }
        if (!["http:", "https:"].includes(url.protocol) || url.origin === origin) continue;
        if (!reviewed.has(url.href)) problems.push("Destino de salida no incluido en la revisión explícita de URLs");
        if (url.username || url.password || url.hash) problems.push("URL de salida con credenciales o fragmento");
        // GA4 puede adjuntar estos atributos al click automático. No se usa link_text.
        for (const attribute of ["id", "class"]) {
            const value = readAttribute(anchor[0], attribute);
            if (/@|%40|\d{7,}/i.test(value)) problems.push(`Atributo ${attribute} potencialmente identificativo`);
        }
    }
    return [...new Set(problems)];
}

export async function auditBuiltOutbound(directory, origin) {
    const problems = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) problems.push(...await auditBuiltOutbound(file, origin));
        else if (entry.name.endsWith(".html") && !file.endsWith(path.join("ir-a-whatsapp", "index.html"))) {
            const issues = auditOutboundHtml(await readFile(file, "utf8"), origin);
            problems.push(...issues.map(issue => `${file}: ${issue}`));
        }
    }
    return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const measurementId = process.argv[2] || process.env.PUBLIC_GA_MEASUREMENT_ID;
    if (!/^G-[A-Z0-9]+$/.test(measurementId || "")) throw new Error("Indica el ID G- como argumento.");
    const response = await fetch(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`No se pudo consultar la etiqueta pública: HTTP ${response.status}`);
    const report = inspectRemoteTag(await response.text(), measurementId);
    const issues = await auditBuiltOutbound("dist", "https://psicoinfantilcastellon.com");
    report.checks.push({ feature: "URLs y atributos de salida del build", status: issues.length ? "fail" : "pass" });
    console.table(report.checks);
    if (issues.length) console.log(issues.join("\n"));
    console.log("Comprobación de solo lectura. No modifica Google ni activa PUBLIC_GA_PRIVACY_REVIEWED. El formato de la etiqueta no es una API estable: requiere corroboración en el panel y en la red.");
    if (report.checks.some(check => check.status !== "pass")) process.exitCode = 1;
}
