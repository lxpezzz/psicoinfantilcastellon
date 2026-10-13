import { businessEntity, serviceEntities } from "./home-schema";
import { siteUrl } from "./site.mjs";

export function getServiceSchema(pathname: string) {
    const url = new URL(pathname, siteUrl).href;
    const service = serviceEntities.find((entity) => entity.url === url);

    if (!service) {
        throw new Error(`No hay un servicio definido para ${url}`);
    }

    return {
        "@context": "https://schema.org",
        "@graph": [businessEntity, service],
    };
}
