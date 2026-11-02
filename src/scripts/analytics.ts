import { CONSENT_KEY, CONSENT_DATE_KEY, readCookieConsent } from "./cookie-consent";
import { whatsappContactHref } from "../data/contact-links";

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        psicoAnalyticsInitialized?: boolean;
        [key: `ga-disable-${string}`]: boolean;
    }
}

const measurementId = (import.meta.env.PUBLIC_GA_MEASUREMENT_ID || "").trim();
const privacyReviewed = import.meta.env.PUBLIC_GA_PRIVACY_REVIEWED === "true";
const validId = /^G-[A-Z0-9]+$/.test(measurementId);
const deniedConsent = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
};

function initializeAnalytics() {
    if (window.psicoAnalyticsInitialized) return;
    window.psicoAnalyticsInitialized = true;

    let started = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer?.push(arguments);
    };
    // Solo una cola local: este código no carga recursos ni envía pings a Google.
    window.gtag("consent", "default", deniedConsent);
    if (validId) window[`ga-disable-${measurementId}`] = true;

    function pageContext() {
        // Canonical generada por Astro: nunca location.href, búsquedas ni fragmentos.
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const url = new URL(canonical?.href || "/", window.location.origin);
        url.search = "";
        url.hash = "";
        return {
            page_location: url.href,
            page_referrer: "",
            page_title: document.title,
        };
    }

    function sendEvent(name: "click_whatsapp" | "click_telefono" | "generate_lead") {
        if (!started || readCookieConsent() !== "all") return;
        window.gtag?.("event", name, {
            send_to: measurementId,
            ...pageContext(),
        });
    }

    function clearAnalyticsCookies() {
        const names = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0]);
        const hostnameParts = window.location.hostname.split(".");
        const domains = ["", ...hostnameParts.map((_, index) => hostnameParts.slice(index).join("."))];
        const paths = new Set(["/", ...window.location.pathname.split("/").map((_, index, parts) => parts.slice(0, index + 1).join("/") || "/")]);

        for (const name of names) {
            if (name !== "_ga" && !name.startsWith("_ga_")) continue;
            for (const path of paths) {
                for (const domain of domains) {
                    const expiry = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
                    document.cookie = domain ? `${expiry}; domain=${domain}` : expiry;
                    if (domain) document.cookie = `${expiry}; domain=.${domain}`;
                }
            }
        }
    }

    function updateAnalytics() {
        const allowed = readCookieConsent() === "all";
        if (!allowed) {
            if (validId) window[`ga-disable-${measurementId}`] = true;
            clearAnalyticsCookies();
            if (started) {
                started = false;
                window.gtag?.("consent", "update", deniedConsent);
                // Una recarga descarga también los listeners y temporizadores de gtag.
                // El siguiente documento vuelve al modo básico, sin cargar Google.
                window.location.reload();
            }
            return;
        }

        // La aprobación corresponde a las funciones concretas de docs/analytics.md,
        // no a desactivar toda la medición mejorada. No se infiere desde el navegador.
        if (!validId || !privacyReviewed || started) return;
        started = true;
        window[`ga-disable-${measurementId}`] = false;
        window.gtag?.("consent", "update", {
            ...deniedConsent,
            analytics_storage: "granted",
        });
        window.gtag?.("set", "ads_data_redaction", true);
        window.gtag?.("set", "url_passthrough", false);
        window.gtag?.("set", "allow_enhanced_conversions", false);
        // También los eventos automáticos heredan una URL pública sin query/hash.
        window.gtag?.("set", pageContext());
        window.gtag?.("js", new Date());
        window.gtag?.("config", measurementId, {
            // Única fuente de visitas: config de GA4. Nunca enviamos page_view a mano.
            send_page_view: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            allow_enhanced_conversions: false,
            first_party_collection: false,
            ignore_referrer: true,
            cookie_domain: "none",
            cookie_expires: 180 * 24 * 60 * 60,
            cookie_update: false,
            cookie_flags: "SameSite=Lax;Secure",
            campaign_source: "(direct)",
            campaign_medium: "(none)",
            campaign_name: "(not set)",
            campaign_id: "(not set)",
            campaign_term: "(not set)",
            campaign_content: "(not set)",
            ...pageContext(),
        });

        const script = document.createElement("script");
        script.id = "psico-ga4-tag";
        script.async = true;
        script.referrerPolicy = "no-referrer";
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.append(script);

    }

    document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest<HTMLAnchorElement>("a[href]");
        if (!link) return;
        if (link.protocol === "tel:") {
            sendEvent("click_telefono");
        } else if (link.origin === window.location.origin && link.pathname === whatsappContactHref) {
            sendEvent("click_whatsapp");
        }
        // No se transmite href, texto del enlace, números ni mensajes predefinidos.
    });

    document.addEventListener("contact-form-success", event => {
        if (event.target instanceof HTMLFormElement && event.target.id === "formulario") {
            sendEvent("generate_lead");
        }
    });
    window.addEventListener("cookie-consent-updated", updateAnalytics);
    window.addEventListener("storage", event => {
        if (event.key === null || event.key === CONSENT_KEY || event.key === CONSENT_DATE_KEY) updateAnalytics();
    });
    // Recupera la elección también al restaurar una página desde la caché atrás/adelante.
    window.addEventListener("pageshow", updateAnalytics);
    updateAnalytics();
}

initializeAnalytics();
