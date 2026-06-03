# Rediseño Web Artek — Documento de Diseño

**Fecha:** 2026-06-03
**Estado:** Aprobado para planificación

---

## Contexto

Artek es una empresa guatemalteca de impresión y acabados de arte de alta gama:
ChromaLuxe en aluminio, impresión en acrílico, fine art paper, encapsulado en
acrílico, gran formato premium y arte mural a medida. Quiere posicionarse como una
marca **premium, elegante, moderna, minimalista, artística pero corporativa,
atemporal y tecnológicamente avanzada**, con ambición internacional.

Audiencia objetivo: diseñadores de interiores, arquitectos, coleccionistas de arte,
clientes residenciales premium, hotelería, espacios corporativos.

El logo y la identidad de marca se rediseñan por separado (no es parte de este
proyecto). Este proyecto cubre **solo el sitio web**.

## Diagnóstico del sitio actual

El sitio existente es la plantilla Colorlib "Alime - Photography HTML Template"
(2019), de 3 páginas (`index.html`, `about.html`, `contact.html`) en español.
Problemas que motivan una reconstrucción limpia (no parche):

- **Stack obsoleto y pesado:** jQuery 2.2.4, Bootstrap 4, Owl Carousel, WOW.js,
  jarallax, magnific-popup, Gulp 3 para un sitio de 3 páginas.
- **SEO roto:** `lang="en"` con contenido en español; `<meta description>` vacías;
  títulos duplicados; sin Open Graph; sin datos estructurados; sin sitemap; `alt`
  vacíos; sin canonical.
- **Performance pésima:** imágenes sin optimizar (una de 7.7 MB, un `.tif` de 16 MB
  en el repo, varias de 2–4 MB); sin lazy load; sin formatos modernos.
- **HTML inválido:** etiquetas inventadas `<f class="...">` en lugar de `<i>`; modal
  de búsqueda muerto; estilos inline dispersos.
- **Contenido desactualizado:** solo habla de impresión en aluminio; no menciona el
  resto del catálogo real (ChromaLuxe, acrílico, fine art, encapsulado, gran
  formato, arte mural).
- **Look genérico de "print shop"**, justo lo que el brief pide evitar; restos de
  licencia Colorlib en el footer.

## Objetivos

1. Look & feel **moderno, premium, editorial de lujo** fiel al brief de marca.
2. **SEO compliant** de verdad (técnico + estructurado + performance).
3. **Escalable**: agregar servicios, piezas de portafolio o idiomas sin reescribir.
4. **Bilingüe ES + EN** desde el inicio, con español como idioma por defecto.
5. Deploy **estático** a GitHub Pages, visible en cada push.

## No-objetivos (YAGNI)

- Rediseño de logo / identidad de marca (se hace aparte).
- CMS / backend / panel de administración.
- Formulario de contacto con backend (se decidió contacto directo WhatsApp/email).
- Tienda / e-commerce / precios en línea.
- Blog (la arquitectura queda lista para añadirlo después, pero no se construye ahora).

## Decisiones tomadas (brainstorming)

| Tema | Decisión |
|------|----------|
| Arquitectura | **Astro 5** estático, TypeScript, GitHub Pages |
| Idiomas | **Bilingüe ES + EN** (rutas `/es`, `/en`; ES por defecto; hreflang) |
| Alcance | **Premium completo** (servicios con detalle, portafolio, nosotros, contacto) |
| Imágenes | Optimizar las actuales + placeholders de alta calidad donde falte |
| Contacto | **WhatsApp/email/teléfono directo** (sin formulario con backend) |
| Dirección visual | **B — Editorial de lujo** (serif display + sans limpia, grids asimétricos) |

## Arquitectura técnica

- **Astro 5** con salida estática (`output: 'static'`), **TypeScript**.
- **i18n nativo de Astro:** `defaultLocale: 'es'`, `locales: ['es', 'en']`. Rutas
  `/es/...` y `/en/...`; `<link rel="alternate" hreflang>` entre pares; canonical
  por página.
- **Content Collections** type-safe (Zod schema) para:
  - `services` — un archivo de datos por servicio, por idioma.
  - `portfolio` — piezas con categoría (servicio), imagen, título, orden.
  - Diccionarios i18n de strings de UI (JSON por idioma).
- **Cero JS por defecto.** Islas mínimas (`client:visible`/`client:idle`) solo para:
  menú móvil, lightbox de galería, selector de idioma.
- **Estilos:** CSS moderno con *design tokens* (custom properties) globales + estilos
  scoped por componente Astro. Sin framework de utilidades (control tipográfico fino
  para el look editorial).
- **Imágenes:** componente `<Image>`/`<Picture>` de Astro (Sharp) → AVIF/WebP,
  `srcset` responsive, lazy load, dimensiones explícitas (evita CLS).
- **Fuentes:** autoalojadas vía Fontsource, `font-display: swap`, preload de las
  variantes críticas.
- **Eliminado del proyecto:** jQuery, Bootstrap, Owl Carousel, WOW.js, jarallax,
  magnific-popup, Gulp, widget EmbedSocial.

### Estructura de carpetas (objetivo)

```
src/
  components/        # Header, Footer, Button, ServiceCard, Section, Gallery, Hero, CTA, LangSwitcher, SEO
  layouts/           # BaseLayout, PageLayout
  content/           # services/, portfolio/, config.ts (schemas)
  i18n/              # es.json, en.json, utils
  pages/
    [...]            # rutas por idioma
  styles/            # tokens.css, global.css
  assets/            # imágenes fuente (optimizadas en build)
public/              # favicon, robots.txt, og-image, assets estáticos
docs/superpowers/    # specs y planes
legacy/              # sitio antiguo archivado
```

## Sistema de diseño (Editorial de lujo)

- **Tipografía:**
  - Display serif: **Fraunces** (variable, óptico) para titulares.
  - Sans: **Inter** (o Archivo) para cuerpo y UI.
  - Ajustable cuando lleguen las guías de marca comisionadas aparte.
- **Paleta neutra premium** (tokens):
  - Fondo: blanco hueso cálido.
  - Tinta: casi negro.
  - Mid-tones: grises piedra / taupe.
  - Acento: bronce/champán muy sutil (guiño metálico, sin ruido).
  - Sin colores saturados (fiel al brief).
- **Detalles editoriales:** numeración de secciones (`01 —`), líneas finas
  divisorias, grids asimétricos, abundante espacio en blanco, transiciones suaves
  discretas.
- **Componentes base reutilizables:** Header/Nav, Footer, Button, ServiceCard,
  SectionBlock, Gallery/Lightbox, Hero, CTA band, LangSwitcher, SEO head.

## Mapa del sitio (bilingüe)

```
/[es|en]/                          Inicio
/[es|en]/servicios/                Servicios (índice)
/[es|en]/servicios/chromaluxe
                   /acrilico
                   /fine-art-paper
                   /encapsulado-acrilico
                   /gran-formato
                   /arte-mural
/[es|en]/portafolio/               Galería filtrable por categoría
/[es|en]/nosotros/                 Misión / Visión / Valores + Por qué Artek
/[es|en]/contacto/                 WhatsApp / email / teléfono + mapa
+ sitemap.xml, robots.txt, 404
```

### Inicio (secciones, estilo editorial)

1. **Hero** a sangre: imagen + titular serif + tagline minimalista + CTA.
2. **Declaración de marca** (sección numerada, editorial).
3. **Resumen de servicios** (grid de tarjetas refinadas → detalle).
4. **Portafolio destacado** (selección de piezas).
5. **Diferenciadores** (innovación, calidad cromática, materiales premium, tecnología).
6. **Banda CTA** (WhatsApp/email).
7. **Instagram ligero**: grid curado que enlaza a IG (reemplaza el widget pesado).
8. **Footer** refinado (nav, contacto, redes, idioma).

## SEO

- `lang` correcto por idioma; `hreflang` entre ES/EN; `canonical` por página.
- `<title>` y `<meta description>` únicos por página (plantillados desde i18n/content).
- Open Graph + Twitter Cards + imagen social.
- **JSON-LD:** `LocalBusiness`/`Organization` (dirección Guatemala, geo, teléfono,
  redes), `Service` por servicio, `BreadcrumbList`.
- `sitemap.xml` (integración `@astrojs/sitemap`) + `robots.txt`.
- HTML5 semántico, jerarquía de encabezados correcta, `alt` descriptivos.
- Core Web Vitals como pilar (imágenes optimizadas, fuentes precargadas, JS mínimo).

## Accesibilidad y performance

- Contraste AA, estados de foco visibles, navegación por teclado, ARIA donde aplique.
- Objetivo **Lighthouse 95+** en las 4 categorías.
- Pipeline de optimización de imágenes; selección/optimización de las actuales +
  placeholders de alta calidad para piezas faltantes.

## Deploy

- Build estático de Astro → **GitHub Pages** vía **GitHub Actions**.
- Configurar `site` y `base` según dominio (custom domain o `*.github.io`).
- Cada push a `main` despliega; resultados visibles en vivo.

## Migración

- Archivar el sitio actual en `legacy/` (preservado en historial git como baseline).
- Reutilizar contenido textual válido (misión, visión, valores, datos de contacto,
  textos de "Por qué Artek") adaptándolo al catálogo completo.

## Plan por fases

Cada fase es pusheable y verificable en vivo.

- **Fase 0 — Scaffold:** Astro + i18n + tokens + BaseLayout + CI/GitHub Pages.
  Esqueleto vivo desde el día 1.
- **Fase 1 — Sistema de diseño:** tipografía, tokens, Header/Footer, componentes base.
- **Fase 2 — Inicio.**
- **Fase 3 — Servicios:** índice + detalle vía content collection.
- **Fase 4 — Portafolio/galería.**
- **Fase 5 — Nosotros + Contacto.**
- **Fase 6 — SEO/JSON-LD/sitemap + optimización de imágenes + auditoría a11y/perf.**
- **Fase 7 — Traducción EN, pulido y lanzamiento.**

## Criterios de éxito

- Sitio bilingüe ES/EN desplegado en GitHub Pages.
- Lighthouse 95+ (Performance, A11y, Best Practices, SEO).
- Datos estructurados válidos (Rich Results Test sin errores).
- Catálogo completo de servicios representado con páginas de detalle.
- Agregar un servicio o pieza de portafolio nuevo = una entrada de datos, sin tocar
  layout.
- Look editorial de lujo coherente, fiel al brief de marca.
