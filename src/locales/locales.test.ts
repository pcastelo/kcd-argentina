import { describe, expect, it } from 'vitest'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    if (
      typeof nestedValue === 'object' &&
      nestedValue !== null &&
      !Array.isArray(nestedValue)
    ) {
      return collectKeys(nestedValue, nextPrefix)
    }

    return [nextPrefix]
  })
}

describe('locale files', () => {
  it('have identical key trees', () => {
    const esKeys = collectKeys(es).sort()
    const enKeys = collectKeys(en).sort()

    expect(esKeys).toEqual(enKeys)
  })
})
