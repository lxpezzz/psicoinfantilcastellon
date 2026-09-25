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
    '/asesoramiento-a-padres': '/services/asesoramiento-a-padres',
    '/evaluacion-y-diagnostico': '/services/evaluacion-y-diagnostico',
    '/informes-psicopedagogicos': '/services/informes-psicopedagogicos',
    '/mejora-del-rendimiento-escolar': '/services/mejora-del-rendimiento-escolar',
    '/orientacion-adolescentes': '/services/orientacion-adolescentes',
    '/tratamiento-altas-capacidades': '/services/tratamiento-altas-capacidades',
    '/tratamiento-dislexia': '/services/tratamiento-dislexia',
    '/tratamiento-tdah': '/services/tratamiento-tdah',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
