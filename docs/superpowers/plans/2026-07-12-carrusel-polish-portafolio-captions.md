# Polish del carrusel de servicios + captions y aspect ratio en portafolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Nota de ejecución:** ejecuta Codex. NO hacer commits.

**Goal:** (1) Rediseñar botones e interacción del `ThumbnailCarousel` (hoy se ve crudo: glifos de texto ‹ ›, swap de imagen instantáneo, sin drag), (2) mostrar caption visible bajo cada imagen del portafolio, (3) eliminar franjas vacías: el marco de cada imagen debe tener exactamente el aspect ratio de su imagen.

**Architecture:** React islands en Astro con Tailwind v4 prefijo `tw:` (utilidades generadas según uso — si una clase `tw:` no aparece en el CSS generado, la utilidad no existe y el estilo no aplica: revisar `src/styles/tailwind.css` y el CSS de dist). framer-motion disponible.

**Principios de motion (aplicar en todo):** solo `transform`/`opacity`; ease-out custom `cubic-bezier(0.23, 1, 0.32, 1)`; UI ≤300ms; botones con `:active` scale 0.95-0.97; hover solo bajo `@media (hover: hover) and (pointer: fine)`; nada aparece desde `scale(0)`; respetar `prefers-reduced-motion` (sin movimiento, solo fades).

---

### Task 1: Diagnóstico de las franjas en portafolio

**Files:**
- Inspect: `src/styles/tailwind.css`, `dist/_astro/*.css`, `src/components/ui/image-gallery.tsx`

- [x] **Step 1: Confirmar causa**

```bash
npm run build && grep -o 'tw\\:object-cover\|tw\\:size-full' dist/_astro/*.css | sort | uniq -c
```

Si `tw:object-cover` o `tw:size-full` no existen en el CSS generado, la imagen no llena su marco → franjas. Revisar también si radix `AspectRatio` (padding-bottom hack) y el contenido absoluto están funcionando con las utilidades reales. Reportar la causa exacta encontrada antes de seguir.

Nota de ejecución: `tw:object-cover` y `tw:size-full` sí existen en `src/styles/tailwind.css` y aparecen en `dist/_astro/*.css`; la causa exacta de las franjas era el wrapper `data-radix-aspect-ratio-wrapper` de Radix (`padding-bottom` hack) alrededor del contenido. Se reemplazó por `figure` con `style={{ aspectRatio }}` nativo.

### Task 2: Portafolio — aspect ratio nativo + caption visible

**Files:**
- Modify: `src/components/ui/image-gallery.tsx`

- [x] **Step 1: Reemplazar radix AspectRatio por `aspect-ratio` CSS nativo**

Eliminar `AspectRatio` de este componente (menos indirection, imposible desincronizar):

```tsx
<figure
  ref={ref}
  className="portfolio-island__item tw:relative tw:m-0 tw:w-full tw:overflow-hidden tw:rounded-lg tw:border tw:border-white/10"
  style={{ aspectRatio: `${image.width} / ${image.height}` }}
>
  <button type="button" className="tw:block tw:size-full" onClick={openLightbox} aria-label={image.alt}>
    <img ... className="... tw:block tw:size-full tw:object-cover ..." />
  </button>
  <figcaption className="portfolio-island__caption">{image.alt}</figcaption>
</figure>
```

Con el marco al ratio exacto de la imagen, `object-cover` no recorta ni deja franjas. Si `src/components/ui/aspect-ratio.tsx` queda sin consumidores tras esto, eliminarlo junto con la dependencia `@radix-ui/react-aspect-ratio` del package.json (verificar con grep antes).

- [x] **Step 2: Caption visible**

Caption = el `alt` (descripción de lo que se ve, ya bilingüe). Estilo: overlay inferior con gradiente sutil, tipografía pequeña:

```tsx
<figcaption className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:bottom-0 tw:bg-gradient-to-t tw:from-black/70 tw:to-transparent tw:px-3 tw:pb-2 tw:pt-8 tw:text-left tw:text-xs tw:leading-snug tw:text-white/85">
  {image.alt}
</figcaption>
```

Si el gradiente `tw:` no se genera, usar clase CSS propia en `<style>` global del componente Astro contenedor (patrón `portfolio-island__caption` ya existe como convención). El caption es informativo — siempre visible (no solo en hover; en móvil no hay hover).

- [x] **Step 3: Verificar** build + dev: sin franjas, caption legible en cada tarjeta, lightbox sigue funcionando.

Nota de verificación: `npm run build` pasó y `dist` contiene el portafolio compilado sin Radix. El dev server no pudo abrir puerto en el sandbox (`listen EPERM` en `127.0.0.1:4322`), por lo que no se mantuvo servidor local.

### Task 3: ThumbnailCarousel — botones e interacción

**Files:**
- Modify: `src/components/ui/thumbnail-carousel.tsx`

- [x] **Step 1: Botones de flecha**

Reemplazar glifos ‹ › por SVG chevrons de lucide-react (`ChevronLeft`, `ChevronRight`, `tw:size-5`, `strokeWidth={2}`). Estilo acorde al tema oscuro (hoy son discos blancos que gritan):

```tsx
className="tw:absolute tw:left-3 tw:top-1/2 tw:z-10 tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border tw:border-white/15 tw:bg-black/55 tw:text-white tw:backdrop-blur-sm tw:transition-[transform,background-color] tw:duration-150 tw:ease-[cubic-bezier(0.23,1,0.32,1)] tw:hover:bg-black/75 tw:active:scale-95"
```

Hover con scale solo en puntero fino (si no se puede con utilidades, CSS del componente). En móvil los botones siempre visibles (no depender de hover).

- [x] **Step 2: Transición de slide (hoy el swap es instantáneo)**

Reemplazar el `<img key={...}>` seco por slide direccional + crossfade con framer-motion `AnimatePresence mode="popLayout"`; guardar dirección (+1/-1) al navegar:

```tsx
<AnimatePresence initial={false} custom={direction} mode="popLayout">
  <motion.img
    key={activeImage.src}
    custom={direction}
    variants={{
      enter: (d: number) => ({ transform: `translateX(${d * 24}px)`, opacity: 0 }),
      center: { transform: 'translateX(0px)', opacity: 1 },
      exit: (d: number) => ({ transform: `translateX(${d * -24}px)`, opacity: 0 }),
    }}
    initial="enter" animate="center" exit="exit"
    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    ...
  />
</AnimatePresence>
```

(Usar string `transform`, no shorthand `x` — hardware accelerated.) Con `prefers-reduced-motion` (hook `useReducedMotion`): solo opacity, sin translate.

- [x] **Step 3: Drag/swipe en la imagen principal**

El original lo tenía y se perdió. `motion.div` wrapper con `drag="x"`, `dragElastic={0.15}`, `dragMomentum={false}`; en `onDragEnd`: si `Math.abs(velocity.x) > 500` o `Math.abs(offset.x) > width*0.3` → navegar en esa dirección; si no, spring de vuelta. `tw:cursor-grab tw:active:cursor-grabbing` y `touch-action: pan-y` para no bloquear scroll vertical.

- [x] **Step 4: Teclado y accesibilidad**

`onKeyDown` en el contenedor (tabIndex 0): ArrowLeft/ArrowRight navegan SIN animación de entrada exagerada (mismo 220ms está bien, es ≤300ms). `aria-roledescription="carousel"`, `aria-live="polite"` en el contador. Thumbnails: `aria-label` con alt, `aria-current` en el activo.

- [x] **Step 5: Thumbnails con estado claro**

- Activo: `tw:ring-1 tw:ring-white/70` (o accent del sitio si existe token) + opacidad 100.
- Inactivos: `tw:opacity-50`, hover `tw:opacity-90` (gated hover), transición `opacity 150ms ease-out`.
- Mantener la animación de ancho existente (ya usa spring) y el auto-centrado.
- `tw:active:scale-95` en cada thumbnail.

- [x] **Step 6: Caption del slide activo**

Bajo el carrusel (o overlay inferior como el portafolio), mostrar `activeImage.alt` en texto pequeño muted — misma descripción bilingüe que ya viene en props. Con crossfade suave de 150ms al cambiar.

- [x] **Step 7: Verificar** build + dev en `/servicios/chromaluxe/` y uno EN: flechas, drag con flick, teclado, thumbnails, caption, reduced-motion (emular en DevTools).

Nota de verificación: el carrusel compiló en las páginas ES/EN de servicios y el JS generado contiene chevrons, `AnimatePresence`, swipe, teclado/ARIA, caption activo y CSS de reduced motion. El dev server no pudo abrir puerto en el sandbox (`listen EPERM`).

### Task 4: Verificación final

- [x] `npm run build` → 22 páginas sin errores; confirmar en dist CSS que TODAS las utilidades `tw:` nuevas usadas existen (grep de 3-4 clases clave, p. ej. `tw:active:scale-95`, `tw:backdrop-blur-sm`).
- [x] Si alguna utilidad no se genera (por la config curada de tailwind.css), agregarla a la config o usar CSS propio — nunca dejar clases muertas.
- [x] Reporte: causa raíz de las franjas, archivos modificados, decisiones. NO commit.
