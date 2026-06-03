# Artek — Sitio web

Sitio bilingüe (ES/EN) de Artek, construido con [Astro](https://astro.build).
Impresión y arte de alta gama en Guatemala.

## Stack

- **Astro 5** (salida estática) + TypeScript
- i18n nativo de Astro — `es` por defecto (raíz), `en` bajo `/en/`
- CSS con design tokens (sin frameworks de utilidades)
- Fuentes autoalojadas (Fontsource): Fraunces (display) + Inter (cuerpo)
- Deploy: GitHub Pages vía GitHub Actions

## Requisitos

Node 20+ (probado con v24). En este entorno, `node` en el PATH es un shim de Bun;
usa el Node real de nvm:

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
```

## Comandos

| Comando           | Acción                                   |
| ----------------- | ---------------------------------------- |
| `npm install`     | Instala dependencias                     |
| `npm run dev`     | Servidor de desarrollo (localhost:4321)  |
| `npm run build`   | Build de producción en `dist/`           |
| `npm run preview` | Previsualiza el build local              |

## Estructura

```
src/
  components/   Componentes reutilizables
  layouts/      BaseLayout (SEO, hreflang, OG, fuentes)
  i18n/         Diccionarios ES/EN + helpers (ui.ts)
  pages/        Rutas (ES en raíz, EN en /en/)
  styles/       tokens.css + global.css
public/         favicon, robots.txt, assets estáticos
docs/           Specs y planes de diseño
legacy/         Sitio antiguo archivado (Colorlib Alime, 2019)
```

## Documentación de diseño

- Spec: `docs/superpowers/specs/2026-06-03-artek-web-redesign-design.md`
