# Espaciado portafolio + captions servicio + portadas + rendimiento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Nota de ejecución:** ejecuta Codex. NO hacer commits.

**Goal:** (1) Arreglar el espaciado desigual del grid del portafolio, (2) caption visible sobre la imagen en el carrusel de servicios, (3) portadas nuevas por servicio (elegidas visualmente por el usuario/Claude), (4) optimizar el peso de imágenes que hace sentir lenta la página.

---

### Task 1: Portafolio — columnas balanceadas y gap consistente

**Files:**
- Modify: `src/components/ui/image-gallery.tsx:17-29`

**Causa:** reparto round-robin (`index % 3`) ignora las alturas: columnas terminan a alturas muy distintas → huecos abajo y ritmo visual roto.

- [x] **Step 1: Distribución greedy por altura acumulada**

```tsx
function distribute(images: ImageGalleryItem[], columnCount: number) {
  const columns: ImageGalleryItem[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);
  for (const image of images) {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(image);
    heights[shortest] += image.height / image.width; // altura relativa a ancho de columna
  }
  return columns;
}
```

Usar 3 columnas en lg, 2 en sm (la distribución debe recalcularse según breakpoint: aceptable hacerlo con CSS `columns`? NO — mantener grid actual; calcular `distribute(images, 3)` para lg y `distribute(images, 2)` para sm y elegir con matchMedia en cliente, o más simple: distribuir para 3 y en sm dejar que las 3 columnas colapsen a 2 con el grid — elegir la solución más simple que no reordene en hidratación de forma visible; documentar la elegida).

- [x] **Step 2: Gap consistente**

`tw:gap-4` (16px) en ambos ejes (contenedor y columnas) en vez de `tw:gap-6`; los items no deben estirarse: `tw:content-start`/`align-content: start` en cada columna.

- [x] **Step 3: Verificar** build + dev: columnas terminan casi parejas, sin huecos grandes, gap uniforme.

### Task 2: Carrusel de servicios — caption sobre la imagen

**Files:**
- Modify: `src/components/ui/thumbnail-carousel.tsx`

- [x] **Step 1:** Mover el caption del slide activo a overlay inferior SOBRE la imagen principal (mismo patrón visual que `portfolio-island__caption`: gradiente `from-black/70`, texto pequeño blanco/85, padding 12px). Mantener `aria-live="polite"` y el crossfade de 150ms. El contador (n/N) puede convivir arriba a la derecha como está.

- [x] **Step 2: Verificar** en dev: la descripción se lee sobre cada imagen del carrusel, sin tapar demasiado (gradiente alto ~5rem máx).

### Task 3: Portadas nuevas por servicio

**Files:**
- Modify: `src/data/services.ts` (campo `image` de cada servicio)

- [x] **Step 1: Actualizar imports de portada** (elegidas visualmente):

| Servicio | Nueva portada |
|---|---|
| chromaluxe | `catalogo/chromaluxe/gloss.webp` |
| acrilico | `catalogo/impresiones-en-acrilico/impresion-acrilica-de-4-mm-de-espesor-10x10-pulgadas.webp` |
| fine-art-paper | `catalogo/aluminios-estandar/impresiones-octogonales.webp` |
| encapsulado-acrilico | `catalogo/impresiones-en-acrilico/impresion-acrilica-de-4-mm-de-espesor-2.webp` (sin cambio) |
| gran-formato | `catalogo/aluminios-estandar/aluminios-estandar-en-distintos-acabados.webp` |
| arte-mural | `catalogo/opciones-de-montaje-para-exposicion/back-de-madera-con-impresion-de-aluminio-alzada.webp` |

(Duplicación puntual con el mosaico del home es aceptable.)

- [x] **Step 2: Verificar** build; portadas nuevas en home (cards), índice de servicios y hero de cada detalle.

### Task 4: Rendimiento — imágenes optimizadas por uso

**Causa principal de lentitud:** los islands reciben `image.src` crudo (webp de hasta 1600px). Los thumbnails de 35-120px del carrusel cargan la imagen completa; el grid del portafolio (~350px de ancho render) carga 1600px.

**Files:**
- Modify: `src/components/ServiceDetail.astro`, `src/components/ui/thumbnail-carousel.tsx`, `src/components/PortfolioGallery.astro`, `src/components/Hero.astro` (si también pasa src crudo)

- [x] **Step 1: ServiceDetail** — generar variantes con `getImage`:

```astro
const carouselImages = await Promise.all(service.gallery.map(async (g) => {
  const [main, thumb] = await Promise.all([
    getImage({ src: g.image, width: 1000, format: 'webp' }),
    getImage({ src: g.image, width: 240, format: 'webp' }),
  ]);
  return { src: main.src, thumbSrc: thumb.src, alt: g.alt[lang] };
}));
```

`ThumbnailCarousel` acepta `thumbSrc?: string` y lo usa en la tira (fallback a `src`).

- [x] **Step 2: PortfolioGallery** — el grid usa variante `width: 800`; el lightbox recibe la de 1600 (`fullSrc`) — ajustar `openLightbox` para usar `fullSrc`.

- [x] **Step 3: Hero** — revisar `Hero.astro`/`card-carousel.tsx`: si pasa `image.src` crudo, cambiar a `getImage width: 640` (los slides son ~300-500px). Primera imagen mantiene eager + fetchpriority.

- [x] **Step 4: Hydration** — confirmar galería y carruseles de detalle con `client:visible` (no `client:load`); solo el hero puede ser `client:load`.

- [x] **Step 5: Verificar** — build y comparar peso: `du -sh dist/_astro` antes/después + contar bytes de imágenes referenciadas en `/portafolio/` y un detalle de servicio (grep de srcs en HTML y stat de esos archivos en dist). Reportar el ahorro.

**Nota para el usuario:** el dev server (`npm run dev`) optimiza imágenes al vuelo y siempre se siente lento; la vara real es `npm run build && npm run preview`.

### Task 5: Verificación final

- [x] `npm run build` → 22 páginas sin errores.
- [x] Reporte: archivos modificados, ahorro de peso medido, decisión tomada en Task 1 Step 1. NO commit.
