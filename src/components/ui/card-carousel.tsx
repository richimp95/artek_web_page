import { SparklesIcon } from 'lucide-react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { cn } from '../../lib/utils';
import { Badge } from './badge';

interface CarouselImage {
  src: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  badgeLabel?: string;
  heading?: string;
  description?: string;
  className?: string;
}

const carouselCss = `
.card-carousel {
  --carousel-cycle: 30000ms;
}
.card-carousel .swiper {
  width: 100%;
  overflow: hidden;
  padding: clamp(0.5rem, 1.5vw, 1rem) 0 clamp(1rem, 2vw, 1.5rem);
}
.card-carousel .swiper-wrapper {
  display: flex;
  width: max-content;
  align-items: center;
  gap: clamp(0.85rem, 2.2vw, 1.6rem);
  animation: artek-carousel-scroll var(--carousel-cycle) linear infinite;
}
.card-carousel:hover .swiper-wrapper {
  animation-play-state: paused;
}
.card-carousel .swiper-slide {
  flex: 0 0 clamp(12rem, 28vw, 19rem);
  transform: translateZ(0);
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
.card-carousel__dots {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  padding-bottom: 0.25rem;
}
.card-carousel__dot {
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
}
.card-carousel__dot:first-child {
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
@keyframes artek-carousel-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - clamp(0.85rem, 2.2vw, 1.6rem) / 2));
  }
}
@media (prefers-reduced-motion: reduce) {
  .card-carousel .swiper-wrapper {
    animation: none;
  }
}
`;

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
  const slides = images.length > 1 ? [...images, ...images] : images;
  const cycleDuration = `${Math.max(autoplayDelay * images.length, 12000)}ms`;

  return (
    <section
      className={cn('card-carousel tw:w-full', className)}
      style={{ '--carousel-cycle': cycleDuration }}
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
              spaceBetween={50}
              autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
              effect="coverflow"
              grabCursor
              centeredSlides
              loop
              slidesPerView="auto"
              coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
              pagination={showPagination}
              navigation={
                showNavigation
                  ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
                  : undefined
              }
              modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            >
              {slides.map((image, index) => (
                <SwiperSlide key={`${image.src}-${index}`}>
                  <div className="card-carousel__image-shell">
                    <img
                      src={image.src}
                      className="card-carousel__image"
                      alt={image.alt}
                      loading="lazy"
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

            {showPagination && (
              <div className="card-carousel__dots" aria-hidden="true">
                {images.slice(0, 5).map((image) => (
                  <span className="card-carousel__dot" key={image.src} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
