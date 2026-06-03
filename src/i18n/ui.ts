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
