// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Despliegue en GitHub Pages (project pages). Si más adelante se usa un dominio
// propio, cambiar `site` al dominio y `base` a '/'.
const SITE = 'https://richimp95.github.io';
const BASE = '/artek_web_page';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false, // ES en la raíz, EN bajo /en/
    },
  },
  integrations: [sitemap()],
});
