function setupContactForm() {
    const form = document.getElementById("formulario");
    const errorBanner = document.getElementById("contact-error");
    const errorDesc = document.getElementById("contact-error-desc");
    const status = document.getElementById("contact-status");
    const button = form?.querySelector('button[type="submit"]');
    const buttonLabel = button?.querySelector("span");

    if (!form || !errorBanner || !errorDesc || !status || !button || !buttonLabel) return;
    if (form.dataset.web3formsBound) return;
    form.dataset.web3formsBound = "true";

    const originalLabel = buttonLabel.textContent;
    let sending = false;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (sending || !form.reportValidity()) return;

        errorBanner.hidden = true;
        errorDesc.textContent = "";
        status.hidden = true;
        status.textContent = "";

        const formData = new FormData(form);
        if (formData.get("privacidad") !== "1") return;

        sending = true;
        button.disabled = true;
        buttonLabel.textContent = "Enviando…";
        form.setAttribute("aria-busy", "true");
        status.hidden = false;
        status.textContent = "Enviando mensaje…";

        try {
            if (formData.get("botcheck") || formData.get("empresa")) {
                throw new Error("Honeypot activado");
            }

            const response = await fetch(form.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(Object.fromEntries(formData)),
                signal: AbortSignal.timeout(20000),
            });
            const result = await response.json();

            if (!response.ok || result.success !== true) {
                throw new Error("Web3Forms no ha aceptado el mensaje");
            }

            form.reset();
            status.textContent = "Gracias. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.";
        } catch {
            status.hidden = true;
            status.textContent = "";
            errorBanner.hidden = false;
            errorDesc.textContent = "No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos.";
        } finally {
            sending = false;
            button.disabled = false;
            buttonLabel.textContent = originalLabel;
            form.removeAttribute("aria-busy");
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupContactForm);
} else {
    setupContactForm();
}
document.addEventListener("astro:page-load", setupContactForm);
