import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

import imgChromaluxe from '../assets/portfolio/familia-aluminio.jpg';
import imgAcrilico from '../assets/services/acrilico.jpg';
import imgFineArt from '../assets/portfolio/globos-madera.jpg';
import imgEncapsulado from '../assets/services/encapsulado.jpg';
import imgGranFormato from '../assets/services/gran-formato.jpg';
import imgArteMural from '../assets/portfolio/muro-galeria.jpg';

export interface Service {
  id: string;
  /** Slug por idioma (para URLs localizadas /servicios/[slug]). */
  slug: Record<Lang, string>;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  description: Record<Lang, string>;
  benefits: Record<Lang, string[]>;
  image: ImageMetadata;
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
    description: {
      es: 'La impresión ChromaLuxe transfiere la imagen por sublimación directamente sobre una lámina de aluminio con recubrimiento especial. El resultado es una pieza de aspecto contemporáneo, con un rendimiento cromático extraordinario, un efecto de tridimensionalidad único y una resistencia muy superior a la humedad, los rayos UV y el paso del tiempo.',
      en: 'ChromaLuxe printing transfers the image by dye-sublimation directly onto a specially coated aluminum panel. The result is a contemporary piece with extraordinary color performance, a unique three-dimensional effect and resistance to moisture, UV and time that far exceeds traditional methods.',
    },
    benefits: {
      es: ['Color vibrante y alto contraste', 'Resistente a humedad, rayones y UV', 'Acabado moderno listo para colgar', 'Durabilidad de generaciones'],
      en: ['Vibrant color and high contrast', 'Resistant to moisture, scratches and UV', 'Modern, ready-to-hang finish', 'Lasts for generations'],
    },
    image: imgChromaluxe,
  },
  {
    id: 'acrilico',
    slug: { es: 'acrilico', en: 'acrylic' },
    title: { es: 'Impresión en acrílico', en: 'Acrylic prints' },
    summary: {
      es: 'Piezas de alto brillo y contraste sobre acrílico de alta gama, con una luminosidad y nitidez que realzan cualquier imagen.',
      en: 'High-gloss, high-contrast pieces on premium acrylic, with luminosity and sharpness that elevate any image.',
    },
    description: {
      es: 'El acrílico de alta gama aporta profundidad, brillo y una sensación de luz interior que hace que los colores parezcan iluminados desde adentro. Es la elección ideal para imágenes vibrantes que se quieren convertir en el punto focal de un espacio.',
      en: 'Premium acrylic adds depth, gloss and a sense of inner light that makes colors appear lit from within. It is the ideal choice for vibrant images meant to become the focal point of a space.',
    },
    benefits: {
      es: ['Brillo y profundidad excepcionales', 'Luminosidad que realza el color', 'Aspecto limpio y contemporáneo', 'Sistema de montaje oculto'],
      en: ['Exceptional gloss and depth', 'Luminosity that enhances color', 'Clean, contemporary look', 'Hidden mounting system'],
    },
    image: imgAcrilico,
  },
  {
    id: 'fine-art-paper',
    slug: { es: 'fine-art-paper', en: 'fine-art-paper' },
    title: { es: 'Fine art paper', en: 'Fine art paper printing' },
    summary: {
      es: 'Impresión de archivo sobre papeles de algodón libres de ácido, para reproducciones de arte y fotografía de calidad museo.',
      en: 'Archival printing on acid-free cotton papers, for museum-quality art and photography reproductions.',
    },
    description: {
      es: 'Para coleccionistas, galerías y artistas, la impresión sobre papeles fine art de algodón libres de ácido ofrece una reproducción fiel, con una gama tonal amplia y una textura noble. Tintas pigmentadas de archivo garantizan permanencia por más de un siglo.',
      en: 'For collectors, galleries and artists, printing on acid-free cotton fine art papers offers faithful reproduction, a wide tonal range and a refined texture. Archival pigment inks guarantee permanence for over a century.',
    },
    benefits: {
      es: ['Papeles de algodón libres de ácido', 'Tintas pigmentadas de archivo', 'Gama tonal amplia y textura noble', 'Calidad museo para coleccionistas'],
      en: ['Acid-free cotton papers', 'Archival pigment inks', 'Wide tonal range and refined texture', 'Museum quality for collectors'],
    },
    image: imgFineArt,
  },
  {
    id: 'encapsulado-acrilico',
    slug: { es: 'encapsulado-acrilico', en: 'acrylic-encapsulation' },
    title: { es: 'Encapsulado en acrílico', en: 'Acrylic encapsulation' },
    summary: {
      es: 'Montaje face-mount que sella la impresión entre acrílico y soporte rígido, protegiéndola y dándole un acabado contemporáneo de galería.',
      en: 'Face-mount finishing that seals the print between acrylic and a rigid backing, protecting it with a contemporary gallery finish.',
    },
    description: {
      es: 'El encapsulado face-mount fija la impresión por detrás de una lámina de acrílico y la respalda con un soporte rígido. Además de proteger la imagen del polvo, la humedad y el roce, le da una profundidad y un acabado de galería de altísimo nivel.',
      en: 'Face-mount encapsulation bonds the print behind an acrylic sheet and backs it with a rigid support. Beyond protecting the image from dust, moisture and abrasion, it gives it depth and a top-tier gallery finish.',
    },
    benefits: {
      es: ['Protección sellada de la imagen', 'Profundidad y acabado de galería', 'Bordes pulidos y precisos', 'Ideal para piezas de alto valor'],
      en: ['Sealed image protection', 'Depth and gallery finish', 'Polished, precise edges', 'Ideal for high-value pieces'],
    },
    image: imgEncapsulado,
  },
  {
    id: 'gran-formato',
    slug: { es: 'gran-formato', en: 'large-format' },
    title: { es: 'Gran formato premium', en: 'Large-format premium printing' },
    summary: {
      es: 'Producción a gran escala para espacios comerciales, hoteleros y corporativos, sin sacrificar resolución ni fidelidad de color.',
      en: 'Large-scale production for commercial, hospitality and corporate spaces, without sacrificing resolution or color fidelity.',
    },
    description: {
      es: 'Cuando el proyecto exige escala —murales, lobbies, hoteles, oficinas corporativas— producimos en gran formato manteniendo la nitidez y la fidelidad de color de una pieza pequeña. Asesoramos en materiales y montaje según el espacio.',
      en: 'When a project demands scale — murals, lobbies, hotels, corporate offices — we produce in large format while keeping the sharpness and color fidelity of a small piece. We advise on materials and mounting for each space.',
    },
    benefits: {
      es: ['Escala sin pérdida de resolución', 'Fidelidad de color consistente', 'Asesoría de materiales y montaje', 'Para proyectos comerciales y hoteleros'],
      en: ['Scale without losing resolution', 'Consistent color fidelity', 'Material and mounting guidance', 'For commercial and hospitality projects'],
    },
    image: imgGranFormato,
  },
  {
    id: 'arte-mural',
    slug: { es: 'arte-mural', en: 'wall-art' },
    title: { es: 'Arte mural a medida', en: 'Custom wall art' },
    summary: {
      es: 'Soluciones visuales a medida para residencias y proyectos de diseño de interiores, desde la curaduría hasta la instalación.',
      en: 'Bespoke visual solutions for residences and interior design projects, from curation to installation.',
    },
    description: {
      es: 'Trabajamos de la mano con diseñadores de interiores, arquitectos y clientes residenciales para concebir composiciones murales a la medida del espacio: selección de imágenes, formatos, materiales y disposición, hasta la instalación final.',
      en: 'We work hand in hand with interior designers, architects and residential clients to conceive wall compositions tailored to the space: image selection, formats, materials and layout, through final installation.',
    },
    benefits: {
      es: ['Curaduría y composición a medida', 'Coordinación con diseño de interiores', 'Formatos y materiales combinables', 'Acompañamiento hasta la instalación'],
      en: ['Bespoke curation and composition', 'Coordination with interior design', 'Mixable formats and materials', 'Support through installation'],
    },
    image: imgArteMural,
  },
];

/** Busca un servicio por su slug en un idioma dado. */
export function getServiceBySlug(lang: Lang, slug: string): Service | undefined {
  return services.find((s) => s.slug[lang] === slug);
}
