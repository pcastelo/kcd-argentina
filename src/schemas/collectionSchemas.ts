import { z } from 'zod'

export const speakerSchema = z.object({
  slug: z.string(),
  name: z.string(),
})

export const sessionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
})

export const sponsorSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tier: z.enum(['platinum', 'gold', 'silver', 'community', 'venue']),
})

export const organizerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
})

export const speakersSchema = z.array(speakerSchema)
export const sessionsSchema = z.array(sessionSchema)
export const sponsorsSchema = z.array(sponsorSchema)
export const organizersSchema = z.array(organizerSchema)
