import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;
const SLIDE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type Direction = -1 | 1;

export interface CarouselImage {
  src: string;
  thumbSrc?: string;
  alt: string;
}

interface CarouselLabels {
  carousel: string;
  previous: string;
  next: string;
  counter: string;
}

interface ThumbnailCarouselProps {
  images: CarouselImage[];
  labels?: Partial<CarouselLabels>;
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

const defaultLabels: CarouselLabels = {
  carousel: 'Galeria de imagenes del servicio',
  previous: 'Imagen anterior',
  next: 'Imagen siguiente',
  counter: 'Imagen',
};

const thumbnailCarouselCss = `
.thumbnail-carousel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.34);
}
.thumbnail-carousel__stage {
  position: relative;
  height: 260px;
  overflow: hidden;
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.3);
}
.thumbnail-carousel__drag-layer {
  position: absolute;
  inset: 0;
  cursor: grab;
  touch-action: pan-y;
}
.thumbnail-carousel__drag-layer:active {
  cursor: grabbing;
}
.thumbnail-carousel__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}
.thumbnail-carousel__nav-button {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    transform 150ms cubic-bezier(0.23, 1, 0.32, 1),
    background-color 150ms ease-out,
    border-color 150ms ease-out;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.thumbnail-carousel__nav-button--prev {
  left: 0.75rem;
}
.thumbnail-carousel__nav-button--next {
  right: 0.75rem;
}
.thumbnail-carousel__nav-button:active {
  transform: translateY(-50%) scale(0.95);
}
.thumbnail-carousel__icon {
  width: 1.25rem;
  height: 1.25rem;
}
.thumbnail-carousel__counter {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.65);
  padding: 0.25rem 0.75rem;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.thumbnail-carousel__thumb-viewport {
  margin-top: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px;
}
.thumbnail-carousel__thumb-track {
  display: flex;
  align-items: center;
}
.thumbnail-carousel__thumb {
  flex: 0 0 auto;
  height: 4rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0;
  cursor: pointer;
  opacity: 0.5;
  transition:
    opacity 150ms ease-out,
    transform 150ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 150ms ease-out,
    box-shadow 150ms ease-out;
}
.thumbnail-carousel__thumb.is-active {
  border-color: rgba(255, 255, 255, 0.42);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7);
  opacity: 1;
}
.thumbnail-carousel__thumb:active {
  transform: scale(0.95);
}
.thumbnail-carousel__thumb img {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}
.thumbnail-carousel__caption {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 9;
  pointer-events: none;
  min-height: 5rem;
  padding: 3rem 0.75rem 0.75rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.75rem;
  line-height: 1.35;
}
.thumbnail-carousel__caption-text {
  margin: 0;
  max-width: none;
}
@media (min-width: 48rem) {
  .thumbnail-carousel__stage {
    height: 400px;
  }
}
@media (hover: hover) and (pointer: fine) {
  .thumbnail-carousel__nav-button:hover {
    border-color: rgba(255, 255, 255, 0.24);
    background: rgba(0, 0, 0, 0.75);
  }
  .thumbnail-carousel__thumb:hover {
    opacity: 0.9;
  }
  .thumbnail-carousel__thumb.is-active:hover {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .thumbnail-carousel__nav-button,
  .thumbnail-carousel__thumb {
    transition:
      opacity 150ms ease-out,
      background-color 150ms ease-out,
      border-color 150ms ease-out,
      box-shadow 150ms ease-out;
  }
  .thumbnail-carousel__nav-button:active {
    transform: translateY(-50%);
  }
  .thumbnail-carousel__thumb:active {
    transform: none;
  }
}
`;

export function ThumbnailCarousel({ images, labels: labelsProp }: ThumbnailCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const shouldReduceMotion = Boolean(useReducedMotion());

  const count = images.length;
  const activeImage = images[activeIndex];
  const hasMultiple = count > 1;
  const labels = { ...defaultLabels, ...labelsProp };

  const thumbnailWidths = useMemo(
    () => images.map((_, index) => (index === activeIndex ? FULL_WIDTH_PX : COLLAPSED_WIDTH_PX)),
    [activeIndex, images],
  );

  useEffect(() => {
    if (activeIndex >= count) setActiveIndex(0);
  }, [activeIndex, count]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateStageWidth = () => setStageWidth(stage.clientWidth);

    updateStageWidth();
    const observer = new ResizeObserver(updateStageWidth);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const updateMeasurements = () => {
      setViewportWidth(viewport.clientWidth);
      setTrackWidth(track.scrollWidth);
    };

    updateMeasurements();
    const observer = new ResizeObserver(updateMeasurements);
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [images, activeIndex]);

  useEffect(() => {
    const maxScroll = Math.max(trackWidth - viewportWidth, 0);
    if (maxScroll <= 0) {
      animate(x, 0, { type: 'spring', stiffness: 260, damping: 30 });
      return;
    }

    const activeStart = thumbnailWidths
      .slice(0, activeIndex)
      .reduce((sum, width) => sum + width + GAP_PX, MARGIN_PX);
    const activeCenter = activeStart + thumbnailWidths[activeIndex] / 2;
    const target = Math.min(Math.max(activeCenter - viewportWidth / 2, 0), maxScroll);

    animate(x, -target, { type: 'spring', stiffness: 260, damping: 30 });
  }, [activeIndex, thumbnailWidths, trackWidth, viewportWidth, x]);

  if (!activeImage) return null;

  const goTo = (index: number, nextDirection?: Direction) => {
    if (!count) return;
    const nextIndex = wrapIndex(index, count);
    if (nextIndex === activeIndex) return;

    setDirection(nextDirection ?? (nextIndex > activeIndex ? 1 : -1));
    setActiveIndex(nextIndex);
  };

  const dragConstraints = {
    left: -Math.max(trackWidth - viewportWidth, 0),
    right: 0,
  };

  const slideVariants = {
    enter: (nextDirection: number) => ({
      transform: shouldReduceMotion ? 'translateX(0px)' : `translateX(${nextDirection * 24}px)`,
      opacity: 0,
    }),
    center: {
      transform: 'translateX(0px)',
      opacity: 1,
    },
    exit: (nextDirection: number) => ({
      transform: shouldReduceMotion ? 'translateX(0px)' : `translateX(${nextDirection * -24}px)`,
      opacity: 0,
    }),
  };

  return (
    <>
      <style>{thumbnailCarouselCss}</style>
      <section
        className="thumbnail-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={labels.carousel}
        tabIndex={0}
        onKeyDown={(event) => {
          if (!hasMultiple) return;
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(activeIndex - 1, -1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(activeIndex + 1, 1);
          }
        }}
      >
        <div ref={stageRef} className="thumbnail-carousel__stage">
          <motion.div
            className="thumbnail-carousel__drag-layer"
            drag={hasMultiple ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (!hasMultiple) return;

              const distanceThreshold = stageWidth > 0 ? stageWidth * 0.3 : 90;
              const velocityStep =
                Math.abs(info.velocity.x) > 500 ? (info.velocity.x < 0 ? 1 : -1) : 0;
              const offsetStep =
                !velocityStep && Math.abs(info.offset.x) > distanceThreshold
                  ? info.offset.x < 0
                    ? 1
                    : -1
                  : 0;
              const step = velocityStep || offsetStep;

              if (step) goTo(activeIndex + step, step as Direction);
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={activeImage.src}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: shouldReduceMotion ? 0.15 : 0.22, ease: SLIDE_EASE }}
                src={activeImage.src}
                alt={activeImage.alt}
                className="thumbnail-carousel__image"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>

          {hasMultiple && (
            <>
              <button
                type="button"
                className="thumbnail-carousel__nav-button thumbnail-carousel__nav-button--prev"
                onClick={() => goTo(activeIndex - 1, -1)}
                aria-label={labels.previous}
              >
                <ChevronLeft className="thumbnail-carousel__icon" strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="thumbnail-carousel__nav-button thumbnail-carousel__nav-button--next"
                onClick={() => goTo(activeIndex + 1, 1)}
                aria-label={labels.next}
              >
                <ChevronRight className="thumbnail-carousel__icon" strokeWidth={2} aria-hidden="true" />
              </button>
            </>
          )}

          <div
            className="thumbnail-carousel__counter"
            aria-live="polite"
            aria-label={`${labels.counter} ${activeIndex + 1} / ${count}`}
          >
            {activeIndex + 1}/{count}
          </div>

          <div className="thumbnail-carousel__caption" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.p
                key={activeImage.src}
                className="thumbnail-carousel__caption-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: SLIDE_EASE }}
              >
                {activeImage.alt}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {hasMultiple && (
          <div ref={viewportRef} className="thumbnail-carousel__thumb-viewport">
            <motion.div
              ref={trackRef}
              className="thumbnail-carousel__thumb-track"
              style={{ x, gap: GAP_PX, paddingInline: MARGIN_PX }}
              drag="x"
              dragConstraints={dragConstraints}
              dragElastic={0.08}
              dragMomentum={false}
            >
              {images.map((image, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.button
                    key={image.src}
                    type="button"
                    initial={false}
                    animate={{ width: isActive ? FULL_WIDTH_PX : COLLAPSED_WIDTH_PX }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 260, damping: 30 }
                    }
                    className={`thumbnail-carousel__thumb${isActive ? ' is-active' : ''}`}
                    onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                    aria-label={image.alt}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <img
                      src={image.thumbSrc ?? image.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
}
