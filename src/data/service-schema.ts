import { businessEntity, homeUrl, serviceEntities } from "./home-schema";
import { services } from "./services";
import { siteUrl } from "./site.mjs";

export function getServiceSchema(pathname: string) {
    const url = new URL(pathname, siteUrl).href;
    const service = serviceEntities.find((entity) => entity.url === url);
    const serviceMeta = services.find(
        (item) => new URL(item.href, siteUrl).href === url,
    );

    if (!service || !serviceMeta) {
        throw new Error(`No hay un servicio definido para ${url}`);
    }

    const breadcrumbList = {
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: homeUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Servicios",
                item: new URL("/#servicios", siteUrl).href,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: serviceMeta.shortTitle,
                item: url,
            },
        ],
    };

    return {
        "@context": "https://schema.org",
        "@graph": [businessEntity, service, breadcrumbList],
    };
}
