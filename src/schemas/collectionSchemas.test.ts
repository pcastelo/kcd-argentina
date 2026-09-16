import { describe, expect, it } from 'vitest'
import organizersData from '@/data/organizers.json'
import sessionsData from '@/data/sessions.json'
import speakersData from '@/data/speakers.json'
import sponsorsData from '@/data/sponsors.json'
import {
  organizersSchema,
  sessionsSchema,
  speakersSchema,
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
})
