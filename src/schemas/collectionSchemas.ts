import { z } from 'zod'

export const roomSchema = z.enum(['plenario', 'sala-1', 'sala-2', 'sala-3'])

export const sessionTypeSchema = z.enum([
  'reception',
  'keynote',
  'talk',
  'workshop',
  'break',
  'lunch',
  'transition',
  'margin',
])

export const sessionLanguageSchema = z.enum(['es', 'en', 'mixed'])

export const speakerSocialSchema = z.object({
  linkedin: z.url().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
})

export const speakerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  bioEn: z.string().optional(),
  photo: z.string().optional(),
  social: speakerSocialSchema.optional(),
  sessionSlugs: z.array(z.string()).optional(),
})

export const sessionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  titleEn: z.string().optional(),
  abstract: z.string().optional(),
  speakerSlugs: z.array(z.string()),
  speakerNames: z.array(z.string()).optional(),
  room: roomSchema,
  startTime: z.string(),
  endTime: z.string(),
  durationMinutes: z.number().optional(),
  type: sessionTypeSchema,
  track: z.string().optional(),
  language: sessionLanguageSchema.optional(),
})

export const sponsorSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tier: z.enum([
    'diamond',
    'platinum',
    'gold',
    'light',
    'silver',
    'community',
    'venue',
  ]),
  logo: z.string(),
  url: z.url().optional(),
  order: z.number().optional(),
})

export type Sponsor = z.infer<typeof sponsorSchema>
export type Speaker = z.infer<typeof speakerSchema>
export type Session = z.infer<typeof sessionSchema>
export type Room = z.infer<typeof roomSchema>
export type SessionType = z.infer<typeof sessionTypeSchema>

export const organizerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  company: z.string().optional(),
  photo: z.string().optional(),
  linkedin: z.url().optional(),
  placeholder: z.boolean().optional(),
})

export type Organizer = z.infer<typeof organizerSchema>

export const speakersSchema = z.array(speakerSchema)
export const sessionsSchema = z.array(sessionSchema)
export const sponsorsSchema = z.array(sponsorSchema)
export const organizersSchema = z.array(organizerSchema)
