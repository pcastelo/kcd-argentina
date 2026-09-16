import { describe, expect, it } from 'vitest'
import { isValidLocale, localePath, swapLocale } from '@/lib/locale'

describe('locale utilities', () => {
  it('accepts es and en as valid locales', () => {
    expect(isValidLocale('es')).toBe(true)
    expect(isValidLocale('en')).toBe(true)
  })

  it('rejects unsupported locales', () => {
    expect(isValidLocale('fr')).toBe(false)
    expect(isValidLocale(undefined)).toBe(false)
  })

  it('builds locale paths', () => {
    expect(localePath('es')).toBe('/es')
    expect(localePath('en', 'agenda')).toBe('/en/agenda')
  })

  it('swaps locale while preserving path suffix', () => {
    expect(swapLocale('/es/agenda', 'es')).toBe('/en/agenda')
    expect(swapLocale('/en', 'en')).toBe('/es')
  })
})
