import React from 'react';
import { useInView } from 'framer-motion';
import { cn } from '../../lib/utils';
import { AspectRatio } from './aspect-ratio';

export interface ImageGalleryItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageGalleryProps {
  images: ImageGalleryItem[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const columns = [0, 1, 2].map((col) => images.filter((_, index) => index % 3 === col));

  return (
    <div className="portfolio-island tw:relative tw:w-full tw:py-10">
      <div className="tw:mx-auto tw:grid tw:w-full tw:max-w-5xl tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        {columns.map((column, col) => (
          <div key={col} className="tw:grid tw:gap-6">
            {column.map((image) => (
              <AnimatedImage key={image.src} image={image} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnimatedImageProps {
  image: ImageGalleryItem;
}

function AnimatedImage({ image }: AnimatedImageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [isLoading, setIsLoading] = React.useState(true);
  const ratio = image.width / image.height;

  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, []);

  const openLightbox = () => {
    window.dispatchEvent(
      new CustomEvent('artek:gallery-open', {
        detail: {
          src: image.src,
          alt: image.alt,
          title: image.alt,
        },
      }),
    );
  };

  return (
    <AspectRatio
      ref={ref}
      ratio={ratio}
      className="portfolio-island__item tw:relative tw:w-full tw:overflow-hidden tw:rounded-lg tw:border tw:border-white/10"
    >
      <button
        type="button"
        className="portfolio-island__button tw:size-full"
        onClick={openLightbox}
        aria-label={image.alt}
      >
        <img
          ref={imgRef}
          alt={image.alt}
          src={image.src}
          className={cn(
            'portfolio-island__image tw:size-full tw:object-cover tw:opacity-0 tw:transition-all tw:duration-1000 tw:ease-in-out',
            { 'tw:opacity-100': isInView && !isLoading },
          )}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          decoding="async"
        />
      </button>
    </AspectRatio>
  );
}
