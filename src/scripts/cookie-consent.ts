import { CONSENT_KEY, CONSENT_DATE_KEY, CONSENT_LIFETIME, validateCookieConsent } from "./cookie-consent-state.mjs";
export { CONSENT_KEY, CONSENT_DATE_KEY } from "./cookie-consent-state.mjs";

type CookieChoice = "all" | "necessary_only";
let sessionChoice: CookieChoice | null = null;

export function readCookieConsent(): CookieChoice | null {
    try {
        // Leer nunca migra, renueva ni borra preferencias. Solo las acciones
        // explícitas del usuario escriben mediante saveCookieConsent.
        return validateCookieConsent(
            localStorage.getItem(CONSENT_KEY),
            localStorage.getItem(CONSENT_DATE_KEY),
            Date.now(),
            CONSENT_LIFETIME,
        );
    } catch {
        // Si el navegador bloquea el almacenamiento, solo recordamos esta página.
        return sessionChoice;
    }
}

export function saveCookieConsent(choice: CookieChoice) {
    sessionChoice = choice;
    try {
        localStorage.setItem(CONSENT_KEY, choice);
        localStorage.setItem(CONSENT_DATE_KEY, String(Date.now()));
    } catch {
        // El banner y los controles siguen funcionando sin localStorage.
    }

    window.dispatchEvent(new CustomEvent("cookie-consent-updated", {
        detail: { analytics: choice === "all" },
    }));
}
