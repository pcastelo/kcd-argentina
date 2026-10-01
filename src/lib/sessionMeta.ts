// Also loaded by build scripts and the dev server through Vite (see vite.config.ts).
import eventData from '../data/event.json'
import sessionsData from '../data/sessions.json'
import siteData from '../data/site.json'
import speakersData from '../data/speakers.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import type {
  Session,
  SessionType,
  Speaker,
} from '../schemas/collectionSchemas'
import { formatSpeakerAffiliation } from './speakers'

type Locale = 'es' | 'en'

const translations = { es, en } as const

export type SessionMeta = {
  path: string
  url: string
  title: string
  description: string
  image: string
  imageAlt: string
  /** Speaker photos are square; the default site card is landscape. */
  twitterCard: 'summary' | 'summary_large_image'
  locale: Locale
}

export type SessionCardData = {
  title: string
  typeLabel: string
  speakers: Array<{ name: string; affiliation?: string; photo?: string }>
  dateLabel: string
  timeLabel: string
  roomLabel: string
  venue: string
  siteName: string
}

export function isSessionDetailEligible(type: SessionType): boolean {
  return (
    type === 'talk' ||
    type === 'lightning' ||
    type === 'workshop' ||
    type === 'keynote'
  )
}

export function sessionPermalinkPath(locale: Locale, slug: string): string {
  return `/${locale}/agenda/${slug}`
}

/** Generated 1200x630 social card (scripts/lib/session-card.mjs). */
export function sessionCardPath(locale: Locale, slug: string): string {
  return `/og/sessions/${locale}/${slug}.png`
}

/** Sessions that get their own permalink (same set that opens the detail dialog). */
export function getPermalinkSessions(): Session[] {
  return (sessionsData as Session[]).filter((session) =>
    isSessionDetailEligible(session.type),
  )
}

export function findPermalinkSession(slug: string | undefined): Session | null {
  if (!slug) {
    return null
  }
  return getPermalinkSessions().find((session) => session.slug === slug) ?? null
}

function formatSessionWhen(session: Session, locale: Locale) {
  const tag = locale === 'en' ? 'en-US' : 'es-AR'
  const timeZone = eventData.timezone
  const date = new Intl.DateTimeFormat(tag, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(session.startTime))
  const time = new Intl.DateTimeFormat(tag, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en',
    timeZone,
  })
  const range = `${time.format(new Date(session.startTime))} - ${time.format(new Date(session.endTime))}`
  return { date, range }
}

function getSessionSpeakers(session: Session): Speaker[] {
  const speakersBySlug = new Map(
    (speakersData as Speaker[]).map((speaker) => [speaker.slug, speaker]),
  )
  return session.speakerSlugs
    .map((slug) => speakersBySlug.get(slug))
    .filter((speaker): speaker is Speaker => Boolean(speaker))
}

export function buildSessionCardData(
  session: Session,
  locale: Locale,
): SessionCardData {
  const t = translations[locale]
  const speakers = getSessionSpeakers(session)
  const { date, range } = formatSessionWhen(session, locale)

  return {
    title: session.title,
    typeLabel: t.agenda.types[session.type],
    speakers: speakers.length
      ? speakers.map((speaker) => ({
          name: speaker.name,
          affiliation: formatSpeakerAffiliation(speaker),
          photo: speaker.photo,
        }))
      : (session.speakerNames ?? []).map((name) => ({ name })),
    dateLabel: date.charAt(0).toUpperCase() + date.slice(1),
    timeLabel: range,
    roomLabel: t.agenda.roomsShort[session.room],
    venue: eventData.venue.name,
    siteName: t.seo.ogSiteName,
  }
}

export function buildSessionMeta(session: Session, locale: Locale): SessionMeta {
  const t = translations[locale]
  const card = buildSessionCardData(session, locale)
  const speakerNames = card.speakers.map((speaker) => speaker.name)
  const { date, range } = formatSessionWhen(session, locale)

  const details = [`${date}, ${range}`, card.roomLabel, card.venue]
  const description = [speakerNames.join(', '), details.join(' · ')]
    .filter(Boolean)
    .join(' — ')

  const path = sessionPermalinkPath(locale, session.slug)

  return {
    path,
    url: `${siteData.origin}${path}`,
    title: `${session.title} | ${t.seo.ogSiteName}`,
    description,
    image: `${siteData.origin}${sessionCardPath(locale, session.slug)}`,
    imageAlt: [session.title, speakerNames.join(', ')].filter(Boolean).join(' — '),
    twitterCard: 'summary_large_image',
    locale,
  }
}
