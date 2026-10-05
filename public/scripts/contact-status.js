function checkContactUrlStatus() {
    const errorBanner = document.getElementById("contact-error");
    const errorTitle = document.getElementById("contact-error-title");
    const errorDesc = document.getElementById("contact-error-desc");
    if (!errorBanner || !errorTitle || !errorDesc) return;

    errorBanner.hidden = true;
    errorTitle.textContent = "";
    errorDesc.textContent = "";

    const params = new URLSearchParams(window.location.search);
    const errorType = params.get("error");

    if (errorType === "1") {
        errorTitle.textContent = "No se ha podido enviar el mensaje";
        errorDesc.textContent =
            "Por favor, revisa que todos los campos requeridos estén completos y acepta la política de privacidad.";
        errorBanner.hidden = false;
    } else if (errorType === "envio") {
        errorTitle.textContent = "No se ha podido enviar el mensaje";
        errorDesc.textContent =
            "No ha sido posible enviar el mensaje en este momento debido a un problema temporal en el servidor. Por favor, llámanos directamente al 614 99 21 48.";
        errorBanner.hidden = false;
    }
}

document.addEventListener("DOMContentLoaded", checkContactUrlStatus);
document.addEventListener("astro:page-load", checkContactUrlStatus);
