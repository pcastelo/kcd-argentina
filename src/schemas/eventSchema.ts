import { z } from 'zod'

const isoDateTimeSchema = z.string().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  { message: 'Invalid ISO datetime' },
)

export const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  image: z.string().optional(),
  mapUrl: z.url().optional(),
  mapEmbedUrl: z.url().optional(),
})

export const socialLinkSchema = z.object({
  platform: z.enum(['instagram', 'linkedin', 'twitter', 'meetup', 'youtube']),
  url: z.url(),
})

export const eventSchema = z.object({
  title: z.string(),
  dateStart: isoDateTimeSchema,
  dateEnd: isoDateTimeSchema,
  city: z.string(),
  venue: venueSchema,
  status: z.enum(['planning', 'announced', 'live', 'past']),
  registrationUrl: z.url(),
  linktreeUrl: z.url(),
  sponsorProspectusUrl: z.url(),
  contactEmail: z.email(),
  timezone: z.string(),
  cfpUrl: z.url().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
})

export type Event = z.infer<typeof eventSchema>
export type Venue = z.infer<typeof venueSchema>
export type SocialLink = z.infer<typeof socialLinkSchema>
