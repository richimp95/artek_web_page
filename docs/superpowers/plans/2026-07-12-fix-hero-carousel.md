# Fix Hero Carousel (index) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the index hero carousel fully interactive: working autoplay that doesn't die on hover, a single set of live pagination dots, and drag/swipe support.

**Architecture:** `src/components/ui/card-carousel.tsx` currently mixes two competing mechanisms: a custom CSS marquee animation on `.swiper-wrapper` (which overrides Swiper's inline transforms, killing autoplay/drag) plus Swiper itself. Fix = make Swiper the single source of truth: delete the CSS marquee, the static custom dots, and the manual slide duplication; configure Swiper autoplay + clickable pagination + loop properly and style Swiper's native bullets with the design tokens.

**Tech Stack:** Astro 5 + React island (`client:visible`), Swiper 11 (`swiper/react`), Tailwind with `tw:` prefix, custom CSS-in-component string.

**Scope:** Only `src/components/ui/card-carousel.tsx`. `Hero.astro` passes the same props and needs no changes. `ServiceDetail.astro` uses a different component (`thumbnail-carousel.tsx`) — do NOT touch it.

**Context for the bug (root cause, already diagnosed):**
1. `carouselCss` applies `animation: artek-carousel-scroll ... infinite` + `width: max-content` + `gap` to `.swiper-wrapper`. CSS animations beat inline styles, so Swiper's `translate3d` (autoplay, drag, loop) has no visual effect. `grabCursor` shows a grab cursor but dragging does nothing.
2. `.card-carousel:hover .swiper-wrapper { animation-play-state: paused; }` → carousel freezes on hover.
3. Two dot sets render: Swiper's own pagination bullets (`pagination={showPagination}` + `swiper/css/pagination`) AND a static custom `.card-carousel__dots` block whose first dot is always "active". Neither tracks position.
4. `slides = [...images, ...images]` duplicates slides manually on top of Swiper `loop`, producing 24 slides and confusing loop logic.

**Verification:** No JS test framework in this repo. Verification = `npm run build` (must succeed, 22 pages) + manual check on `npm run dev` at `http://localhost:4321/` per the checklist in Task 3.

---

### Task 1: Rewrite `carouselCss` — remove marquee, style native Swiper bullets

**Files:**
- Modify: `src/components/ui/card-carousel.tsx:27-172` (the `carouselCss` template string)

- [ ] **Step 1: Replace the entire `carouselCss` constant (lines 27–172) with this exact content**

Removals: `--carousel-cycle` var, `.swiper-wrapper` overrides (flex/max-content/gap/animation), hover pause rule, `@keyframes artek-carousel-scroll`, the `prefers-reduced-motion` animation override, and all `.card-carousel__dots` / `.card-carousel__dot` rules. Additions: `.swiper-slide` width for `slidesPerView="auto"`, native bullet styling with design tokens.

```tsx
const carouselCss = `
.card-carousel .swiper {
  width: 100%;
  overflow: hidden;
  padding: clamp(0.5rem, 1.5vw, 1rem) 0 2.25rem;
}
.card-carousel .swiper-slide {
  width: clamp(12rem, 28vw, 19rem);
}
.card-carousel__frame {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.035)),
    rgba(11, 9, 7, 0.52);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(14px);
}
.card-carousel__frame::before,
.card-carousel__frame::after {
  content: '';
  position: absolute;
  inset-block: 0;
  z-index: 2;
  width: clamp(2rem, 8vw, 5.5rem);
  pointer-events: none;
}
.card-carousel__frame::before {
  left: 0;
  background: linear-gradient(90deg, rgba(19, 16, 13, 0.92), transparent);
}
.card-carousel__frame::after {
  right: 0;
  background: linear-gradient(270deg, rgba(19, 16, 13, 0.92), transparent);
}
.card-carousel__inner {
  position: relative;
  z-index: 1;
  padding: clamp(0.75rem, 2vw, 1.1rem);
}
.card-carousel__header {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.35rem 0.45rem 0.75rem;
}
.card-carousel__title {
  margin: 0;
  color: var(--fg);
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
}
.card-carousel__description {
  margin: 0;
  color: var(--fg-muted);
  font-size: 0.95rem;
  line-height: 1.45;
}
.card-carousel__image-shell {
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
}
.card-carousel__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform var(--dur-image) var(--ease-art),
    filter var(--dur) var(--ease-out);
}
.card-carousel__image-shell:hover .card-carousel__image {
  transform: scale(1.035);
  filter: saturate(1.05);
}
.card-carousel .swiper-pagination {
  bottom: 0.55rem;
}
.card-carousel .swiper-pagination-bullet {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  opacity: 1;
  transition:
    width 200ms var(--ease-out),
    background-color 200ms var(--ease-out);
}
.card-carousel .swiper-pagination-bullet-active {
  width: 1.25rem;
  background: var(--accent-strong);
}
.card-carousel__nav {
  position: absolute;
  inset: 50% 0 auto;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  padding-inline: 0.55rem;
  transform: translateY(-50%);
  pointer-events: none;
}
.card-carousel__nav-button {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(11, 9, 7, 0.64);
  color: var(--fg);
}
`;
```

- [ ] **Step 2: Commit checkpoint deferred** — commit happens at the end of Task 2 (Task 1 alone leaves JSX referencing removed classes; component must change atomically).

---

### Task 2: Rewrite component JSX — Swiper as single source of truth

**Files:**
- Modify: `src/components/ui/card-carousel.tsx:174-262` (the `CardCarousel` function)

- [ ] **Step 1: Replace the entire `CardCarousel` function with this exact content**

Changes: no manual slide duplication (Swiper `loop` handles infinity), reduced-motion respected by disabling autoplay, `pauseOnMouseEnter: false` so hover never freezes it, `pagination` clickable with `dynamicBullets` (12 slides → compact dots), remove `effect="coverflow"` (flat card row matches current design; coverflow fought the marquee look), remove the static `.card-carousel__dots` block, drop the unused `--carousel-cycle` inline style.

```tsx
export function CardCarousel({
  images,
  autoplayDelay = 2800,
  showPagination = true,
  showNavigation = false,
  badgeLabel,
  heading,
  description,
  className,
}: CarouselProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      className={cn('card-carousel tw:w-full', className)}
      aria-label="Carrusel de productos Artek"
    >
      <style>{carouselCss}</style>
      <div className="tw:mx-auto tw:w-full tw:max-w-4xl">
        <div className="card-carousel__frame">
          <div className="card-carousel__inner">
            {(badgeLabel || heading || description) && (
              <div className="card-carousel__header">
                {badgeLabel && (
                  <Badge variant="outline" className="tw:w-fit">
                    <SparklesIcon className="tw:size-4 tw:text-orange-300" />
                    {badgeLabel}
                  </Badge>
                )}
                {heading && <h3 className="card-carousel__title">{heading}</h3>}
                {description && <p className="card-carousel__description">{description}</p>}
              </div>
            )}

            <Swiper
              spaceBetween={24}
              speed={600}
              autoplay={
                prefersReducedMotion
                  ? false
                  : {
                      delay: autoplayDelay,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: false,
                    }
              }
              grabCursor
              loop={images.length > 1}
              slidesPerView="auto"
              pagination={showPagination ? { clickable: true, dynamicBullets: true } : false}
              navigation={
                showNavigation
                  ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
                  : undefined
              }
              modules={[Autoplay, Pagination, Navigation]}
            >
              {images.map((image, index) => (
                <SwiperSlide key={image.src}>
                  <div className="card-carousel__image-shell">
                    <img
                      src={image.src}
                      className="card-carousel__image"
                      alt={image.alt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      {...{ fetchpriority: index === 0 ? 'high' : 'auto' }}
                      decoding="async"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {showNavigation && (
              <div className="card-carousel__nav" aria-hidden="true">
                <span className="card-carousel__nav-button swiper-button-prev">‹</span>
                <span className="card-carousel__nav-button swiper-button-next">›</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update imports at the top of the file**

Replace lines 1–9 with:

```tsx
import { SparklesIcon } from 'lucide-react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { cn } from '../../lib/utils';
import { Badge } from './badge';
```

(Removed: `EffectCoverflow` from modules and `swiper/css/effect-coverflow`.)

- [ ] **Step 3: Verify no leftovers**

Run: `grep -n "carousel-cycle\|card-carousel__dots\|card-carousel__dot\b\|EffectCoverflow\|coverflow\|artek-carousel-scroll\|slides\b" src/components/ui/card-carousel.tsx`
Expected: no output (exit code 1).

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exits 0, "22 page(s) built" (no TS/JSX errors).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/card-carousel.tsx
git commit -m "fix(hero): carrusel index — Swiper única fuente de verdad

Marquee CSS pisaba transforms de Swiper: autoplay/drag muertos,
hover congelaba, dots duplicados y estáticos. Fuera marquee, dots
custom y duplicación manual de slides; pagination nativa clicable
con dynamicBullets, autoplay respeta prefers-reduced-motion."
```

---

### Task 3: Manual verification checklist (dev server)

**Files:** none (verification only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev` (background). Open `http://localhost:4321/`.

- [ ] **Step 2: Verify each item on the hero carousel**

1. Carousel auto-advances every ~2.8s with a smooth 600ms slide transition.
2. Hovering the carousel does NOT stop it.
3. Exactly ONE row of pagination dots appears; the active dot is elongated + accent-colored and moves as slides change.
4. Clicking a dot jumps to that slide.
5. Dragging with the mouse (grab cursor) swipes slides; autoplay resumes afterward.
6. Loop: after the last image it continues seamlessly to the first.
7. No console errors; no duplicate-key React warnings.
8. Check mobile viewport (390px): slides sized correctly, drag works with touch emulation.

- [ ] **Step 3: Reduced motion check**

In DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload: carousel must NOT auto-advance, but dots and manual drag still work.

---

### Task 4: Design polish pass (handled by Claude after Codex finishes)

Not a Codex task. After Tasks 1–3 pass, the orchestrator (Claude) runs the `impeccable` and `taste-skill` skills to audit the result (bullet styling, motion feel, spacing, edge fades) and applies any polish as a separate commit.
