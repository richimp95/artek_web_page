import type { Lang } from '../i18n/ui';

export interface SeoMeta {
  title: string;
  description: string;
}

export const pageSeo: Record<string, Record<Lang, SeoMeta>> = {
  home: {
    es: {
      title: 'Impresión en aluminio y acrílico en Guatemala | ARTEK',
      description:
        'Impresión en aluminio, acrílico y fine art en Guatemala para hogares, oficinas y hoteles. Cotiza tu pieza personalizada por WhatsApp con ARTEK.',
    },
    en: {
      title: 'Aluminum & acrylic photo prints in Guatemala | ARTEK',
      description:
        'Premium aluminum, acrylic and fine art printing in Guatemala for homes, offices and hotels. Request a custom WhatsApp quote with ARTEK.',
    },
  },
  services: {
    es: {
      title: 'Servicios de impresión fine art en Guatemala | ARTEK',
      description:
        'Servicios de impresión fine art en Guatemala: aluminio, acrílico, gran formato y arte mural. Escríbenos por WhatsApp para cotizar tu proyecto.',
    },
    en: {
      title: 'Fine art printing services in Guatemala | ARTEK',
      description:
        'Fine art printing services in Guatemala: aluminum, acrylic, large-format and wall art. Message us on WhatsApp for a project quote.',
    },
  },
  portfolio: {
    es: {
      title: 'Portafolio de impresiones en aluminio y acrílico | ARTEK',
      description:
        'Explora impresiones en aluminio, acrílico y acabados premium producidos en Guatemala. Inspírate y cotiza tu proyecto por WhatsApp.',
    },
    en: {
      title: 'Aluminum & acrylic print portfolio | ARTEK',
      description:
        'Explore aluminum prints, acrylic pieces and premium finishes produced in Guatemala. Get ideas and request your project quote by WhatsApp.',
    },
  },
  about: {
    es: {
      title: 'ARTEK — Taller de impresión fine art en Guatemala',
      description:
        'Conoce ARTEK, taller de impresión fine art en Guatemala para aluminio, acrílico y proyectos a medida. Agenda una cotización por WhatsApp.',
    },
    en: {
      title: 'ARTEK — Fine art print studio in Guatemala',
      description:
        'Meet ARTEK, a fine art print studio in Guatemala for aluminum, acrylic and custom projects. Schedule a WhatsApp quote for your idea.',
    },
  },
  contact: {
    es: {
      title: 'Contacto — Cotiza tu impresión en Guatemala | ARTEK',
      description:
        'Contacta a ARTEK en Guatemala para cotizar impresión en aluminio, acrílico, fine art o gran formato. Escríbenos directo por WhatsApp.',
    },
    en: {
      title: 'Contact — Get a print quote in Guatemala | ARTEK',
      description:
        'Contact ARTEK in Guatemala for aluminum, acrylic, fine art or large-format printing. Send us a WhatsApp message for a quote.',
    },
  },
};

export const serviceSeo: Record<string, Record<Lang, SeoMeta>> = {
  chromaluxe: {
    es: {
      title: 'Impresión ChromaLuxe en aluminio Guatemala | ARTEK',
      description:
        'Impresión ChromaLuxe en aluminio en Guatemala con color vibrante, brillo y durabilidad. Cotiza formatos para arte, fotos o señalización por WhatsApp.',
    },
    en: {
      title: 'ChromaLuxe aluminum prints Guatemala | ARTEK',
      description:
        'ChromaLuxe aluminum prints in Guatemala with vibrant color, gloss and durability. Request sizes for art, photos or signage by WhatsApp.',
    },
  },
  acrilico: {
    es: {
      title: 'Impresión en acrílico de alta gama Guatemala | ARTEK',
      description:
        'Impresión en acrílico de alta gama en Guatemala para fotos, reconocimientos y decoración. Consulta acabados y cotiza tu proyecto por WhatsApp.',
    },
    en: {
      title: 'Premium acrylic prints Guatemala | ARTEK',
      description:
        'Premium acrylic prints in Guatemala for photos, awards and interior decor. Ask about finishes and request your project quote by WhatsApp.',
    },
  },
  'fine-art-paper': {
    es: {
      title: 'Impresión fine art en papel de algodón GT | ARTEK',
      description:
        'Impresión fine art en papel de algodón en Guatemala para artistas, fotógrafos y coleccionistas. Pide asesoría y cotiza por WhatsApp.',
    },
    en: {
      title: 'Fine art paper printing Guatemala | ARTEK',
      description:
        'Fine art paper printing in Guatemala for artists, photographers and collectors. Ask for material guidance and a WhatsApp quote.',
    },
  },
  'encapsulado-acrilico': {
    es: {
      title: 'Encapsulado en acrílico face-mount Guatemala | ARTEK',
      description:
        'Encapsulado en acrílico face-mount en Guatemala para piezas de galería con profundidad y protección. Cotiza medidas y montaje por WhatsApp.',
    },
    en: {
      title: 'Acrylic face-mount encapsulation Guatemala | ARTEK',
      description:
        'Acrylic face-mount encapsulation in Guatemala for gallery pieces with depth and protection. Request sizes and mounting by WhatsApp.',
    },
  },
  'gran-formato': {
    es: {
      title: 'Impresión gran formato premium Guatemala | ARTEK',
      description:
        'Impresión gran formato premium en Guatemala para oficinas, hoteles y espacios comerciales. Solicita asesoría de materiales por WhatsApp.',
    },
    en: {
      title: 'Large-format premium printing Guatemala | ARTEK',
      description:
        'Large-format premium printing in Guatemala for offices, hotels and commercial spaces. Request material guidance by WhatsApp.',
    },
  },
  'arte-mural': {
    es: {
      title: 'Arte mural a medida para interiores Guatemala | ARTEK',
      description:
        'Arte mural a medida para interiores en Guatemala con impresión premium, montaje y curaduría. Cuéntanos tu espacio y cotiza por WhatsApp.',
    },
    en: {
      title: 'Custom wall art for interiors Guatemala | ARTEK',
      description:
        'Custom wall art for interiors in Guatemala with premium printing, mounting and curation. Tell us about your space by WhatsApp.',
    },
  },
};
