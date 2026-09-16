import eventData from '@/data/event.json'
import organizersData from '@/data/organizers.json'
import sessionsData from '@/data/sessions.json'
import speakersData from '@/data/speakers.json'
import sponsorsData from '@/data/sponsors.json'
import {
  organizersSchema,
  sessionsSchema,
  speakersSchema,
  sponsorsSchema,
} from '@/schemas/collectionSchemas'
import { eventSchema } from '@/schemas/eventSchema'

export function validateAllData(): void {
  eventSchema.parse(eventData)
  speakersSchema.parse(speakersData)
  sessionsSchema.parse(sessionsData)
  sponsorsSchema.parse(sponsorsData)
  organizersSchema.parse(organizersData)
}
