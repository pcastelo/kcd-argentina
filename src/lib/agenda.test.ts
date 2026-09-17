import { describe, expect, it } from 'vitest'
import {
  addMinutes,
  countTimelineByRoom,
  filterTimelineByRoom,
  getAgendaTimelineSessions,
  getSessionSpeakersForDisplay,
  getSessions,
  getSpeakers,
  groupSessionsByTimeSlot,
  isFullWidthSession,
} from '@/lib/agenda'
import type { Session } from '@/schemas/collectionSchemas'

describe('agenda lib', () => {
  it('loads and sorts sessions from committed data', () => {
    const sessions = getSessions()

    expect(sessions.length).toBeGreaterThan(0)
    expect(sessions[0]?.type).toBe('reception')
    expect(sessions.at(-1)?.type).toBe('keynote')
  })

  it('groups parallel sessions by start time in 30-minute rows', () => {
    const sessions: Session[] = [
      {
        id: 'workshop',
        slug: 'workshop-1',
        title: 'Workshop 1',
        speakerSlugs: [],
        room: 'sala-3',
        startTime: '2026-10-03T10:30:00-03:00',
        endTime: '2026-10-03T11:30:00-03:00',
        durationMinutes: 60,
        type: 'workshop',
      },
      {
        id: 'talk',
        slug: 'slot-1',
        title: 'Slot 1',
        speakerSlugs: [],
        room: 'sala-1',
        startTime: '2026-10-03T10:30:00-03:00',
        endTime: '2026-10-03T11:00:00-03:00',
        type: 'talk',
      },
      {
        id: 'talk-2',
        slug: 'talk-2',
        title: 'Talk',
        speakerSlugs: ['ada-speaker'],
        speakerNames: ['Ada Speaker'],
        room: 'sala-1',
        startTime: '2026-10-03T11:00:00-03:00',
        endTime: '2026-10-03T11:30:00-03:00',
        type: 'talk',
      },
    ]

    const slots = groupSessionsByTimeSlot(sessions)

    expect(slots).toHaveLength(2)
    expect(slots[0]?.endTime).toBe('2026-10-03T11:00:00-03:00')
    expect(slots[0]?.sessions.map((session) => session.room).sort()).toEqual([
      'sala-1',
      'sala-3',
    ])
    expect(slots[1]?.sessions.map((session) => session.room)).toEqual(['sala-1'])
  })

  it('shows a 60-minute workshop once with its full end time', () => {
    const sessions: Session[] = [
      {
        id: 'workshop',
        slug: 'workshop-1',
        title: 'Workshop 1',
        speakerSlugs: [],
        room: 'sala-3',
        startTime: '2026-10-03T10:30:00-03:00',
        endTime: '2026-10-03T11:30:00-03:00',
        durationMinutes: 60,
        type: 'workshop',
      },
    ]

    const timeline = getAgendaTimelineSessions(sessions)

    expect(timeline).toHaveLength(1)
    expect(timeline[0]?.endTime).toBe('2026-10-03T11:30:00-03:00')
    expect(timeline[0]?.isWorkshopContinuation).toBeUndefined()
  })

  it('builds a flat timeline and filters by room', () => {
    const sessions: Session[] = [
      {
        id: 'keynote',
        slug: 'keynote',
        title: 'Keynote demo',
        speakerSlugs: [],
        room: 'plenario',
        startTime: '2026-10-03T10:00:00-03:00',
        endTime: '2026-10-03T10:30:00-03:00',
        type: 'keynote',
      },
      {
        id: 'talk',
        slug: 'talk',
        title: 'Charla demo',
        speakerSlugs: ['ada-speaker'],
        speakerNames: ['Ada Speaker'],
        room: 'sala-1',
        startTime: '2026-10-03T10:30:00-03:00',
        endTime: '2026-10-03T11:00:00-03:00',
        type: 'talk',
      },
    ]

    const timeline = getAgendaTimelineSessions(sessions)
    const counts = countTimelineByRoom(timeline)
    const sala1Only = filterTimelineByRoom(timeline, 'sala-1')

    expect(timeline).toHaveLength(2)
    expect(counts.all).toBe(2)
    expect(counts['sala-1']).toBe(1)
    expect(sala1Only).toHaveLength(1)
    expect(sala1Only[0]?.title).toBe('Charla demo')
  })

  it('adds minutes while preserving timezone offset', () => {
    expect(addMinutes('2026-10-03T10:30:00-03:00', 30)).toBe(
      '2026-10-03T11:00:00-03:00',
    )
  })

  it('identifies full-width plenary blocks', () => {
    expect(isFullWidthSession('reception')).toBe(true)
    expect(isFullWidthSession('talk')).toBe(false)
  })

  it('resolves session speakers with photos from speaker slugs', () => {
    const speakersBySlug = new Map([
      [
        'ada-speaker',
        {
          slug: 'ada-speaker',
          name: 'Ada Speaker',
          photo: 'https://example.com/ada.jpg',
        },
      ],
    ])

    const session: Session = {
      id: 'talk',
      slug: 'talk',
      title: 'Charla demo',
      speakerSlugs: ['ada-speaker'],
      room: 'sala-1',
      startTime: '2026-10-03T10:30:00-03:00',
      endTime: '2026-10-03T11:00:00-03:00',
      type: 'talk',
    }

    expect(getSessionSpeakersForDisplay(session, speakersBySlug)).toEqual([
      {
        slug: 'ada-speaker',
        name: 'Ada Speaker',
        photo: 'https://example.com/ada.jpg',
      },
    ])
  })

  it('loads speakers referenced by sessions', () => {
    const speakers = getSpeakers()
    const sessions = getSessions()
    const speakerSlugs = new Set(speakers.map((speaker) => speaker.slug))

    for (const session of sessions) {
      for (const slug of session.speakerSlugs) {
        expect(speakerSlugs.has(slug)).toBe(true)
      }
    }
  })
})
