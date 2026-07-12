import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ThumbnailCarouselProps {
  images: CarouselImage[];
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function ThumbnailCarousel({ images }: ThumbnailCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const count = images.length;
  const activeImage = images[activeIndex];
  const hasMultiple = count > 1;

  const thumbnailWidths = useMemo(
    () => images.map((_, index) => (index === activeIndex ? FULL_WIDTH_PX : COLLAPSED_WIDTH_PX)),
    [activeIndex, images],
  );

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

  const goTo = (index: number) => {
    if (!count) return;
    setActiveIndex(wrapIndex(index, count));
  };

  const dragConstraints = {
    left: -Math.max(trackWidth - viewportWidth, 0),
    right: 0,
  };

  return (
    <section className="tw:relative tw:overflow-hidden tw:rounded-lg tw:border tw:border-white/10 tw:bg-white/5 tw:p-2 tw:shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
      <div className="tw:relative tw:h-[260px] tw:overflow-hidden tw:rounded-md tw:bg-black/30 tw:md:h-[400px]">
        <img
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          className="tw:size-full tw:object-cover"
          loading="eager"
          decoding="async"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              className="tw:absolute tw:left-3 tw:top-1/2 tw:z-10 tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border tw:border-black/10 tw:bg-white/90 tw:text-2xl tw:leading-none tw:text-black tw:shadow-lg tw:transition tw:hover:bg-white"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="tw:absolute tw:right-3 tw:top-1/2 tw:z-10 tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border tw:border-black/10 tw:bg-white/90 tw:text-2xl tw:leading-none tw:text-black tw:shadow-lg tw:transition tw:hover:bg-white"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </>
        )}

        <div className="tw:absolute tw:right-3 tw:top-3 tw:rounded-full tw:bg-black/65 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-white tw:backdrop-blur">
          {activeIndex + 1}/{count}
        </div>
      </div>

      {hasMultiple && (
        <div
          ref={viewportRef}
          className="tw:mt-2 tw:overflow-hidden tw:rounded-md tw:border tw:border-white/10 tw:bg-black/20 tw:p-[2px]"
        >
          <motion.div
            ref={trackRef}
            className="tw:flex tw:items-center"
            style={{ x, gap: GAP_PX, paddingInline: MARGIN_PX }}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.08}
            dragMomentum
            onDragEnd={(_, info) => {
              const velocityStep = Math.abs(info.velocity.x) > 600 ? (info.velocity.x < 0 ? 1 : -1) : 0;
              if (velocityStep) goTo(activeIndex + velocityStep);
            }}
          >
            {images.map((image, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.button
                  key={image.src}
                  type="button"
                  animate={{ width: isActive ? FULL_WIDTH_PX : COLLAPSED_WIDTH_PX }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  className="tw:h-16 tw:flex-none tw:overflow-hidden tw:rounded tw:border tw:border-white/10 tw:bg-white/5 tw:p-0 tw:transition-opacity tw:hover:opacity-100"
                  style={{ opacity: isActive ? 1 : 0.68 }}
                  onClick={() => goTo(index)}
                  aria-label={image.alt}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <img
                    src={image.src}
                    alt=""
                    className="tw:size-full tw:object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      )}
    </section>
  );
}
