import { describe, expect, it } from 'vitest'
import organizersData from '@/data/organizers.json'
import sessionsData from '@/data/sessions.json'
import speakersData from '@/data/speakers.json'
import sponsorsData from '@/data/sponsors.json'
import {
  organizersSchema,
  sessionsSchema,
  speakersSchema,
  sponsorSchema,
  sponsorsSchema,
} from './collectionSchemas'

describe('collectionSchemas', () => {
  it('parses empty speaker list', () => {
    expect(speakersSchema.safeParse(speakersData).success).toBe(true)
  })

  it('parses empty session list', () => {
    expect(sessionsSchema.safeParse(sessionsData).success).toBe(true)
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

  it('rejects a sponsor missing logo', () => {
    const result = sponsorSchema.safeParse({
      slug: 'crubyt',
      name: 'Crubyt',
      tier: 'platinum',
    })

    expect(result.success).toBe(false)
  })
})
