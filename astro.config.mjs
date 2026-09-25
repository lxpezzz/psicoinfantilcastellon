// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://psicoinfantilcastellon.es',
  integrations: [sitemap()],
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
