# Fix galería + carruseles por servicio + SEO local GT — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Nota de ejecución:** ejecuta Codex (decisión del usuario). NO hacer commits. Spec de referencia: `docs/superpowers/specs/2026-07-12-seo-local-gt-design.md`.

**Goal:** (1) Arreglar imágenes del portafolio que no aparecen, (2) dar a cada servicio un carrusel con múltiples imágenes del catálogo, (3) implementar el SEO técnico local GT aprobado en el spec.

**Architecture:** Astro 5 estático bilingüe (es raíz, en `/en/`), React islands con Tailwind v4 prefijo `tw:` (sin preflight), imágenes `src/assets/catalogo/**`. Dual deploy por `DEPLOY_TARGET` (`ftp`=producción artekgt.com, `pages`=staging noindex).

**Tech Stack:** Astro 5, astro:assets, React 19, framer-motion, Tailwind v4 (`tw:`), TypeScript.

---

### Task 0: Fix — imágenes del portafolio invisibles (bug de hidratación)

**Files:**
- Modify: `src/components/ui/image-gallery.tsx:39-83`

**Causa:** `onLoad` se registra al hidratar; las imágenes ya cargadas antes (caché/above-the-fold) nunca disparan `onLoad` → `isLoading` queda `true` → `tw:opacity-0` permanente.

- [x] **Step 1: Chequear `img.complete` al montar**

En `AnimatedImage`, agregar ref al `<img>` y efecto de montaje:

```tsx
function AnimatedImage({ image }: AnimatedImageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [isLoading, setIsLoading] = React.useState(true);
  const ratio = image.width / image.height;

  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, []);
  // ... resto igual, y en el <img>: ref={imgRef}
```

- [x] **Step 2: Verificar**

`npm run build` OK y prueba manual en dev: recargar /portafolio/ con caché caliente (Ctrl+R normal, no hard reload) — todas las imágenes visibles.

### Task 1: services.ts — galería de imágenes por servicio

**Files:**
- Modify: `src/data/services.ts`

- [x] **Step 1: Extender interface**

```ts
export interface Service {
  // ...campos existentes...
  image: ImageMetadata;
  /** Imágenes del carrusel del detalle (4-8, del catálogo). */
  gallery: ImageGalleryEntry[];
}

export interface ImageGalleryEntry {
  image: ImageMetadata;
  alt: Record<Lang, string>;
}
```

- [x] **Step 2: Poblar `gallery` por servicio con imports de `src/assets/catalogo/`**

Mapeo (usar estos archivos; alts descriptivos es/en desde el nombre):

- `chromaluxe`: chromaluxe/board-completo-de-aluminio-chromaluxe, gloss, gloss-clear, semi-gloss, mate, texturizado, chromaluxe (7)
- `acrilico`: impresiones-en-acrilico/ los 6 archivos
- `fine-art-paper`: aluminios-estandar/impresion-tipo-poster-acabado-mate, impresiones-tipo-poster-con-back-de-pvc, impresion-tipo-poster-con-back-de-pvc-tamanos-variados-acabado-brillante, impresiones-octogonales, impresiones-redondas-en-aluminio-estandar (5)
- `encapsulado-acrilico`: impresiones-en-acrilico/impresion-acrilica-de-4-mm-de-espesor-10x10-pulgadas, impresion-acrilica-de-4-mm-de-espesor-2, impresion-acrilica-de-4-mm-de-espesor-parte-de-atras + opciones-de-montaje-para-exposicion/bases-acrilicas-para-fotografias-impresas-en-acrilico, bases-acrilicas-para-impresion-en-aluminio-2 (5)
- `gran-formato`: senalizacion/senalizacion, senalizacion-circular-propuestas-diferentes, impresion-de-marcas + aluminios-estandar/aluminios-estandar-en-distintos-acabados, aluminio-estandar-plateado-dorado-y-color-cobre (5)
- `arte-mural`: senalizacion/ambientacion-de-oficinas + opciones-de-montaje-para-exposicion/montaje-con-separadores-de-vidrio, back-de-madera-con-impresion-de-aluminio-alzada, colgadores-de-madera-a-la-medida, colgador-de-aluminio-tipo-bastidor, impresiones-con-pata (6)

- [ ] **Step 3: Verificar** `npx astro check` sin errores de tipos.

  Nota de ejecución: `npx astro check` pidió instalar `@astrojs/check` y `typescript`; con red bloqueada no se instaló. `npm run build` sí valida correctamente las 22 páginas.

### Task 2: thumbnail-carousel.tsx — componente island

**Files:**
- Create: `src/components/ui/thumbnail-carousel.tsx`

- [x] **Step 1: Crear componente**

Adaptación del componente del usuario (drag horizontal con framer-motion, flechas, contador, tira de thumbnails que expande el activo). Cambios obligatorios respecto al original:
- Sin datos hardcodeados/Unsplash: props `images: { src: string; alt: string }[]`.
- TypeScript estricto (tipar refs, sin `@ts-ignore`).
- Clases Tailwind con prefijo `tw:` (v4); mantener las constantes FULL_WIDTH_PX=120, COLLAPSED_WIDTH_PX=35, GAP_PX=2, MARGIN_PX=2 y la lógica de scroll/drag/velocity intactas.
- Altura del slide principal responsive: `tw:h-[400px]` desktop, menor en móvil (`tw:h-[260px] tw:md:h-[400px]`).
- Tema oscuro del sitio: fondo del carrusel panel oscuro (`tw:bg-white/5`), botones flecha `tw:bg-white/90 tw:text-black`, contador como el original.
- Export nombrado `ThumbnailCarousel`.

Esqueleto de la firma:

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export interface CarouselImage { src: string; alt: string }
interface ThumbnailCarouselProps { images: CarouselImage[] }

export function ThumbnailCarousel({ images }: ThumbnailCarouselProps) { /* lógica del original adaptada */ }
```

- [x] **Step 2: Verificar** `npm run build` sin errores.

### Task 3: ServiceDetail.astro — integrar carrusel

**Files:**
- Modify: `src/components/ServiceDetail.astro:44-50` (bloque `service-detail__media`)

- [x] **Step 1: Reemplazar la `<Image>` única**

En el frontmatter:

```astro
import { ThumbnailCarousel } from './ui/thumbnail-carousel';

const carouselImages = service.gallery.map((g) => ({
  src: g.image.src,
  alt: g.alt[lang],
}));
```

En el markup, dentro de `service-detail__media` (conservar `data-reveal="scale"`):

```astro
<ThumbnailCarousel client:visible images={carouselImages} />
```

Mantener la primera imagen como fallback noscript o dejar el island como único media (decisión: island único; el HTML server-rendered del island ya muestra el primer slide sin JS).

- [ ] **Step 2: Verificar** dev server: cada `/servicios/<slug>/` muestra carrusel con sus imágenes, drag + flechas + thumbnails funcionan, es/en OK.

  Nota de ejecución: el dev server no pudo abrir puerto en el sandbox (`listen EPERM` en `127.0.0.1:4322`). Se verificó por build que cada detalle ES/EN contiene la island SSR `ThumbnailCarousel` con múltiples imágenes reales, flechas, contador y thumbnails.

### Task 4: robots dinámico + noindex staging

**Files:**
- Delete: `public/robots.txt`
- Create: `src/pages/robots.txt.ts`
- Modify: `src/components/SEO.astro`

- [x] **Step 1: Endpoint**

```ts
import type { APIRoute } from 'astro';

const isPages = (process.env.DEPLOY_TARGET ?? 'ftp') === 'pages';

export const GET: APIRoute = ({ site }) => {
  const body = isPages
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

- [x] **Step 2: Meta noindex solo en Pages** — en SEO.astro:

```astro
{import.meta.env.DEPLOY_TARGET_IS_PAGES /* o leer process.env.DEPLOY_TARGET en frontmatter */ && (
  <meta name="robots" content="noindex, nofollow" />
)}
```

(En frontmatter de SEO.astro: `const isPages = (process.env.DEPLOY_TARGET ?? 'ftp') === 'pages';` — se evalúa en build, sitio estático.)

- [x] **Step 3: Verificar** build default (ftp): `dist/robots.txt` con sitemap de artekgt.com y sin meta noindex; build con `DEPLOY_TARGET=pages npm run build`: robots `Disallow: /` y noindex presente en HTML.

### Task 5: JSON-LD — LocalBusiness global, WebSite, BreadcrumbList, Service

**Files:**
- Create: `src/data/schema.ts` (builders JSON-LD, fuente única de NAP)
- Modify: `src/components/SEO.astro` (LocalBusiness siempre presente además del jsonLd por página), páginas/layouts que pasan jsonLd

- [x] **Step 1: `src/data/schema.ts`**

Extraer NAP real de `src/components/ContactSection.astro` / i18n (dirección, teléfono, WhatsApp, Instagram, horarios — usar exactamente los strings que ya muestra la página; NO inventar datos). Builders:

```ts
export function localBusiness(lang: Lang) { /* @type LocalBusiness, name Artek, address GT, telephone, geo si está en ContactSection, url https://artekgt.com/, image og-image, sameAs [instagram, google business share link], areaServed Guatemala, priceRange '$$' */ }
export function webSite(lang: Lang) { /* @type WebSite, inLanguage */ }
export function breadcrumbs(items: {name: string; url: string}[]) { /* BreadcrumbList */ }
export function serviceSchema(service: Service, lang: Lang) { /* @type Service, provider: localBusiness, areaServed GT */ }
```

Link del Business Profile para `sameAs`: https://share.google/5jmez2h4uIZPtlBEC

- [x] **Step 2: Inyectar** — SEO.astro emite LocalBusiness en todas las páginas; home agrega WebSite; servicios índice/detalle/portafolio/nosotros/contacto agregan BreadcrumbList; detalle agrega Service (revisar el jsonLd existente en `src/pages/servicios/[slug].astro` y `en/services/[slug].astro` — completar, no duplicar).

- [x] **Step 3: Verificar** `npm run build`; en dist, cada HTML tiene exactamente un bloque LocalBusiness válido (JSON parseable).

### Task 6: Titles/descriptions con keywords locales GT

**Files:**
- Modify: donde viven los strings de title/description por página (i18n/ui.ts o cada página — seguir el patrón existente)

- [x] **Step 1: Reescribir por página** (≤60 chars title, 140-160 description, sin cambiar copy visible):

| Página | ES title | EN title |
|---|---|---|
| Home | Impresión en aluminio y acrílico en Guatemala \| ARTEK | Aluminum & acrylic photo prints in Guatemala \| ARTEK |
| Servicios | Servicios de impresión fine art en Guatemala \| ARTEK | Fine art printing services in Guatemala \| ARTEK |
| ChromaLuxe | Impresión ChromaLuxe en aluminio Guatemala \| ARTEK | ChromaLuxe aluminum prints Guatemala \| ARTEK |
| Acrílico | Impresión en acrílico de alta gama Guatemala \| ARTEK | Premium acrylic prints Guatemala \| ARTEK |
| Fine art | Impresión fine art en papel de algodón GT \| ARTEK | Fine art paper printing Guatemala \| ARTEK |
| Encapsulado | Encapsulado en acrílico face-mount Guatemala \| ARTEK | Acrylic face-mount encapsulation Guatemala \| ARTEK |
| Gran formato | Impresión gran formato premium Guatemala \| ARTEK | Large-format premium printing Guatemala \| ARTEK |
| Arte mural | Arte mural a medida para interiores Guatemala \| ARTEK | Custom wall art for interiors Guatemala \| ARTEK |
| Portafolio | Portafolio de impresiones en aluminio y acrílico \| ARTEK | Aluminum & acrylic print portfolio \| ARTEK |
| Nosotros | ARTEK — Taller de impresión fine art en Guatemala | ARTEK — Fine art print studio in Guatemala |
| Contacto | Contacto — Cotiza tu impresión en Guatemala \| ARTEK | Contact — Get a print quote in Guatemala \| ARTEK |

Descriptions: redactar 140-160 chars por página/idioma incluyendo la keyword y un llamado a la acción (cotización por WhatsApp).

- [x] **Step 2: Verificar** grep en dist: cada HTML con title correcto, description presente única.

### Task 7: On-page fino

**Files:**
- Modify: `src/components/PortfolioGallery.astro` (alts por idioma), `src/components/Hero.astro` (alts por idioma), `src/components/SEO.astro` (og:locale:alternate)

- [x] **Step 1: Alts bilingües** — los arrays de imágenes de PortfolioGallery y Hero pasan a `alt: Record<Lang, string>` y se resuelven con `lang` actual (traducir los alts existentes al inglés para páginas EN).
- [x] **Step 2: `og:locale:alternate`** en SEO.astro: `<meta property="og:locale:alternate" content={lang === 'es' ? 'en_US' : 'es_GT'} />`.
- [x] **Step 3: H1 único** — verificar con `grep -c "<h1" dist/**/index.html` = 1 por página; corregir si alguna tiene 0 o 2+.

### Task 8: Quick wins Core Web Vitals

**Files:**
- Modify: `src/components/ui/card-carousel.tsx` (o Hero.astro), `src/layouts/BaseLayout.astro`

- [x] **Step 1: Hero LCP** — primera imagen del carrusel hero con `loading="eager"` y `fetchpriority="high"`; las demás lazy.
- [x] **Step 2: Preload fuentes** — `<link rel="preload" as="font" type="font/woff2" crossorigin>` para las AvantGarde woff2 usadas en headings (ver `src/assets/fonts/` y global.css).
- [x] **Step 3: Verificar** build OK; dist HTML contiene preload y fetchpriority.

### Task 9: Verificación final

- [x] `npm run build` → 22 páginas, `dist/robots.txt` correcto, `dist/.htaccess` presente.
- [x] `DEPLOY_TARGET=pages npm run build` → robots Disallow + noindex (luego volver a build normal).
- [x] JSON-LD: extraer bloques de dist/index.html y validar JSON parseable.
- [x] Reporte: archivos creados/modificados/borrados, desviaciones. NO commit.
