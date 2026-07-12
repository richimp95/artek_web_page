import type { Lang, RouteKey } from '../i18n/ui';
import { contact, defaultLang, routes } from '../i18n/ui';
import type { Service } from './services';

const PRODUCTION_ORIGIN = 'https://artekgt.com';
const GOOGLE_BUSINESS_PROFILE = 'https://share.google/5jmez2h4uIZPtlBEC';
const OG_IMAGE = `${PRODUCTION_ORIGIN}/og-image.jpg?v=2`;

export function productionUrl(lang: Lang, routeKey: RouteKey, slug?: string) {
  const parts = [
    lang === defaultLang ? '' : lang,
    routes[routeKey][lang],
    slug ?? '',
  ].filter(Boolean);

  const pathname = parts.length ? `/${parts.join('/')}/` : '/';
  return new URL(pathname, PRODUCTION_ORIGIN).href;
}

export function localBusiness(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${PRODUCTION_ORIGIN}/#localbusiness`,
    name: 'Artek',
    description:
      lang === 'es'
        ? 'Impresión y acabado artístico premium en Guatemala'
        : 'Premium printing and fine art finishing in Guatemala',
    url: `${PRODUCTION_ORIGIN}/`,
    image: OG_IMAGE,
    telephone: contact.phoneDisplay,
    email: contact.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressLocality: 'Guatemala',
      addressRegion: 'Guatemala',
      addressCountry: 'GT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 14.581252,
      longitude: -90.530015,
    },
    sameAs: [contact.social.instagram, GOOGLE_BUSINESS_PROFILE],
    areaServed: {
      '@type': 'Country',
      name: 'Guatemala',
    },
  };
}

export function webSite(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${productionUrl(lang, 'home')}#website`,
    name: 'Artek',
    url: productionUrl(lang, 'home'),
    inLanguage: lang === 'es' ? 'es-GT' : 'en-US',
    publisher: { '@id': `${PRODUCTION_ORIGIN}/#localbusiness` },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema(service: Service, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title[lang],
    description: service.summary[lang],
    url: productionUrl(lang, 'services', service.slug[lang]),
    image: service.image.src,
    provider: { '@id': `${PRODUCTION_ORIGIN}/#localbusiness` },
    areaServed: {
      '@type': 'Country',
      name: 'Guatemala',
    },
  };
}
