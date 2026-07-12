# SEO local Guatemala (es/en) para artekgt.com — Design

**Fecha:** 2026-07-12
**Alcance aprobado:** Opción A — SEO técnico completo consciente del dual-deploy, sobre páginas existentes (sin páginas nuevas ni blog).
**Objetivo:** posicionar búsquedas locales de Guatemala en español e inglés ("impresión en aluminio Guatemala", "ChromaLuxe Guatemala", "impresiones en acrílico", "acrylic prints Guatemala", etc.).

## Contexto

- Astro 5 estático bilingüe (es en raíz, en bajo `/en/`), `trailingSlash: 'always'`.
- Dual deploy por `DEPLOY_TARGET`: `ftp` → https://artekgt.com/ (producción, GoDaddy/Apache); `pages` → https://richimp95.github.io/artek_web_page/ (staging).
- SSL de producción ya válido (Let's Encrypt, redirect 301 http→https verificado 2026-07-12).
- Google Business Profile existe (https://share.google/5jmez2h4uIZPtlBEC). Search Console NO existe.
- SEO.astro ya emite: canonical, hreflang es/en + x-default, OG/Twitter, favicons, jsonLd opcional.
- JSON-LD actual solo en contacto y detalle de servicio.
- **Problemas detectados:** `public/robots.txt` apunta al sitemap de GitHub Pages; staging de Pages es indexable (contenido duplicado compitiendo con producción); sin LocalBusiness/BreadcrumbList/WebSite; alts de galería en español también en páginas EN; titles/descriptions sin keywords locales.

## Diseño

### 1. Indexación e infraestructura dual-deploy

- Eliminar `public/robots.txt`. Crear endpoint `src/pages/robots.txt.ts` que genera según `DEPLOY_TARGET`:
  - Producción: `User-agent: * / Allow: /` + `Sitemap: https://artekgt.com/sitemap-index.xml`.
  - Pages: `User-agent: * / Disallow: /`.
- En `SEO.astro`: si build es Pages, emitir `<meta name="robots" content="noindex, nofollow">` en todas las páginas.
- Verificar en dist que `sitemap-index.xml` existe y las URLs usan https://artekgt.com/.

### 2. Google Search Console

(Manual, guiado — no es código.)
- Verificar dominio `artekgt.com` por registro DNS TXT en GoDaddy (método preferido: cubre http/https/www).
- Enviar `sitemap-index.xml`; solicitar indexación de home es/en, servicios índice y los 6 detalles.
- Vincular la propiedad con el Google Business Profile existente.

### 3. Schema JSON-LD (es/en)

- `LocalBusiness` en todas las páginas (inyectado desde BaseLayout vía SEO.astro): nombre "Artek", NAP idéntico al Business Profile (dirección, teléfono), `geo`, `openingHours`, `url`, `image` (og-image), `sameAs` (Instagram y el enlace del Business Profile), `areaServed` Guatemala, `priceRange`.
- `WebSite` con `inLanguage` en home es/en.
- `BreadcrumbList` en: índice de servicios, detalle de servicio, portafolio, nosotros, contacto (Inicio → sección → detalle).
- `Service` en cada detalle de servicio (ya existe parcialmente — completar con `provider` → LocalBusiness, `areaServed`).
- Datos NAP exactos se toman de ContactSection.astro / i18n (fuente única; no duplicar strings).

### 4. Metas con keywords locales

- Reescribir `title` y `meta description` por página en ambos idiomas (es/en) en los archivos de página / i18n existentes:
  - Home: aluminio + Guatemala; EN: aluminum prints Guatemala.
  - Servicios índice + 6 detalles: keyword por servicio + "Guatemala".
  - Portafolio, nosotros, contacto: variantes con marca + ciudad.
- Formato title: `<Keyword primaria> | ARTEK Guatemala` (≤60 chars). Description 140-160 chars con llamado a la acción.
- El copy visible de las páginas NO cambia.

### 5. On-page fino

- Auditar un solo `<h1>` por página (build + grep).
- Alts de galería/carrusel localizados: páginas EN reciben alt en inglés (extender el contrato de imágenes con `alt: Record<Lang,string>` o pasar lang al componente).
- `og:locale:alternate` (es_GT ↔ en_US) en SEO.astro.

### 6. Quick wins Core Web Vitals

- Primera imagen del hero carousel: `loading="eager"` + `fetchpriority="high"`; resto lazy.
- `<link rel="preload">` de las fuentes AvantGarde woff2 usadas above-the-fold.
- Confirmar islands con `client:visible` donde aplique (galería) y `client:load` solo en hero.

## No incluido (YAGNI)

- Páginas nuevas por categoría de catálogo, blog/guías, link building, Google Ads, Analytics.

## Criterios de éxito

- `curl https://artekgt.com/robots.txt` muestra sitemap correcto; staging Pages responde `Disallow: /` y páginas con noindex.
- Rich Results Test pasa LocalBusiness/BreadcrumbList/Service sin errores.
- Search Console verificado con sitemap enviado y sin errores de cobertura.
- Lighthouse SEO ≥ 95 en home es/en; build 22 páginas sin errores.

## Ejecución

Plan de implementación vía skill writing-plans; ejecución delegada a Codex (`gpt-5.5 --effort xhigh`), verificación local (build + curls) por Claude. Sin commits hasta revisión del usuario.
