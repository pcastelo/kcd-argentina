import sessionsData from '@/data/sessions.json'
import { getSpeakers } from '@/lib/speakers'
import {
  type Room,
  type Session,
  type SessionType,
  type Speaker,
  sessionsSchema,
} from '@/schemas/collectionSchemas'

export type AgendaSpeakerDisplay = {
  slug: string
  name: string
  photo?: string
}

export { getSpeakers }

export const ROOM_ORDER: Room[] = ['plenario', 'sala-1', 'sala-2', 'sala-3']

export const PARALLEL_ROOM_ORDER: Array<'sala-1' | 'sala-2' | 'sala-3'> = [
  'sala-1',
  'sala-2',
  'sala-3',
]

const SLOT_MINUTES = 30

export type AgendaDisplaySession = Session & {
  isWorkshopContinuation?: boolean
}

export function isSessionDetailEligible(type: SessionType): boolean {
  return type === 'talk' || type === 'workshop' || type === 'keynote'
}

export type AgendaTimeSlot = {
  startTime: string
  endTime: string
  sessions: AgendaDisplaySession[]
}

export function getSessions(): Session[] {
  const result = sessionsSchema.safeParse(sessionsData)
  if (!result.success) {
    throw new Error(`Invalid sessions.json: ${result.error.message}`)
  }

  return [...result.data].sort(
    (left, right) =>
      new Date(left.startTime).getTime() - new Date(right.startTime).getTime(),
  )
}

function padTimePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function addMinutes(isoDate: string, minutes: number): string {
  const match = isoDate.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})$/,
  )
  if (!match) {
    throw new Error(`Invalid ISO datetime: ${isoDate}`)
  }

  const [, date, hours, mins, seconds, offset] = match
  const totalMinutes = Number(hours) * 60 + Number(mins) + minutes
  const nextHours = Math.floor(totalMinutes / 60)
  const nextMinutes = totalMinutes % 60

  return `${date}T${padTimePart(nextHours)}:${padTimePart(nextMinutes)}:${seconds}${offset}`
}

function collectSlotStartTimes(sessions: Session[]): string[] {
  const starts = new Set(sessions.map((session) => session.startTime))

  return [...starts].sort(
    (left, right) => new Date(left).getTime() - new Date(right).getTime(),
  )
}

export function groupSessionsByTimeSlot(sessions: Session[]): AgendaTimeSlot[] {
  const slotStarts = collectSlotStartTimes(sessions)

  return slotStarts.map((startTime) => {
    const startingSessions = sessions.filter(
      (session) => session.startTime === startTime,
    )
    const plenarySessions = startingSessions.filter((session) =>
      isFullWidthSession(session.type),
    )
    const roomSessions = startingSessions.filter(
      (session) => !isFullWidthSession(session.type),
    )
    const endTime =
      plenarySessions[0]?.endTime ?? addMinutes(startTime, SLOT_MINUTES)

    return {
      startTime,
      endTime,
      sessions: [...plenarySessions, ...roomSessions],
    }
  })
}

export function isFullWidthSession(type: SessionType): boolean {
  return ['reception', 'keynote', 'break', 'lunch', 'margin'].includes(type)
}

export function getSessionSpeakerLabel(
  session: Session,
  speakersBySlug: Map<string, string>,
): string | null {
  const names =
    session.speakerNames ??
    session.speakerSlugs
      .map((slug) => speakersBySlug.get(slug))
      .filter((name): name is string => Boolean(name))

  if (names.length === 0) {
    return null
  }

  return names.join(', ')
}

export function getSessionSpeakerNames(
  session: Session,
  speakersBySlug: Map<string, string>,
): string[] {
  if (session.speakerNames?.length) {
    return session.speakerNames
  }

  return session.speakerSlugs
    .map((slug) => speakersBySlug.get(slug))
    .filter((name): name is string => Boolean(name))
}

export function getSessionSpeakersForDisplay(
  session: Session,
  speakersBySlug: Map<string, Speaker>,
): AgendaSpeakerDisplay[] {
  if (session.speakerSlugs.length > 0) {
    return session.speakerSlugs
      .map((slug) => speakersBySlug.get(slug))
      .filter((speaker): speaker is Speaker => Boolean(speaker))
      .map((speaker) => ({
        slug: speaker.slug,
        name: speaker.name,
        photo: speaker.photo,
      }))
  }

  if (session.speakerNames?.length) {
    return session.speakerNames.map((name, index) => ({
      slug: `${session.id}-speaker-${index}`,
      name,
    }))
  }

  return []
}

const ROOM_SORT_ORDER: Record<Room, number> = {
  plenario: 0,
  'sala-1': 1,
  'sala-2': 2,
  'sala-3': 3,
}

function resolveDisplayEndTime(
  session: AgendaDisplaySession,
  slotEndTime: string,
): string {
  if (isFullWidthSession(session.type) || session.type === 'workshop') {
    return session.endTime
  }

  return slotEndTime
}

export function getAgendaTimelineSessions(
  sessions: Session[],
): AgendaDisplaySession[] {
  const slots = groupSessionsByTimeSlot(sessions)
  const timeline: AgendaDisplaySession[] = []

  for (const slot of slots) {
    for (const session of slot.sessions) {
      timeline.push({
        ...session,
        endTime: resolveDisplayEndTime(session, slot.endTime),
      })
    }
  }

  return timeline.sort((left, right) => {
    const timeDiff =
      new Date(left.startTime).getTime() - new Date(right.startTime).getTime()
    if (timeDiff !== 0) {
      return timeDiff
    }

    return ROOM_SORT_ORDER[left.room] - ROOM_SORT_ORDER[right.room]
  })
}

export type AgendaRoomFilter = 'all' | Room

export const AGENDA_FILTER_ORDER: AgendaRoomFilter[] = [
  'sala-1',
  'sala-2',
  'sala-3',
  'all',
]

export function filterTimelineByRoom(
  sessions: AgendaDisplaySession[],
  filter: AgendaRoomFilter,
): AgendaDisplaySession[] {
  if (filter === 'all') {
    return sessions
  }

  return sessions.filter((session) => session.room === filter)
}

export function countTimelineByRoom(
  sessions: AgendaDisplaySession[],
): Record<AgendaRoomFilter, number> {
  const counts: Record<AgendaRoomFilter, number> = {
    all: sessions.length,
    plenario: 0,
    'sala-1': 0,
    'sala-2': 0,
    'sala-3': 0,
  }

  for (const session of sessions) {
    counts[session.room] += 1
  }

  return counts
}

export function getSessionDurationMinutes(session: Session): number {
  if (session.durationMinutes) {
    return session.durationMinutes
  }

  const start = new Date(session.startTime).getTime()
  const end = new Date(session.endTime).getTime()
  return Math.max(1, Math.round((end - start) / 60_000))
}
