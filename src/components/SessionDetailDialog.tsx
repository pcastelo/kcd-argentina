import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkedInIcon } from '@/components/icons'
import {
  type AgendaDisplaySession,
  getSessionDurationMinutes,
} from '@/lib/agenda'
import {
  formatAgendaClockTime,
  formatAgendaTimeRange,
} from '@/lib/formatAgendaTime'
import type { SessionType, Speaker } from '@/schemas/collectionSchemas'

function sessionTypeBadgeClass(type: SessionType): string {
  switch (type) {
    case 'keynote':
      return 'bg-primary/20 text-primary'
    case 'workshop':
      return 'bg-accent/20 text-accent'
    case 'talk':
      return 'bg-secondary/20 text-secondary'
    default:
      return 'bg-surface text-text-muted'
  }
}

export type SessionDetailDialogProps = {
  open: boolean
  session: AgendaDisplaySession
  speakers: Speaker[]
  roomLabel: string
  typeLabel: string
  timezone: string
  locale: string
  onClose: () => void
}

export function SessionDetailDialog({
  open,
  session,
  speakers,
  roomLabel,
  typeLabel,
  timezone,
  locale,
  onClose,
}: SessionDetailDialogProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const duration = getSessionDurationMinutes(session)
  const timeRange = formatAgendaTimeRange(
    session.startTime,
    session.endTime,
    timezone,
    locale,
  )
  const startClock = formatAgendaClockTime(session.startTime, timezone, locale)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (open) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-auto max-h-[min(90vh,40rem)] w-[min(100%-2rem,32rem)] overflow-hidden rounded-xl border border-border bg-surface p-0 text-text shadow-xl open:flex open:flex-col backdrop:bg-black/60"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${sessionTypeBadgeClass(session.type)}`}
        >
          {typeLabel}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('agenda.detail.closeAriaLabel')}
          className="rounded-sm px-2 py-1 text-sm text-text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t('agenda.detail.close')}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <h2 id={titleId} className="text-lg font-semibold leading-snug text-text">
          {session.title}
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          <time dateTime={session.startTime}>{startClock}</time>
          {' \u00b7 '}
          {timeRange}
          {' \u00b7 '}
          {roomLabel}
        </p>
        <p className="mt-1 text-xs font-medium text-primary/80">
          {t('agenda.durationMinutes', { count: duration })}
        </p>

        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text">
          {session.abstract?.trim()
            ? session.abstract
            : t('agenda.detail.noAbstract')}
        </p>

        {speakers.length > 0 ? (
          <section className="mt-6">
            <h3 className="text-sm font-semibold text-text">
              {t('agenda.detail.speakersHeading')}
            </h3>
            <ul className="mt-3 space-y-3">
              {speakers.map((speaker) => {
                const roleParts = [speaker.title, speaker.company].filter(Boolean)
                const linkedin = speaker.social?.linkedin

                return (
                  <li key={speaker.slug} className="flex items-start gap-3">
                    {speaker.photo ? (
                      <img
                        src={speaker.photo}
                        alt=""
                        aria-hidden="true"
                        className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-primary/20"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary"
                        aria-hidden="true"
                      >
                        {speaker.name.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text">{speaker.name}</p>
                      {roleParts.length > 0 ? (
                        <p className="text-xs text-text-muted">
                          {roleParts.join(' @ ')}
                        </p>
                      ) : null}
                      {linkedin ? (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t('agenda.detail.viewProfile', {
                            name: speaker.name,
                          })}
                          className="mt-1 inline-flex text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <LinkedInIcon className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </dialog>
  )
}
