import { location } from "./location";
import { services } from "./services";
import { siteUrl } from "./site.mjs";

export const homeUrl = new URL("/", siteUrl).href;
export const websiteId = `${homeUrl}#website`;
export const businessId = `${homeUrl}#business`;
export const brandName = "PsicoInfantil Castellón";

// Nombre, colegiación, formación y puesto publicados en Sobre mí; áreas respaldadas por sus páginas de contenido.
export const professional = {
    "@type": "Person",
    "@id": `${homeUrl}#professional`,
    name: "Ana Díaz Berbel",
    url: new URL("/sobre-mi/", siteUrl).href,
    image: new URL("/og/sobre-mi.jpg", siteUrl).href,
    jobTitle: "Psicóloga infantil y juvenil",
    worksFor: { "@id": businessId },
    identifier: {
        "@type": "PropertyValue",
        name: "Número de colegiada (COP Comunitat Valenciana)",
        value: "CV08027",
    },
    memberOf: {
        "@type": "Organization",
        name: "Col·legi Oficial de Psicologia de la Comunitat Valenciana",
    },
    alumniOf: [
        {
            "@type": "CollegeOrUniversity",
            name: "Universitat de València",
        },
        {
            "@type": "CollegeOrUniversity",
            name: "Universidad Internacional de La Rioja (UNIR)",
        },
    ],
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

export const businessEntity = {
    "@type": "MedicalBusiness",
    "@id": businessId,
    name: brandName,
    url: homeUrl,
    logo: new URL("/logo_psicoinfantil.svg", siteUrl).href,
    image: new URL("/og/home.jpg", siteUrl).href,
    hasMap: location.googleMapsUrl,
    areaServed: {
        "@type": "City",
        name: "Castelló de la Plana",
    },
    address: {
        "@type": "PostalAddress",
        streetAddress: location.streetAddress,
        addressLocality: "Castelló de la Plana",
        postalCode: "12005",
        addressRegion: "Castelló",
        addressCountry: "ES",
    },
    // Teléfono publicado en Header.astro y Footer.astro.
    telephone: "+34614992148",
};

export const serviceEntities = services.map((service) => {
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
            ...businessEntity,
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
