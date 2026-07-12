// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Despliegue dual según el entorno (lo fija cada workflow con DEPLOY_TARGET):
//  - 'pages' → GitHub Pages (staging), sirve bajo /artek_web_page/
//  - 'ftp'   → servidor propio artekgt.com (producción), sirve en la raíz
// Por defecto 'ftp' (producción) para builds locales y el deploy a FTP.
const TARGET = process.env.DEPLOY_TARGET ?? 'ftp';
const isPages = TARGET === 'pages';
const SITE = isPages ? 'https://richimp95.github.io' : 'https://artekgt.com';
const BASE = isPages ? '/artek_web_page' : '/';

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
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
  },
  // La barra de herramientas de dev se solapaba con el menú móvil al revisar.
  // No afecta a producción (es solo de desarrollo); la apagamos.
  devToolbar: { enabled: false },
});
