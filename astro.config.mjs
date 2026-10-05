// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

let hasPublishedBlogPosts = false;

// https://astro.build/config
export default defineConfig({
  site: 'https://psicoinfantilcastellon.es',
  trailingSlash: 'always',
  integrations: [
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
