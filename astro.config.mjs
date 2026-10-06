// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFile, writeFile } from 'node:fs/promises';
import { siteUrl } from './src/data/site.mjs';

let hasPublishedBlogPosts = false;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  integrations: [
    {
      name: 'canonical-domain-server-config',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const template = await readFile(new URL('./public/.htaccess', import.meta.url), 'utf8');
          const hostPattern = new URL(siteUrl).hostname.replaceAll('.', '\\.');
          const serverConfig = template
            .replaceAll('{{CANONICAL_ORIGIN}}', siteUrl)
            .replaceAll('{{CANONICAL_HOST_PATTERN}}', hostPattern);

          await writeFile(new URL('.htaccess', dir), serverConfig, 'utf8');
        },
      },
    },
    // Se ejecuta antes del sitemap; las rutas de artículos proceden de getPublishedPosts().
    {
      name: 'blog-sitemap-visibility',
      hooks: {
        'astro:build:done': ({ pages }) => {
          hasPublishedBlogPosts = pages.some(({ pathname }) => /^\/?blog\/[^/]/.test(pathname));
        },
      },
    },
    sitemap({
      filter: (page) => !page.includes('/gracias/') &&
        (new URL(page).pathname !== '/blog/' || hasPublishedBlogPosts),
    }),
  ],
  redirects: {
    '/cookies': '/politica-de-cookies/',
    '/politica-de-privacidad': '/privacidad/',
    '/services/asesoramiento-a-padres': '/asesoramiento-a-padres/',
    '/services/evaluacion-y-diagnostico': '/evaluacion-y-diagnostico/',
    '/services/informes-psicopedagogicos': '/informes-psicopedagogicos/',
    '/services/mejora-del-rendimiento-escolar': '/mejora-del-rendimiento-escolar/',
    '/services/orientacion-adolescentes': '/orientacion-adolescentes/',
    '/services/tratamiento-altas-capacidades': '/tratamiento-altas-capacidades/',
    '/services/tratamiento-dislexia': '/tratamiento-dislexia/',
    '/services/tratamiento-tdah': '/tratamiento-tdah/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
