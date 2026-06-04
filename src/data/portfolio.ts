import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

import retratoColor from '../assets/gallery/retrato-color.jpg';
import editorial from '../assets/gallery/editorial.jpg';
import ciudad from '../assets/gallery/ciudad.jpg';
import skyline from '../assets/gallery/skyline.jpg';
import globos from '../assets/gallery/globos.jpg';
import familia from '../assets/gallery/familia.jpg';
import estudio from '../assets/gallery/estudio.jpg';
import grupo from '../assets/gallery/grupo.jpg';
import muro from '../assets/gallery/muro.jpg';
import coleccion from '../assets/gallery/coleccion.jpg';

export interface PortfolioItem {
  id: string;
  title: Record<Lang, string>;
  /** id de servicio (categoría) — debe existir en data/services.ts */
  category: string;
  image: ImageMetadata;
  /** true = ocupa una celda más grande en el grid */
  feature?: boolean;
}

/** Piezas del portafolio. Agregar una pieza = agregar una entrada aquí. */
export const portfolio: PortfolioItem[] = [
  { id: 'retrato-color', title: { es: 'Retrato a color', en: 'Color portrait' }, category: 'chromaluxe', image: retratoColor, feature: true },
  { id: 'editorial', title: { es: 'Editorial', en: 'Editorial' }, category: 'acrilico', image: editorial },
  { id: 'ciudad', title: { es: 'Ciudad al atardecer', en: 'City at dusk' }, category: 'gran-formato', image: ciudad },
  { id: 'skyline', title: { es: 'Skyline', en: 'Skyline' }, category: 'gran-formato', image: skyline },
  { id: 'globos', title: { es: 'Globos', en: 'Balloons' }, category: 'fine-art-paper', image: globos },
  { id: 'familia', title: { es: 'Familia', en: 'Family' }, category: 'encapsulado-acrilico', image: familia },
  { id: 'estudio', title: { es: 'Estudio', en: 'Studio' }, category: 'chromaluxe', image: estudio },
  { id: 'grupo', title: { es: 'Grupo', en: 'Group' }, category: 'encapsulado-acrilico', image: grupo },
  { id: 'muro', title: { es: 'Muro de galería', en: 'Gallery wall' }, category: 'arte-mural', image: muro, feature: true },
  { id: 'coleccion', title: { es: 'Colección', en: 'Collection' }, category: 'arte-mural', image: coleccion },
];
