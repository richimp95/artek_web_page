# Migración total a imágenes del catálogo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Nota de ejecución:** este plan se ejecuta vía Codex (decisión del usuario). No hacer commits; dejar cambios en working tree.

**Goal:** Reemplazar todas las imágenes viejas (`src/assets/gallery/`, `src/assets/portfolio/`, `src/assets/services/`, `hero-aluminio.jpg`) por las nuevas webp de `src/assets/catalogo/` en servicios, home y portafolio, y eliminar los assets viejos.

**Architecture:** Sitio Astro 5 estático bilingüe. Las imágenes entran por imports de `astro:assets` (ImageMetadata). Tres consumidores de assets viejos: `src/data/services.ts` (6 servicios), `src/components/HomeSections.astro` (mosaico featured de 4), `src/components/PortfolioGallery.astro` (4 imports viejos mezclados con 12 del catálogo). `src/data/portfolio.ts` y `src/assets/hero-aluminio.jpg` ya no tienen consumidores.

**Tech Stack:** Astro 5, astro:assets, TypeScript.

---

### Task 1: services.ts — imágenes de catálogo por servicio

**Files:**
- Modify: `src/data/services.ts:4-9`

- [x] **Step 1: Reemplazar imports viejos**

Sustituir líneas 4-9 por:

```ts
import imgChromaluxe from '../assets/catalogo/chromaluxe/chromaluxe.webp';
import imgAcrilico from '../assets/catalogo/impresiones-en-acrilico/impresiones-en-acrilico-01.webp';
import imgFineArt from '../assets/catalogo/aluminios-estandar/impresion-tipo-poster-acabado-mate.webp';
import imgEncapsulado from '../assets/catalogo/impresiones-en-acrilico/impresion-acrilica-de-4-mm-de-espesor-2.webp';
import imgGranFormato from '../assets/catalogo/aluminios-estandar/impresiones-tipo-poster-con-back-de-pvc.webp';
import imgArteMural from '../assets/catalogo/senalizacion/ambientacion-de-oficinas.webp';
```

Los nombres de variable no cambian, así que el resto del archivo (campos `image:`) queda intacto.

- [x] **Step 2: Verificar**

Run: `npx astro check 2>&1 | tail -3` (o `npm run build`)
Expected: sin errores de import.

### Task 2: HomeSections.astro — mosaico featured con catálogo

**Files:**
- Modify: `src/components/HomeSections.astro:11-14` (imports) y `:24-29` (array `featured`)

- [x] **Step 1: Reemplazar imports**

Sustituir:

```astro
import imgGlobos from '../assets/portfolio/globos-madera.jpg';
import imgFamilia from '../assets/portfolio/familia-aluminio.jpg';
import imgMuro from '../assets/portfolio/muro-galeria.jpg';
import imgColeccion from '../assets/portfolio/coleccion.jpg';
```

por:

```astro
import imgMuro from '../assets/catalogo/opciones-de-montaje-para-exposicion/back-de-madera-con-impresion-de-aluminio-alzada.webp';
import imgFamilia from '../assets/catalogo/chromaluxe/semi-gloss.webp';
import imgGlobos from '../assets/catalogo/impresion-de-invitaciones/invitaciones-para-fiestas.webp';
import imgColeccion from '../assets/catalogo/aluminio-estandar-delgado-para-productos-institucionales-y-placas-delgadas-impresas/placas-para-reconocimientos.webp';
```

- [x] **Step 2: Actualizar alts del array `featured`**

```ts
const featured = [
  { img: imgMuro, alt: lang === 'es' ? 'Back de madera con impresión en aluminio alzada' : 'Wood backing with raised aluminum print' },
  { img: imgFamilia, alt: lang === 'es' ? 'Impresión Chromaluxe acabado semi-gloss' : 'Chromaluxe print, semi-gloss finish' },
  { img: imgGlobos, alt: lang === 'es' ? 'Invitaciones impresas para fiestas' : 'Printed party invitations' },
  { img: imgColeccion, alt: lang === 'es' ? 'Placas de aluminio para reconocimientos' : 'Aluminum recognition plaques' },
];
```

- [x] **Step 3: Verificar**

Run: `npm run build 2>&1 | tail -3`
Expected: `22 page(s) built`, sin errores.

### Task 3: PortfolioGallery.astro — 100% catálogo

**Files:**
- Modify: `src/components/PortfolioGallery.astro:6-9` (imports viejos) y las entradas correspondientes del array de fuentes (`portfolioColeccion`, `portfolioFamilia`, `portfolioGlobos`, `portfolioMuro`).

- [x] **Step 1: Reemplazar imports viejos**

Sustituir:

```astro
import portfolioColeccion from '../assets/portfolio/coleccion.jpg';
import portfolioFamilia from '../assets/portfolio/familia-aluminio.jpg';
import portfolioGlobos from '../assets/portfolio/globos-madera.jpg';
import portfolioMuro from '../assets/portfolio/muro-galeria.jpg';
```

por:

```astro
import catalogChromaluxeMate from '../assets/catalogo/chromaluxe/mate.webp';
import catalogMagnetos from '../assets/catalogo/aluminios-estandar/impresion-de-magnetos-de-cualquier-tamano.webp';
import catalogImpresionesPata from '../assets/catalogo/opciones-de-montaje-para-exposicion/impresiones-con-pata.webp';
import catalogNumerosMesa from '../assets/catalogo/impresion-de-invitaciones/numeros-para-mesas.webp';
```

- [x] **Step 2: Reemplazar las 4 entradas del array**

Donde el array de fuentes usa `portfolioMuro` / `portfolioFamilia` / `portfolioGlobos` / `portfolioColeccion` (mantener el mismo formato de entrada `{ image, alt }` que las demás):

```ts
{ image: catalogChromaluxeMate, alt: 'Aluminio Chromaluxe con acabado mate' },
{ image: catalogMagnetos, alt: 'Impresión de magnetos de cualquier tamaño' },
{ image: catalogImpresionesPata, alt: 'Impresiones en aluminio con pata' },
{ image: catalogNumerosMesa, alt: 'Números de mesa impresos' },
```

Si los alts viejos se traducen por idioma, seguir el patrón existente del archivo.

- [x] **Step 3: Verificar**

Run: `npm run build 2>&1 | tail -3`
Expected: `22 page(s) built`, sin errores.

### Task 4: Eliminar assets y código muerto

**Files:**
- Delete: `src/assets/gallery/` (10 jpg), `src/assets/portfolio/` (4 jpg), `src/assets/services/` (3 jpg), `src/assets/hero-aluminio.jpg`, `src/data/portfolio.ts`

- [x] **Step 1: Confirmar cero referencias ANTES de borrar**

Run:
```bash
grep -rn "assets/gallery\|assets/portfolio\|assets/services\|hero-aluminio\|data/portfolio" src/
```
Expected: sin resultados (si aparece alguno, arreglarlo antes de borrar).

- [x] **Step 2: Borrar**

```bash
rm -rf src/assets/gallery src/assets/portfolio src/assets/services
rm src/assets/hero-aluminio.jpg src/data/portfolio.ts
```

Nota: `src/data/portfolio.ts` solo lo consumía nadie (verificado con grep); `src/assets/gallery/` solo lo consumía `portfolio.ts`. Borrar ambos juntos.

- [x] **Step 3: Verificar**

Run: `npm run build 2>&1 | tail -3`
Expected: `22 page(s) built`, sin errores.

### Task 5: Verificación final

- [x] **Step 1: Grep de seguridad**

```bash
grep -rn "\.jpg" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
```
Expected: cero referencias a jpg viejos de gallery/portfolio/services (og-image.jpg en public/ no cuenta, no está en src).

- [x] **Step 2: Build completo**

Run: `npm run build`
Expected: `[build] 22 page(s) built`, `[build] Complete!`

- [x] **Step 3: Reporte**

Reportar archivos modificados/borrados y cualquier desviación del plan. NO hacer commit.
