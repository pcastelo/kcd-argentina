import eventData from '@/data/event.json'
import { eventSchema, type Event } from '@/schemas/eventSchema'

export function getEvent(): Event {
  const result = eventSchema.safeParse(eventData)
  if (!result.success) {
    throw new Error(`Invalid event.json: ${result.error.message}`)
  }
  return result.data
}
