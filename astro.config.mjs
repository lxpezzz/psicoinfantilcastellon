// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://psicoinfantilcastellon.es',
  integrations: [sitemap()],
  redirects: {
    '/cookies': '/politica-de-cookies',
    '/politica-de-privacidad': '/privacidad',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
