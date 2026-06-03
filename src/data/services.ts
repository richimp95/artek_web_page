import type { Lang } from '../i18n/ui';

export interface Service {
  id: string;
  /** Slug por idioma (para URLs localizadas /servicios/[slug]). */
  slug: Record<Lang, string>;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
}

/**
 * Catálogo de servicios. Agregar un servicio = agregar una entrada aquí;
 * el grid del inicio, el índice y las páginas de detalle se generan solos.
 */
export const services: Service[] = [
  {
    id: 'chromaluxe',
    slug: { es: 'chromaluxe', en: 'chromaluxe' },
    title: { es: 'ChromaLuxe en aluminio', en: 'ChromaLuxe aluminum prints' },
    summary: {
      es: 'Impresión por sublimación sobre lámina de aluminio: color excepcional, profundidad tridimensional y durabilidad superior a los métodos tradicionales.',
      en: 'Dye-sublimation prints on aluminum panels: exceptional color, three-dimensional depth and durability beyond traditional methods.',
    },
  },
  {
    id: 'acrilico',
    slug: { es: 'acrilico', en: 'acrylic' },
    title: { es: 'Impresión en acrílico', en: 'Acrylic prints' },
    summary: {
      es: 'Piezas de alto brillo y contraste sobre acrílico de alta gama, con una luminosidad y nitidez que realzan cualquier imagen.',
      en: 'High-gloss, high-contrast pieces on premium acrylic, with luminosity and sharpness that elevate any image.',
    },
  },
  {
    id: 'fine-art-paper',
    slug: { es: 'fine-art-paper', en: 'fine-art-paper' },
    title: { es: 'Fine art paper', en: 'Fine art paper printing' },
    summary: {
      es: 'Impresión de archivo sobre papeles de algodón libres de ácido, para reproducciones de arte y fotografía de calidad museo.',
      en: 'Archival printing on acid-free cotton papers, for museum-quality art and photography reproductions.',
    },
  },
  {
    id: 'encapsulado-acrilico',
    slug: { es: 'encapsulado-acrilico', en: 'acrylic-encapsulation' },
    title: { es: 'Encapsulado en acrílico', en: 'Acrylic encapsulation' },
    summary: {
      es: 'Montaje face-mount que sella la impresión entre acrílico y soporte rígido, protegiéndola y dándole un acabado contemporáneo de galería.',
      en: 'Face-mount finishing that seals the print between acrylic and a rigid backing, protecting it with a contemporary gallery finish.',
    },
  },
  {
    id: 'gran-formato',
    slug: { es: 'gran-formato', en: 'large-format' },
    title: { es: 'Gran formato premium', en: 'Large-format premium printing' },
    summary: {
      es: 'Producción a gran escala para espacios comerciales, hoteleros y corporativos, sin sacrificar resolución ni fidelidad de color.',
      en: 'Large-scale production for commercial, hospitality and corporate spaces, without sacrificing resolution or color fidelity.',
    },
  },
  {
    id: 'arte-mural',
    slug: { es: 'arte-mural', en: 'wall-art' },
    title: { es: 'Arte mural a medida', en: 'Custom wall art' },
    summary: {
      es: 'Soluciones visuales a medida para residencias y proyectos de diseño de interiores, desde la curaduría hasta la instalación.',
      en: 'Bespoke visual solutions for residences and interior design projects, from curation to installation.',
    },
  },
];
