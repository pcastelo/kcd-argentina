import { describe, expect, it } from 'vitest'
import {
  SITE_ORIGIN,
  absoluteUrl,
  ogImageUrl,
  ogLocale,
} from '@/lib/seo'

describe('seo helpers', () => {
  it('exposes the production site origin', () => {
    expect(SITE_ORIGIN).toBe('https://kcdargentina.ar')
  })

  it('builds absolute URLs from paths', () => {
    expect(absoluteUrl('/es')).toBe('https://kcdargentina.ar/es')
    expect(absoluteUrl('en/location')).toBe(
      'https://kcdargentina.ar/en/location',
    )
  })

  it('returns the absolute OG image URL', () => {
    expect(ogImageUrl()).toBe('https://kcdargentina.ar/og-image.jpg')
  })

  it('maps locales to Open Graph locale tags', () => {
    expect(ogLocale('es')).toBe('es_AR')
    expect(ogLocale('en')).toBe('en_US')
  })
})
