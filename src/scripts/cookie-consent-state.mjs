export const CONSENT_KEY = "psico_cookie_consent";
export const CONSENT_DATE_KEY = "psico_cookie_consent_updated_at";
export const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;

// Pura y sin dependencias: la misma validación se usa en head y en los módulos.
export function validateCookieConsent(choice, storedDate, now, lifetime) {
    if (choice !== "all" && choice !== "necessary_only") return null;
    // Compatibilidad con las elecciones del banner anterior, sin fecha.
    if (!storedDate) return choice;
    const date = Number(storedDate);
    if (!Number.isFinite(date) || date > now || now - date >= lifetime) return null;
    return choice;
}
