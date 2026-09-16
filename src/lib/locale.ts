export const SUPPORTED_LOCALES = ['es', 'en'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export function isValidLocale(locale: string | undefined): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

export function localePath(locale: Locale, segment?: string): string {
  const base = `/${locale}`
  if (!segment) {
    return base
  }

  const normalized = segment.startsWith('/') ? segment.slice(1) : segment
  return normalized ? `${base}/${normalized}` : base
}

export function swapLocale(pathname: string, currentLocale: string): string {
  const alternateLocale: Locale = currentLocale === 'es' ? 'en' : 'es'
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0 || !isValidLocale(segments[0])) {
    return localePath(alternateLocale)
  }

  segments[0] = alternateLocale
  return `/${segments.join('/')}`
}
