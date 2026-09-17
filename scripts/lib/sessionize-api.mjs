import {
  attachSessionSlugs,
  cleanText,
  fold,
  inferLanguageFromTitle,
  namesOverlap,
  parseSpeakerLinks,
  parseTagLine,
  parseUrl,
  slugify,
} from './sessionize-merge.mjs'

export const DEFAULT_ENDPOINT_ID = 'vxssqlh8'
export const EVENT_DATE = '2026-10-03'
export const TIMEZONE_OFFSET = '-03:00'

export function buildCategoryMap(categories = []) {
  const itemToCategory = new Map()

  for (const category of categories) {
    for (const item of category.items ?? []) {
      itemToCategory.set(item.id, {
        categoryTitle: category.title,
        name: item.name,
      })
    }
  }

  return itemToCategory
}

export function mapApiDateTime(value) {
  if (!value) {
    return undefined
  }

  if (/[+-]\d{2}:\d{2}$/.test(value)) {
    return value
  }

  return `${value}${TIMEZONE_OFFSET}`
}

export function durationMinutes(startTime, endTime) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.round((end - start) / 60_000)
}

export function buildSessionId(startTime, room, slug) {
  const timePart = startTime.slice(11, 16).replace(':', '')
  return `${EVENT_DATE}-${timePart}-${room}-${slug}`
}

export function mapRoom(roomId, rooms = [], isServiceSession = false) {
  if (isServiceSession) {
    return 'plenario'
  }

  const room = rooms.find((entry) => entry.id === roomId)
  if (!room) {
    return 'sala-1'
  }

  const name = fold(room.name)
  if (name.includes('sala 3') || name.includes('workshop')) {
    return 'sala-3'
  }
  if (name.includes('sala 2')) {
    return 'sala-2'
  }
  if (name.includes('sala principal')) {
    return 'sala-1'
  }

  return 'sala-1'
}

export function mapServiceSessionType(title) {
  const text = fold(title)

  if (text.includes('recepcion') || text.includes('acreditacion')) {
    return 'reception'
  }
  if (text.includes('coffee break')) {
    return 'break'
  }
  if (text.includes('almuerzo')) {
    return 'lunch'
  }
  if (text.includes('keynote')) {
    return 'keynote'
  }

  return 'transition'
}

export function normalizeServiceTitle(title) {
  const text = fold(title)

  if (text.includes('coffee break')) {
    return 'Coffee Break'
  }
  if (text.includes('keynote de apertura')) {
    return 'Keynote de Apertura'
  }
  if (text.includes('keynote de cierre')) {
    return 'Keynote de Cierre'
  }

  return cleanText(title)
}

export function getCategoryValue(categoryMap, session, categoryTitle) {
  const needle = fold(categoryTitle)

  for (const itemId of session.categoryItems ?? []) {
    const entry = categoryMap.get(itemId)
    if (entry && fold(entry.categoryTitle) === needle) {
      return entry.name
    }
  }

  return undefined
}

export function mapSessionType(session, categoryMap, room) {
  if (session.isServiceSession) {
    return mapServiceSessionType(session.title)
  }

  const format = getCategoryValue(categoryMap, session, 'Session format')
  if (fold(format) === 'workshop' || room === 'sala-3') {
    return 'workshop'
  }

  return 'talk'
}

export function countScheduledSessions(sessions = []) {
  return sessions.filter((session) => session.startsAt).length
}

export function buildSpeakerSlugMap(apiSpeakers = [], existingSpeakers = []) {
  const existingBySlug = new Map(existingSpeakers.map((speaker) => [speaker.slug, speaker]))
  const slugById = new Map()

  for (const apiSpeaker of apiSpeakers) {
    let slug = slugify(apiSpeaker.fullName)

    for (const [, existingSpeaker] of existingBySlug.entries()) {
      if (namesOverlap(existingSpeaker.name, apiSpeaker.fullName)) {
        slug = existingSpeaker.slug
        break
      }
    }

    slugById.set(apiSpeaker.id, slug)
  }

  return slugById
}

export function normalizeApiSpeaker(apiSpeaker, slug, existingSpeaker) {
  const { title, company } = parseTagLine(apiSpeaker.tagLine)
  const socialFromApi = parseSpeakerLinks(apiSpeaker.links)
  const social = socialFromApi ?? existingSpeaker?.social
  const bio = cleanText(apiSpeaker.bio)
  const photo = parseUrl(apiSpeaker.profilePicture)

  const speaker = {
    slug,
    name: cleanText(apiSpeaker.fullName),
  }

  if (title) {
    speaker.title = title
  }
  if (company) {
    speaker.company = company
  }
  if (bio) {
    speaker.bio = bio
  }
  if (photo) {
    speaker.photo = photo
  }
  if (social) {
    speaker.social = social
  }

  return speaker
}

export function normalizeApiSession(session, { rooms, categoryMap, slugById, speakersById }) {
  const room = mapRoom(session.roomId, rooms, session.isServiceSession)
  const type = mapSessionType(session, categoryMap, room)
  const title = session.isServiceSession
    ? normalizeServiceTitle(session.title)
    : cleanText(session.title)
  const slug = slugify(title)
  const startTime = mapApiDateTime(session.startsAt)
  const endTime = mapApiDateTime(session.endsAt)

  if (!startTime || !endTime) {
    return null
  }

  const speakerSlugs = []
  const speakerNames = []

  for (const speakerId of session.speakers ?? []) {
    const speakerSlug = slugById.get(speakerId)
    const speaker = speakersById.get(speakerId)
    if (!speakerSlug || !speaker) {
      continue
    }
    speakerSlugs.push(speakerSlug)
    speakerNames.push(cleanText(speaker.fullName))
  }

  const output = {
    id: buildSessionId(startTime, room, slug),
    slug,
    title,
    speakerSlugs,
    room,
    startTime,
    endTime,
    durationMinutes: durationMinutes(startTime, endTime),
    type,
    language: inferLanguageFromTitle(title),
  }

  if (speakerNames.length > 0) {
    output.speakerNames = speakerNames
  }

  const abstract = cleanText(session.description)
  if (abstract) {
    output.abstract = abstract
  }

  const track = getCategoryValue(categoryMap, session, 'Track')
  if (track) {
    output.track = track
  }

  return output
}

export function buildSessionsJson(apiData, existingSpeakers = []) {
  const categoryMap = buildCategoryMap(apiData.categories)
  const slugById = buildSpeakerSlugMap(apiData.speakers ?? [], existingSpeakers)
  const speakersById = new Map((apiData.speakers ?? []).map((speaker) => [speaker.id, speaker]))

  const sessions = (apiData.sessions ?? [])
    .map((session) =>
      normalizeApiSession(session, {
        rooms: apiData.rooms ?? [],
        categoryMap,
        slugById,
        speakersById,
      }),
    )
    .filter(Boolean)
    .sort(
      (left, right) =>
        new Date(left.startTime).getTime() - new Date(right.startTime).getTime(),
    )

  return sessions
}

export function buildSpeakersJson(apiData, sessions, existingSpeakers = []) {
  const existingBySlug = new Map(existingSpeakers.map((speaker) => [speaker.slug, speaker]))
  const slugById = buildSpeakerSlugMap(apiData.speakers ?? [], existingSpeakers)

  const speakers = (apiData.speakers ?? [])
    .map((apiSpeaker) => {
      const slug = slugById.get(apiSpeaker.id)
      const existingSpeaker = [...existingBySlug.values()].find((speaker) =>
        namesOverlap(speaker.name, apiSpeaker.fullName),
      )
      return normalizeApiSpeaker(apiSpeaker, slug, existingSpeaker)
    })
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))

  return attachSessionSlugs(speakers, sessions)
}

export function summarizeSync(sessions, speakers) {
  const serviceCount = sessions.filter((session) =>
    ['reception', 'keynote', 'break', 'lunch'].includes(session.type),
  ).length
  const workshopCount = sessions.filter((session) => session.type === 'workshop').length

  return {
    sessionCount: sessions.length,
    speakerCount: speakers.length,
    serviceCount,
    workshopCount,
  }
}

export async function fetchAll(endpointId, fetchImpl = fetch) {
  const url = `https://sessionize.com/api/v2/${endpointId}/view/All`
  const response = await fetchImpl(url)

  if (!response.ok) {
    throw new Error(`Sessionize API request failed with status ${response.status}`)
  }

  return response.json()
}
