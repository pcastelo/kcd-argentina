import { describe, expect, it } from 'vitest'
import eventData from '@/data/event.json'
import { eventSchema } from './eventSchema'

describe('eventSchema', () => {
  it('parses seed event.json', () => {
    const result = eventSchema.safeParse(eventData)
    expect(result.success).toBe(true)
  })

  it('parses venue with mapUrl and mapEmbedUrl from seed event.json', () => {
    const result = eventSchema.safeParse(eventData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.venue.mapUrl).toBe(
        'https://www.google.com/maps/place/Plaza+Galicia/@-34.5846,-58.4574,17z',
      )
      expect(result.data.venue.mapEmbedUrl).toContain('maps.google.com')
      expect(result.data.venue.image).toBe('/images/venue-plaza-galicia.jpg')
    }
  })

  it('rejects event missing required fields', () => {
    const result = eventSchema.safeParse({ title: 'Incomplete' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid ISO datetime', () => {
    const result = eventSchema.safeParse({
      ...eventData,
      dateStart: 'not-a-datetime',
    })
    expect(result.success).toBe(false)
  })

  it('accepts ISO datetime with timezone offset', () => {
    const result = eventSchema.safeParse({
      ...eventData,
      dateStart: '2026-10-03T09:00:00-03:00',
      dateEnd: '2026-10-03T19:00:00-03:00',
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid socialLinks', () => {
    const result = eventSchema.safeParse({
      ...eventData,
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/kcd.argentina/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/cncf-buenos-aires/' },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('accepts missing socialLinks (optional)', () => {
    const { socialLinks: _removed, ...withoutSocial } = eventData as Record<string, unknown>
    const result = eventSchema.safeParse(withoutSocial)
    expect(result.success).toBe(true)
  })

  it('rejects invalid platform in socialLinks', () => {
    const result = eventSchema.safeParse({
      ...eventData,
      socialLinks: [{ platform: 'tiktok', url: 'https://tiktok.com/@kcd' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid URL in socialLinks', () => {
    const result = eventSchema.safeParse({
      ...eventData,
      socialLinks: [{ platform: 'instagram', url: 'not-a-url' }],
    })
    expect(result.success).toBe(false)
  })
})
