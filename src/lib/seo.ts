import site from '@/data/site.json'

/** Production origin for canonical URLs and Open Graph absolute image links. */
export const SITE_ORIGIN = site.origin

export const OG_IMAGE_PATH = site.ogImagePath

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_ORIGIN}${normalized}`
}

export function ogImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH)
}

export function ogLocale(locale: 'es' | 'en'): string {
  return locale === 'en' ? 'en_US' : 'es_AR'
}
