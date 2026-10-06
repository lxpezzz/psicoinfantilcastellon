import { location } from "./location";
import { services } from "./services";
import { siteUrl } from "./site.mjs";

const homeUrl = new URL("/", siteUrl).href;
const websiteId = `${homeUrl}#website`;
const businessId = `${homeUrl}#business`;
const brandName = "Psico Infantil Castellón";

// Nombre y puesto publicados en Sobre mí; áreas respaldadas por sus páginas de contenido.
export const professional = {
    "@type": "Person",
    "@id": `${homeUrl}#professional`,
    name: "Ana Díaz Berbel",
    jobTitle: "psicóloga sanitaria infantil y juvenil",
    knowsAbout: [
        "Psicología infantil",
        "Psicología juvenil",
        "TDAH",
        "Dislexia",
        "Altas capacidades",
        "Evaluación psicopedagógica",
        "Dificultades de aprendizaje",
        "Asesoramiento a familias",
    ],
    subjectOf: { "@id": websiteId },
};

const serviceEntities = services.map((service) => {
    const url = new URL(service.href, siteUrl).href;

    return {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        url,
        provider: { "@id": businessId },
    };
});

export const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": websiteId,
            url: homeUrl,
            name: brandName,
        },
        {
            "@type": "MedicalBusiness",
            "@id": businessId,
            name: brandName,
            url: homeUrl,
            address: {
                "@type": "PostalAddress",
                streetAddress: location.streetAddress,
                addressLocality: "Castelló de la Plana",
                postalCode: "12005",
                addressRegion: "Castelló",
                addressCountry: "ES",
            },
            // Teléfono y logo publicados en Header.astro.
            telephone: "+34614992148",
            logo: new URL("/logo_psicoinfantil.svg", siteUrl).href,
            subjectOf: { "@id": websiteId },
            makesOffer: serviceEntities.map((service) => ({
                "@type": "Offer",
                itemOffered: { "@id": service["@id"] },
            })),
        },
        professional,
        ...serviceEntities,
    ],
};
