import es from './es.json';
import en from './en.json';

export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export const defaultLang = 'es';

export type Lang = keyof typeof languages;

const dictionaries = { es, en } as const;

type UIKey = keyof typeof es;

/** Devuelve una función de traducción para el idioma dado. */
export function useTranslations(lang: Lang) {
  const dict = dictionaries[lang] ?? dictionaries[defaultLang];
  return function t(key: UIKey): string {
    return dict[key] ?? es[key] ?? key;
  };
}

/* ------------------------------------------------------------------
   Rutas localizadas
   Cada sección tiene su slug por idioma (mejor SEO que slugs iguales).
   El idioma por defecto (es) vive en la raíz; en va prefijado con /en/.
   ------------------------------------------------------------------ */
export const routes = {
  home: { es: '', en: '' },
  services: { es: 'servicios', en: 'services' },
  portfolio: { es: 'portafolio', en: 'portfolio' },
  about: { es: 'nosotros', en: 'about' },
  contact: { es: 'contacto', en: 'contact' },
} as const;

export type RouteKey = keyof typeof routes;

const BASE = import.meta.env.BASE_URL; // p.ej. "/artek_web_page/"

const join = (...parts: string[]) =>
  `/${parts.filter(Boolean).join('/')}/`.replace(/\/{2,}/g, '/');

/** Ruta absoluta-a-sitio (con base y prefijo de idioma) para una sección. */
export function getRoutePath(lang: Lang, key: RouteKey): string {
  const prefix = lang === defaultLang ? '' : lang;
  return join(BASE, prefix, routes[key][lang]);
}

/** URL completa (con dominio) para una sección — usada en canonical/hreflang/OG. */
export function getAbsoluteUrl(site: URL, lang: Lang, key: RouteKey): string {
  return new URL(getRoutePath(lang, key), site).href;
}

/** El otro idioma disponible. */
export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

/** Orden de items del menú principal. */
export const navItems: { key: RouteKey; label: UIKey }[] = [
  { key: 'home', label: 'nav.home' },
  { key: 'services', label: 'nav.services' },
  { key: 'portfolio', label: 'nav.portfolio' },
  { key: 'about', label: 'nav.about' },
  { key: 'contact', label: 'nav.contact' },
];

/** Datos de contacto reutilizados en todo el sitio. */
export const contact = {
  email: 'artekguatemala@gmail.com',
  phoneDisplay: '+502 5825-0402',
  phoneHref: 'tel:+50258250402',
  whatsapp: 'https://wa.me/50258250402',
  address: '15 Avenida 16-14, Edificio Narama, Oficina 207, Zona 13, Guatemala',
  social: {
    facebook: 'https://www.facebook.com/artek.gt/',
    instagram: 'https://www.instagram.com/artek.gt/',
  },
} as const;

/** Mensaje pre-rellenado para el enlace de WhatsApp. */
export function whatsappHref(lang: Lang): string {
  const text =
    lang === 'es'
      ? 'Hola, me interesa más información de Artek'
      : 'Hello, I would like more information about Artek';
  return `${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
