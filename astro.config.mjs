// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { siteUrl } from './src/data/site.mjs';
import { auditBuiltOutbound } from './scripts/analytics-privacy.mjs';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

let hasPublishedBlogPosts = false;
const environment = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_GA_');

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  integrations: [
    {
      name: 'canonical-domain-server-config',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          if ((process.env.PUBLIC_GA_PRIVACY_REVIEWED || environment.PUBLIC_GA_PRIVACY_REVIEWED) === 'true') {
            const issues = await auditBuiltOutbound(fileURLToPath(dir), siteUrl);
            if (issues.length) throw new Error(`Privacidad de clics de salida: ${issues.join('\n')}`);
          }
          const template = await readFile(new URL('./public/.htaccess', import.meta.url), 'utf8');
          const hostPattern = new URL(siteUrl).hostname.replaceAll('.', '\\.');
          const serverConfig = template
            .replaceAll('{{CANONICAL_ORIGIN}}', siteUrl)
            .replaceAll('{{CANONICAL_HOST_PATTERN}}', hostPattern);

          await writeFile(new URL('.htaccess', dir), serverConfig, 'utf8');

          // El formulario activo usa Web3Forms; no publicar el PHP heredado con datos privados.
          await rm(new URL('api/contacto.php', dir), { force: true });
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
      filter: (page) => !page.includes('/gracias/') && !page.includes('/ir-a-whatsapp/') &&
        (new URL(page).pathname !== '/blog/' || hasPublishedBlogPosts),
    }),
  ],
  // Las redirecciones permanentes 301 se gestionan en public/.htaccess (emitido en dist/.htaccess)
  // para evitar archivos HTML HTTP 200 con meta refresh en LucusHost/LiteSpeed.
  vite: {
    plugins: [tailwindcss()],
  },
});
