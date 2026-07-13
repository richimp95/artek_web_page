---
name: Artek
description: Atelier oscuro bilingüe donde las piezas impresas cargan todo el color
colors:
  brand-red: "#fa3543"
  brand-orange: "#f99700"
  brand-mid: "#f86720"
  void: "#0b0907"
  ink-deep: "#13100d"
  surface: "#1c1813"
  surface-2: "#251f18"
  paper: "#f4f1ec"
  paper-dim: "#cdc8c0"
  muted: "#ada69b"
  muted-light: "#8a8175"
  ink-on-accent: "#1a0d06"
  line: "#fff7ee1c"
  line-strong: "#fff7ee33"
typography:
  display:
    fontFamily: "Avant Garde, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.6rem, 1.7rem + 4.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Avant Garde, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 1.6rem + 2vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.01em"
  title:
    fontFamily: "Avant Garde, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 1vw, 2.1rem)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "0.01em"
  body:
    fontFamily: "Avant Garde, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.3vw, 1.12rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Avant Garde, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(0.83rem, 0.78rem + 0.25vw, 0.95rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "0.18em"
rounded:
  base: "3px"
spacing:
  2xs: "0.5rem"
  xs: "0.75rem"
  s: "1rem"
  m: "1.75rem"
  l: "3rem"
  xl: "5rem"
  2xl: "8rem"
components:
  button-solid:
    backgroundColor: "{colors.brand-mid}"
    textColor: "{colors.ink-on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: "0.85em 1.6em"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: "0.85em 1.6em"
  button-outline-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "0.85em 0"
  eyebrow:
    textColor: "{colors.brand-orange}"
    typography: "{typography.label}"
---

# Design System: Artek

## 1. Overview

**Creative North Star: "El Atelier Oscuro"**

Artek es un taller-galería nocturno. El muro es carbón cálido (nunca negro puro, nunca gris frío), la iluminación son dos focos de galería apenas perceptibles en las esquinas, y las únicas fuentes de color intenso son las piezas impresas del catálogo y la brasa del acento de marca. Todo lo demás — tipografía, líneas, superficies — trabaja en silencio para que la obra brille. La densidad es de galería: secciones con aire generoso (`--space-xl`/`--space-2xl`), texto contenido a 68ch, jerarquía por escala tipográfica fluida en vez de por cajas.

El sistema rechaza explícitamente el look de imprenta comercial genérica (el anti-referente de PRODUCT.md): nada de catálogos saturados, banners de oferta, grids apretados de producto ni tarjetas-caja repetidas. Las agrupaciones se hacen con hairlines cálidas y espacio negativo, no con contenedores.

**Key Characteristics:**
- Muro carbón cálido con capas tonales (`ink-deep` → `surface` → `surface-2`), sin modo claro.
- Un solo acento: el gradiente de marca Brasa de Taller (#fa3543 → #f99700), racionado.
- Una sola familia tipográfica (Avant Garde) en mayúsculas para display, con escala fluida `clamp()`.
- Filas con hairline en vez de cards; radio casi nulo (3px) en lo interactivo.
- Movimiento sobrio que escucha: ease-out exponenciales, duraciones cortas, `prefers-reduced-motion` siempre respetado.

## 2. Colors

Paleta de galería nocturna: neutros carbón cálidos que ceden todo el color a las fotografías, con una sola brasa de acento.

### Primary
- **Brasa de Taller** (gradiente #fa3543 → #f99700, punto medio #f86720): el único color que "emite luz" en el muro. Vive en el CTA sólido, la hairline de gradiente, el eyebrow, el dot activo del carrusel y los hovers de énfasis. Sobre fondo oscuro se prefiere el extremo naranja (**#f99700**, `--accent-strong`) porque lee mejor que el rojo.

### Neutral
- **Vacío** (#0b0907): el negro más profundo y cálido; footer, lightbox, fondo de la sección CTA.
- **Carbón Profundo** (#13100d): el muro base de toda página (`--bg`).
- **Superficie** (#1c1813) y **Superficie Elevada** (#251f18): capas tonales para secciones alternas y hover de elementos elevados; la jerarquía de profundidad se hace con estos tonos, no con sombras.
- **Papel Cálido** (#f4f1ec): la "tinta" del sistema; texto principal, blanco cálido nunca puro.
- **Papel Tenue** (#cdc8c0): texto sobre acentos claros.
- **Apagado** (#ada69b): texto secundario, contraste ≥7:1 sobre el muro.
- **Apagado Claro** (#8a8175): terciario/decorativo, piso 4.5:1.
- **Línea Cálida** (#fff7ee al 11%) y **Línea Fuerte** (al 20%): hairlines y bordes; siempre blanco cálido translúcido, nunca gris opaco.
- **Tinta sobre Brasa** (#1a0d06): texto oscuro sobre el gradiente; garantiza AA en todo el recorrido del degradado.

### Named Rules
**The Brasa Ration Rule.** El acento de marca aparece en ≤10% de cualquier pantalla. Si dos elementos vecinos piden brasa, uno la pierde. Su escasez es lo que la hace leerse como calor.

**The Warm Wall Rule.** Prohibido el negro puro (#000), el blanco puro (#fff) y cualquier gris frío. Todo neutro lleva la calidez del muro (matiz 30–40 en OKLCH). Si un tono parece "de dashboard", está mal.

## 3. Typography

**Display Font:** Avant Garde Book (autoalojada, `font-display: swap`; fallback system-ui)
**Body Font:** Avant Garde Book (misma familia)
**Reserva:** Anders (autoalojada) existe como fuente de marca del logo; no se usa en UI.

**Character:** una sola voz geométrica y limpia. El contraste jerárquico se logra con escala, mayúsculas y tracking — no mezclando familias. Display en mayúsculas con `text-wrap: balance`; nunca `hyphens: auto` (partía "SE-LECCIONADOS").

### Hierarchy
- **Display / h1** (400, `clamp(2.6rem → 6rem)`, lh 1.02, tracking 0.01em, UPPERCASE): titulares hero. Techo 6rem: por encima, la página grita.
- **Headline / h2** (400, `clamp(2rem → 3.2rem)`, lh 1.02, UPPERCASE): títulos de sección.
- **Title / h3** (400, `clamp(1.5rem → 2.1rem)`, lh 1.18, UPPERCASE): tarjetas de servicio, subsecciones.
- **Body** (400, `clamp(1rem → 1.12rem)`, lh 1.65): párrafos con `text-wrap: pretty`, máximo 68ch.
- **Label / Eyebrow** (500, `clamp(0.83rem → 0.95rem)`, tracking 0.18em, UPPERCASE): eyebrows en `--accent-strong`, labels de botón, links de nav (tracking reducido a 0.06em en nav).

### Named Rules
**The One Family Rule.** Prohibido introducir una segunda familia tipográfica en UI. El énfasis se hace con peso, escala o color de acento — nunca con otra fuente.

## 4. Elevation

Plano + luz puntual: la profundidad en reposo se expresa con capas tonales (`ink-deep` → `surface` → `surface-2`) y hairlines cálidas; las sombras existen solo como respuesta a estado o como marco de obra. Los focos de galería (`body::before`, dos radial-gradients fijos con 5–7% de brasa) dan atmósfera sin colorear el muro.

### Shadow Vocabulary
- **Glow de CTA** (`box-shadow: 0 10px 30px -10px color-mix(in srgb, var(--brand) 80%, transparent)`): solo en hover del botón sólido; la brasa "irradia" al acercarse.
- **Marco de obra** (`box-shadow: 0 28px 70px rgba(0, 0, 0, 0.34)`): marcos de carrusel/galería que presentan fotografías; única sombra estructural permitida.

### Named Rules
**The Flat-At-Rest Rule.** Ninguna superficie proyecta sombra en reposo salvo los marcos de obra. Si una card "flota" sin que el usuario haya hecho nada, está mal.

## 5. Components

Carácter: **sobrios que escuchan** — refinados y contenidos, pero con feedback táctil inmediato (`:active` scale 0.97, hovers que responden en ≤220ms).

### Buttons
- **Shape:** casi recto (3px), etiqueta UPPERCASE con tracking 0.18em, padding `0.85em 1.6em`.
- **Solid (primario):** gradiente Brasa de Taller con texto Tinta sobre Brasa (#1a0d06). Hover: `translateY(-2px)` + glow de CTA. Active: `scale(0.97)`.
- **Outline (secundario):** transparente con borde Línea Fuerte; hover invierte a Papel Cálido con texto carbón.
- **Ghost (terciario):** sin caja; subrayado de 2px con el gradiente de marca que crece bajo el label, texto vira a `--accent-strong` en hover.

### Cards / Containers
- **Los "cards" de servicio no son cajas:** filas con `border-top: 1px` hairline, padding vertical `--space-m`, fondo transparente. Hover: la hairline vira a `--accent-strong`, la fila se desliza `translateX(6px)` y la flecha avanza 5px.
- **Marcos de obra** (carrusel/galería): radio generoso (1.5rem exterior, 0.9rem interior), borde blanco translúcido, fondo vidrio oscuro con `backdrop-filter: blur(14px)` y fades laterales; reservados exclusivamente para presentar fotografías.
- **Internal Padding:** escala `--space-*`; nunca valores sueltos.

### Navigation
- Header sticky sobre `--bg` con hairline inferior que aparece al hacer scroll; blur frosted solo en desktop (≥52.0625rem; en móvil rompe el menú fixed).
- Links UPPERCASE `--step--1` tracking 0.06em; en móvil, overlay fixed a pantalla completa sobre Vacío con blur 22px y borde superior de gradiente de marca.

### Signature Component: Reveals de scroll
`[data-reveal]` (+ variantes `left`/`right`/`scale`): contenido visible por defecto sin JS; con JS entra con fade + desplazamiento de 20–28px, ease-out 420ms, `--reveal-delay` para escalonar. Con `prefers-reduced-motion` queda solo el fundido. `overflow-x: clip` en `html`/`body` garantiza que los transforms laterales nunca ensanchen el documento.

## 6. Do's and Don'ts

### Do:
- **Do** dejar que las fotografías del catálogo sean la fuente principal de color; el sistema las enmarca sobre carbón cálido.
- **Do** racionar la Brasa de Taller (≤10% por pantalla) y preferir #f99700 sobre oscuro.
- **Do** agrupar con hairlines (#fff7ee al 11–20%) y espacio negativo antes que con cajas.
- **Do** usar la escala `--space-*` y la escala tipográfica `--step-*` para todo; cero valores mágicos.
- **Do** dar feedback táctil: `:active` scale 0.97, hovers ≤220ms con `--ease-out`, y variante reduced-motion en todo movimiento.
- **Do** mantener AA como piso: texto secundario ≥4.5:1, foco visible con outline de `--accent-strong`.

### Don't:
- **Don't** verse como "imprenta comercial genérica" (anti-referencia de PRODUCT.md): prohibidos los catálogos saturados, banners de ofertas, precios chillones, grids de producto apretados y stock genérico.
- **Don't** usar negro #000, blanco #fff ni grises fríos; todo neutro es cálido.
- **Don't** introducir una segunda familia tipográfica ni `hyphens: auto` en titulares.
- **Don't** poner sombras estructurales en reposo fuera de los marcos de obra, ni glassmorphism decorativo fuera de ellos.
- **Don't** animar `.swiper-wrapper` (u otro interno de librería) con keyframes CSS propios; la animación pisa los transforms de la librería y mata la interacción.
- **Don't** superar 6rem en display ni dejar que un titular en mayúsculas desborde su bloque: la palabra baja entera de línea.
