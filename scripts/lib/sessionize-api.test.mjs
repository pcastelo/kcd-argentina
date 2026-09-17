import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  buildCategoryMap,
  buildSessionsJson,
  buildSpeakersJson,
  countScheduledSessions,
  mapRoom,
  mapServiceSessionType,
  mapSessionType,
  summarizeSync,
} from './sessionize-api.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixture = JSON.parse(
  readFileSync(join(__dirname, '../fixtures/sessionize-all.sample.json'), 'utf8'),
)

describe('sessionize-api', () => {
  it('builds category map from fixture categories', () => {
    const categoryMap = buildCategoryMap(fixture.categories)
    expect(categoryMap.get(482495)?.name).toBe('Workshop')
    expect(categoryMap.get(482504)?.name).toBe('AI/GenAI/ML')
  })

  it('maps service sessions to plenario types', () => {
    const service = fixture.sessions.find((session) => session.isServiceSession)
    expect(mapRoom(service.roomId, fixture.rooms, true)).toBe('plenario')
    expect(mapServiceSessionType(service.title)).toBe('reception')
  })

  it('maps content rooms and workshop type', () => {
    const talk = fixture.sessions.find((session) => session.roomId === 85833)
    const workshop = fixture.sessions.find((session) => session.roomId === 85835)
    const categoryMap = buildCategoryMap(fixture.categories)

    expect(mapRoom(talk.roomId, fixture.rooms, false)).toBe('sala-1')
    expect(mapRoom(workshop.roomId, fixture.rooms, false)).toBe('sala-3')
    expect(mapSessionType(workshop, categoryMap, 'sala-3')).toBe('workshop')
  })

  it('maps Zero Trust to sala-2 at 16:15', () => {
    const zeroTrust = fixture.sessions.find((session) =>
      session.title.includes('Zero Trust'),
    )
    const categoryMap = buildCategoryMap(fixture.categories)
    const sessions = buildSessionsJson(fixture)
    const zeroTrustSession = sessions.find((session) => session.title.includes('Zero Trust'))

    expect(mapRoom(zeroTrust.roomId, fixture.rooms, false)).toBe('sala-2')
    expect(zeroTrustSession.room).toBe('sala-2')
    expect(zeroTrustSession.startTime).toBe('2026-10-03T16:15:00-03:00')
    expect(zeroTrustSession.type).toBe('talk')
  })

  it('builds sessions and speakers from fixture', () => {
    const sessions = buildSessionsJson(fixture)
    const speakers = buildSpeakersJson(fixture, sessions)
    const summary = summarizeSync(sessions, speakers)

    expect(countScheduledSessions(fixture.sessions)).toBe(4)
    expect(sessions).toHaveLength(4)
    expect(speakers.length).toBeGreaterThan(0)
    expect(summary.serviceCount).toBe(1)
    expect(summary.workshopCount).toBe(1)
    expect(speakers.every((speaker) => Array.isArray(speaker.sessionSlugs))).toBe(true)
  })
})
