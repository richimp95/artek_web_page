# Fix Mobile Horizontal Overflow (reveal transforms) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the 8px horizontal document overflow at mobile widths (390px) caused by pre-reveal transforms.

**Architecture (root cause, evidence-verified in headless Chromium):** The scroll-reveal system in `src/styles/global.css` applies `transform: translateX(28px)` to `html.js [data-reveal='right']` elements until IntersectionObserver adds `.is-revealed`. Below-the-fold elements using the `right` variant (currently `.cta__actions` in `CTA.astro`) sit shifted 28px toward the right edge on page load, pushing `document.scrollingElement.scrollWidth` to 398px at a 390px viewport. The static layout itself fits; the transform is the only offender. An earlier hypothesis (flex `min-width: auto` on `.cta__actions`) was disproven: computed width is 350px within a 390px container both before and after adding `min-width: 0`.

**Fix:** `overflow-x: clip` on `html`. Unlike `overflow-x: hidden`, `clip` does not create a scroll container, so `position: sticky` (site header) and fixed positioning keep working; it simply clips any horizontal paint/scroll overflow, covering the `right` variant, the `left` variant, and any future edge reveals. Also revert the now-pointless `min-width/max-width` addition on `.cta__actions` (its comment claims it fixes this bug; it does not).

**Tech Stack:** Astro 5, plain CSS in `src/styles/global.css`.

**Scope:** `src/styles/global.css` + revert `src/components/CTA.astro` to HEAD.

**Verification:** `npm run build` (22 pages) + browser check at 390px viewport: `document.scrollingElement.scrollWidth === 390` on `/`, `/en/`, `/contacto/` (orchestrator runs the browser check). Sticky header must still stick on scroll.

---

### Task 1: Revert the ineffective CTA change

**Files:**
- Modify: `src/components/CTA.astro` (working-tree change only, not committed)

- [ ] **Step 1: Revert**

Run: `git checkout -- src/components/CTA.astro`
Expected: `git status --short` no longer lists `src/components/CTA.astro`.

---

### Task 2: Clip horizontal overflow at the root

**Files:**
- Modify: `src/styles/global.css` (the `html` rule near the top of the file)

- [ ] **Step 1: Add `overflow-x: clip` to the `html` selector**

Find the existing `html { ... }` rule in `src/styles/global.css` (the one that sets `scroll-behavior` or base properties; if several exist, use the first base rule, NOT the media-query ones). Add one declaration with its comment:

```css
html {
  /* ...existing declarations stay untouched... */
  /* Los reveals laterales (translateX pre-revelado) no deben ensanchar el
     documento; clip no crea scroll container (sticky sigue funcionando). */
  overflow-x: clip;
}
```

If no base `html {}` rule exists, add this new rule right after the `:root` block:

```css
html {
  /* Los reveals laterales (translateX pre-revelado) no deben ensanchar el
     documento; clip no crea scroll container (sticky sigue funcionando). */
  overflow-x: clip;
}
```

- [ ] **Step 2: Build**

Run: `PATH=/usr/bin:$PATH npm run build`
Expected: exits 0, "22 page(s) built".

- [ ] **Step 3: Commit (orchestrator runs this; Codex sandbox has .git read-only)**

```bash
git add src/styles/global.css
git commit -m "fix(reveal): overflow horizontal por transforms pre-revelado

data-reveal='right' aplica translateX(28px) hasta que
IntersectionObserver revela; bajo el fold el documento medía 398px
en viewport de 390. overflow-x: clip en html recorta el sobrante
sin crear scroll container (sticky header intacto)."
```

---

### Task 3: Verification (orchestrator, not Codex)

Browser at 390px: `scrollWidth === 390` on `/`, `/en/`, `/contacto/`; scroll down `/` and confirm the CTA still reveals (slides in from the right) and the sticky header keeps sticking.
