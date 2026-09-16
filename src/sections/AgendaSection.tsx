import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { getEvent } from '@/lib/event'
import {
  type AgendaDisplaySession,
  type AgendaRoomFilter,
  type AgendaSpeakerDisplay,
  AGENDA_FILTER_ORDER,
  countTimelineByRoom,
  filterTimelineByRoom,
  getAgendaTimelineSessions,
  getSessionDurationMinutes,
  getSessionSpeakersForDisplay,
  getSessions,
  getSpeakers,
} from '@/lib/agenda'
import {
  formatAgendaClockTime,
  formatAgendaTimeRange,
} from '@/lib/formatAgendaTime'
import type { SessionType, Speaker } from '@/schemas/collectionSchemas'

function sessionTypeBadgeClass(type: SessionType | 'continuation'): string {
  switch (type) {
    case 'keynote':
      return 'bg-primary/20 text-primary'
    case 'workshop':
      return 'bg-accent/20 text-accent'
    case 'talk':
      return 'bg-secondary/20 text-secondary'
    case 'continuation':
      return 'bg-accent/10 text-text-muted'
    default:
      return 'bg-surface text-text-muted'
  }
}

function AgendaSessionSpeakers({
  speakers,
  showPhotos,
  speakersListLabel,
}: {
  speakers: AgendaSpeakerDisplay[]
  showPhotos: boolean
  speakersListLabel: string
}) {
  if (speakers.length === 0) {
    return null
  }

  if (!showPhotos) {
    return (
      <p className="mt-1.5 text-xs text-text-muted">
        {speakers.map((speaker) => speaker.name).join(' \u00b7 ')}
      </p>
    )
  }

  return (
    <ul
      aria-label={speakersListLabel}
      className="mt-2 flex flex-wrap gap-2"
    >
      {speakers.map((speaker) => (
        <li
          key={speaker.slug}
          className="flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/50 px-2 py-1"
        >
          {speaker.photo ? (
            <img
              src={speaker.photo}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/20"
              loading="lazy"
              width={24}
              height={24}
            />
          ) : (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
              aria-hidden="true"
            >
              {speaker.name.charAt(0)}
            </span>
          )}
          <span className="text-xs text-text-muted">{speaker.name}</span>
        </li>
      ))}
    </ul>
  )
}

function AgendaTimelineItem({
  session,
  title,
  roomLabel,
  typeLabel,
  speakers,
  showSpeakerPhotos,
  timezone,
  locale,
  isLast,
  showRoom,
}: {
  session: AgendaDisplaySession
  title: string
  roomLabel: string
  typeLabel: string
  speakers: AgendaSpeakerDisplay[]
  showSpeakerPhotos: boolean
  timezone: string
  locale: string
  isLast: boolean
  showRoom: boolean
}) {
  const { t } = useTranslation()
  const duration = getSessionDurationMinutes(session)
  const isContinuation = session.isWorkshopContinuation === true
  const badgeType = isContinuation ? 'continuation' : session.type
  const timeRange = formatAgendaTimeRange(
    session.startTime,
    session.endTime,
    timezone,
    locale,
  )

  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-2.5 sm:grid-cols-[5.5rem_1fr] sm:gap-3">
      <div className="relative flex flex-col items-end pt-0.5 pr-1.5 text-right sm:pr-2">
        {!isLast ? (
          <span
            className="absolute top-2 right-0 h-full w-px bg-primary/30"
            aria-hidden="true"
          />
        ) : null}
        <span
          className="relative z-10 mb-1 h-2 w-2 rounded-full bg-primary ring-2 ring-bg"
          aria-hidden="true"
        />
        <time
          dateTime={session.startTime}
          className="text-sm font-bold text-primary sm:text-base"
        >
          {formatAgendaClockTime(session.startTime, timezone, locale)}
        </time>
        <p className="mt-0.5 text-[10px] leading-tight text-text-muted">
          {timeRange}
        </p>
        <span className="mt-1 text-[10px] font-medium text-primary/80">
          {t('agenda.durationMinutes', { count: duration })}
        </span>
      </div>

      <Card className="mb-2.5 flex overflow-hidden p-0 sm:mb-3">
        {showRoom ? (
          <div
            className="flex w-11 shrink-0 items-center justify-center border-r border-border bg-surface/60 px-1 py-2 sm:w-12"
            aria-label={roomLabel}
          >
            <span
              className="text-[9px] font-semibold uppercase leading-tight tracking-wide text-text-muted [writing-mode:vertical-rl] rotate-180 sm:text-[10px]"
            >
              {roomLabel}
            </span>
          </div>
        ) : null}

        <div className="min-w-0 flex-1 px-2.5 py-2 sm:px-3 sm:py-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`min-w-0 flex-1 text-sm font-semibold leading-snug ${
                isContinuation ? 'italic text-text-muted' : 'text-text'
              }`}
            >
              {title}
            </h3>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${sessionTypeBadgeClass(badgeType)}`}
            >
              {typeLabel}
            </span>
          </div>

          <AgendaSessionSpeakers
            speakers={speakers}
            showPhotos={showSpeakerPhotos}
            speakersListLabel={t('agenda.sessionSpeakersLabel')}
          />
        </div>
      </Card>
    </li>
  )
}

export function AgendaSection() {
  const { t, i18n } = useTranslation()
  const event = getEvent()
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR'
  const sessions = getSessions()
  const speakers = getSpeakers()
  const speakersBySlug = useMemo(
    () => new Map(speakers.map((speaker: Speaker) => [speaker.slug, speaker])),
    [speakers],
  )
  const [roomFilter, setRoomFilter] = useState<AgendaRoomFilter>('sala-1')

  const timeline = useMemo(() => getAgendaTimelineSessions(sessions), [sessions])
  const counts = useMemo(() => countTimelineByRoom(timeline), [timeline])
  const filteredTimeline = useMemo(
    () => filterTimelineByRoom(timeline, roomFilter),
    [timeline, roomFilter],
  )
  const showSpeakerPhotos = roomFilter === 'all'

  function getSessionTitle(session: AgendaDisplaySession): string {
    if (session.isWorkshopContinuation) {
      return t('agenda.workshopContinuation', { title: session.title })
    }
    return session.title
  }

  function getTypeLabel(session: AgendaDisplaySession): string {
    if (session.isWorkshopContinuation) {
      return t('agenda.types.continuation')
    }
    return t(`agenda.types.${session.type}`)
  }

  return (
    <Section id="agenda" tone="glow" className="scroll-mt-8">
      <Container>
        <SectionHeader
          eyebrow={t('agenda.eyebrow')}
          title={t('agenda.title')}
          subtitle={t('agenda.subtitle')}
          note={t('agenda.draftNotice')}
        />

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label={t('agenda.filterLabel')}
        >
          {AGENDA_FILTER_ORDER.map((filter) => {
            const isActive = roomFilter === filter
            const label =
              filter === 'all'
                ? t('agenda.filters.all')
                : t(`agenda.rooms.${filter}`)

            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setRoomFilter(filter)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-bg text-text-muted hover:border-primary/50 hover:text-text'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive ? 'bg-white/20' : 'bg-surface'
                  }`}
                >
                  {counts[filter]}
                </span>
              </button>
            )
          })}
        </div>

        <ol className="mt-6 list-none">
          {filteredTimeline.map((session, index) => (
            <AgendaTimelineItem
              key={session.id}
              session={session}
              title={getSessionTitle(session)}
              roomLabel={t(`agenda.roomsShort.${session.room}`)}
              typeLabel={getTypeLabel(session)}
              speakers={
                session.isWorkshopContinuation
                  ? []
                  : getSessionSpeakersForDisplay(session, speakersBySlug)
              }
              showSpeakerPhotos={showSpeakerPhotos}
              timezone={event.timezone}
              locale={locale}
              isLast={index === filteredTimeline.length - 1}
              showRoom={roomFilter === 'all' && session.room !== 'plenario'}
            />
          ))}
        </ol>

        {filteredTimeline.length === 0 ? (
          <p className="mt-8 text-center text-text-muted">{t('agenda.emptyFilter')}</p>
        ) : null}
      </Container>
    </Section>
  )
}
