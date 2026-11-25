import analyticsPrivacy from "../data/analytics-privacy.json" with { type: "json" };

const defaultAttributionPolicy = analyticsPrivacy.acquisitionAttribution;

function normalizeToken(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/**
 * Resuelve únicamente orígenes de referencia y campañas UTM expresamente
 * permitidos en src/data/analytics-privacy.json.
 * - Nunca devuelve rutas, consultas, fragmentos ni credenciales del referrer.
 * - Nunca clasifica manualmente un referrer genérico de Google como orgánico:
 *   solo conserva el origen saneado para que GA4 aplique sus propias reglas.
 * - Ignora cualquier UTM no listado (incluidos utm_term y utm_id).
 */
export function resolveSanitizedAttribution(
    rawReferrer = "",
    rawSearch = "",
    currentOrigin = "",
    policy = defaultAttributionPolicy,
) {
    const allowedHosts = new Set(
        (policy?.allowedReferrerHosts || []).map(normalizeToken).filter(Boolean),
    );
    const allowedCampaigns = Array.isArray(policy?.allowedCampaigns)
        ? policy.allowedCampaigns
        : [];

    const params = new URLSearchParams(rawSearch || "");
    const source = normalizeToken(params.get("utm_source"));
    const medium = normalizeToken(params.get("utm_medium"));
    const name = normalizeToken(params.get("utm_campaign"));
    const content = normalizeToken(params.get("utm_content"));

    if (source && medium && name) {
        const matched = allowedCampaigns.find(
            (entry) =>
                normalizeToken(entry.source) === source &&
                normalizeToken(entry.medium) === medium &&
                normalizeToken(entry.name) === name,
        );

        if (matched) {
            const allowedContent = new Set(
                (matched.allowedContent || []).map(normalizeToken).filter(Boolean),
            );
            /** @type {{ source: string; medium: string; name: string; content?: string }} */
            const campaign = {
                source: normalizeToken(matched.source),
                medium: normalizeToken(matched.medium),
                name: normalizeToken(matched.name),
            };
            if (content && allowedContent.has(content)) {
                campaign.content = content;
            }
            return {
                page_referrer: "",
                campaign,
            };
        }
    }

    if (rawReferrer) {
        try {
            const refUrl = new URL(rawReferrer);
            const isWebProtocol =
                refUrl.protocol === "https:" || refUrl.protocol === "http:";
            const hostname = refUrl.hostname.toLowerCase();
            let sameOrigin = false;
            if (currentOrigin) {
                try {
                    sameOrigin = refUrl.origin === new URL(currentOrigin).origin;
                } catch {
                    sameOrigin = false;
                }
            }
            if (isWebProtocol && !sameOrigin && allowedHosts.has(hostname)) {
                return {
                    page_referrer: `${refUrl.protocol}//${hostname}/`,
                    campaign: null,
                };
            }
        } catch {
            // Referrer inválido o no parseable: se descarta por completo.
        }
    }

    return {
        page_referrer: "",
        campaign: null,
    };
}
