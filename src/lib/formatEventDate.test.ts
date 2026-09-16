import { describe, expect, it } from 'vitest'
import { formatEventDate } from './formatEventDate'

describe('formatEventDate', () => {
  it('formats event start date in es-AR', () => {
    const formatted = formatEventDate(
      '2026-10-03T09:00:00-03:00',
      'America/Argentina/Buenos_Aires',
    )
    expect(formatted).toMatch(/3 de octubre de 2026/i)
  })
})
