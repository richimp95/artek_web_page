import React from 'react';
import { useInView } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ImageGalleryItem {
  src: string;
  fullSrc?: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageGalleryProps {
  images: ImageGalleryItem[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const singleColumn = [images];
  const twoColumns = distribute(images, 2);
  const threeColumns = distribute(images, 3);

  return (
    <div className="portfolio-island tw:relative tw:w-full tw:py-10">
      <GalleryColumns columns={singleColumn} className="tw:grid tw:sm:hidden" />
      <GalleryColumns columns={twoColumns} className="tw:hidden tw:sm:grid tw:sm:grid-cols-2 tw:lg:hidden" />
      <GalleryColumns columns={threeColumns} className="tw:hidden tw:lg:grid tw:lg:grid-cols-3" />
    </div>
  );
}

function distribute(images: ImageGalleryItem[], columnCount: number) {
  const columns: ImageGalleryItem[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);

  for (const image of images) {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(image);
    heights[shortest] += image.height / image.width;
  }

  return columns;
}

interface GalleryColumnsProps {
  columns: ImageGalleryItem[][];
  className: string;
}

function GalleryColumns({ columns, className }: GalleryColumnsProps) {
  return (
    <div className={cn('tw:mx-auto tw:w-full tw:max-w-5xl tw:gap-4', className)}>
      {columns.map((column, col) => (
        <div key={col} className="tw:grid tw:content-start tw:gap-4">
          {column.map((image) => (
            <AnimatedImage key={image.src} image={image} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface AnimatedImageProps {
  image: ImageGalleryItem;
}

function AnimatedImage({ image }: AnimatedImageProps) {
  const ref = React.useRef<HTMLElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [isLoading, setIsLoading] = React.useState(true);

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
          src: image.fullSrc ?? image.src,
          alt: image.alt,
          title: image.alt,
        },
      }),
    );
  };

  return (
    <figure
      ref={ref}
      className="portfolio-island__item tw:relative tw:w-full tw:overflow-hidden tw:rounded-lg tw:border tw:border-white/10"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
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
      <figcaption className="portfolio-island__caption">{image.alt}</figcaption>
    </figure>
  );
}
