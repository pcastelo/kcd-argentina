import { describe, expect, it } from 'vitest'
import organizersData from '@/data/organizers.json'
import sessionsData from '@/data/sessions.json'
import speakersData from '@/data/speakers.json'
import sponsorsData from '@/data/sponsors.json'
import {
  organizersSchema,
  sessionSchema,
  sessionsSchema,
  speakersSchema,
  sponsorSchema,
  sponsorsSchema,
} from './collectionSchemas'

describe('collectionSchemas', () => {
  it('parses empty speaker list', () => {
    expect(speakersSchema.safeParse(speakersData).success).toBe(true)
  })

  it('parses committed session list', () => {
    expect(sessionsSchema.safeParse(sessionsData).success).toBe(true)
    expect(sessionsData.length).toBeGreaterThan(0)
  })

  it('parses committed speaker list', () => {
    expect(speakersSchema.safeParse(speakersData).success).toBe(true)
    expect(speakersData.length).toBeGreaterThan(0)
  })

  it('parses a full session with room and schedule fields', () => {
    const result = sessionSchema.safeParse({
      id: '2026-10-03-1030-sala-1-demo-talk',
      slug: 'demo-talk',
      title: 'Demo Talk',
      speakerSlugs: ['ada-speaker'],
      speakerNames: ['Ada Speaker'],
      room: 'sala-1',
      startTime: '2026-10-03T10:30:00-03:00',
      endTime: '2026-10-03T11:00:00-03:00',
      durationMinutes: 30,
      type: 'talk',
      language: 'es',
    })

    expect(result.success).toBe(true)
  })

  it('parses empty sponsor list', () => {
    expect(sponsorsSchema.safeParse(sponsorsData).success).toBe(true)
  })

  it('parses empty organizer list', () => {
    expect(organizersSchema.safeParse(organizersData).success).toBe(true)
  })

  it('parses a valid sponsor with logo and optional fields', () => {
    const result = sponsorSchema.safeParse({
      slug: 'crubyt',
      name: 'Crubyt',
      tier: 'platinum',
      logo: '/sponsors/crubyt.png',
      url: 'https://crubyt.com',
      order: 1,
    })

    expect(result.success).toBe(true)
  })

  it('parses an organizer with optional company, photo, and linkedin', () => {
    const result = organizersSchema.safeParse([
      {
        slug: 'lead',
        name: 'Ada Organizer',
        role: 'Lead Organizer',
        company: 'Cloud Native Co',
        photo: '/organizers/ada.jpg',
        linkedin: 'https://www.linkedin.com/in/ada-organizer/',
      },
    ])

    expect(result.success).toBe(true)
  })

  it('parses an organizer without role or company', () => {
    const result = organizersSchema.safeParse([
      {
        slug: 'juan-pablo-martinez',
        name: 'Juan Pablo Martinez',
        photo: '/organizers/juan-pablo-martinez.png',
        linkedin: 'https://www.linkedin.com/in/juan-martinez-6978a7327/',
      },
    ])

    expect(result.success).toBe(true)
  })

  it('rejects a sponsor missing logo', () => {
    const result = sponsorSchema.safeParse({
      slug: 'crubyt',
      name: 'Crubyt',
      tier: 'platinum',
    })

    expect(result.success).toBe(false)
  })
})
