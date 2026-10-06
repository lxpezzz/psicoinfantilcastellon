import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
    const sitemapURL = new URL("/sitemap-index.xml", site);
    const robots = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "",
        `Sitemap: ${sitemapURL.href}`,
        "",
    ].join("\n");

    return new Response(robots, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
