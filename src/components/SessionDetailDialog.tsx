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
import type { Speaker } from '@/schemas/collectionSchemas'

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
  const filePath = `talks/${session.slug}.md`

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
      className="fixed inset-0 m-auto max-h-[min(90vh,42rem)] w-[min(100%-1rem,48rem)] overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#1e1e1e] p-0 font-mono text-sm text-[#e6edf3] shadow-[0_12px_40px_rgba(0,0,0,0.55)] open:flex open:flex-col backdrop:bg-black/70"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="flex shrink-0 items-stretch border-b border-[#0f0f0f] bg-[#242424]">
        <div className="flex min-w-0 flex-1 items-end px-2 pt-2">
          <div
            className="relative max-w-[min(100%,28rem)] truncate rounded-t-md border border-b-0 border-[#3a3a3a] bg-[#1e1e1e] px-3 py-1.5 text-xs text-[#deddda]"
            aria-hidden="true"
          >
            <span className="text-[#51a2da]">kcd@argentina</span>
            <span className="text-[#9a9996]">:~/agenda</span>
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#51a2da]" />
          </div>
        </div>
        <div className="flex items-center gap-0.5 pr-1.5">
          <span
            className="flex h-8 w-8 items-center justify-center text-[#c0bfbc]"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span
            className="flex h-8 w-8 items-center justify-center text-[#c0bfbc]"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2.25" y="2.25" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('agenda.detail.closeAriaLabel')}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#c0bfbc] hover:bg-[#c01c28] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#51a2da]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 3l6 6M9 3L3 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5">
        <p className="text-[#8b949e]" aria-hidden="true">
          <span className="text-[#3fb950]">kcd@argentina</span>
          <span className="text-[#e6edf3]">:</span>
          <span className="text-[#58a6ff]">~/agenda</span>
          <span className="text-[#e6edf3]">$ </span>
          <span className="text-[#e6edf3]">cat {filePath}</span>
        </p>

        <div className="mt-3 space-y-1 text-[13px] leading-relaxed">
          <p className="text-[#8b949e]">---</p>
          <div className="flex flex-wrap items-baseline gap-x-1">
            <span className="text-[#ff7b72]">title</span>
            <span className="text-[#e6edf3]">:</span>
            <h2
              id={titleId}
              className="m-0 inline text-[13px] font-normal leading-relaxed text-[#a5d6ff]"
            >
              {session.title}
            </h2>
          </div>
          <p>
            <span className="text-[#ff7b72]">type</span>
            <span className="text-[#e6edf3]">: </span>
            <span className="text-[#7ee787]">{typeLabel}</span>
          </p>
          <p>
            <span className="text-[#ff7b72]">when</span>
            <span className="text-[#e6edf3]">: </span>
            <time dateTime={session.startTime} className="text-[#d2a8ff]">
              {startClock}
            </time>
            <span className="text-[#8b949e]"> | </span>
            <span className="text-[#d2a8ff]">{timeRange}</span>
          </p>
          <p>
            <span className="text-[#ff7b72]">room</span>
            <span className="text-[#e6edf3]">: </span>
            <span className="text-[#ffa657]">{roomLabel}</span>
          </p>
          <p>
            <span className="text-[#ff7b72]">duration</span>
            <span className="text-[#e6edf3]">: </span>
            <span className="text-[#ffa657]">
              {t('agenda.durationMinutes', { count: duration })}
            </span>
          </p>
          <p className="text-[#8b949e]">---</p>

          <p className="mt-3 whitespace-pre-line text-[#e6edf3]">
            {session.abstract?.trim()
              ? session.abstract
              : t('agenda.detail.noAbstract')}
          </p>

          {speakers.length > 0 ? (
            <section className="mt-4">
              <h3 className="text-[#58a6ff]">
                ## {t('agenda.detail.speakersHeading')}
              </h3>
              <ul className="mt-2 space-y-3">
                {speakers.map((speaker) => {
                  const roleParts = [speaker.title, speaker.company].filter(
                    Boolean,
                  )
                  const linkedin = speaker.social?.linkedin

                  return (
                    <li key={speaker.slug} className="flex items-start gap-3">
                      <span className="select-none text-[#8b949e]" aria-hidden="true">
                        -
                      </span>
                      {speaker.photo ? (
                        <img
                          src={speaker.photo}
                          alt=""
                          aria-hidden="true"
                          className="mt-0.5 h-10 w-10 shrink-0 rounded-sm object-cover ring-1 ring-[#30363d]"
                          loading="lazy"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#21262d] text-xs font-bold text-[#58a6ff]"
                          aria-hidden="true"
                        >
                          {speaker.name.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[#e6edf3]">{speaker.name}</p>
                        {roleParts.length > 0 ? (
                          <p className="text-xs text-[#8b949e]">
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
                            className="mt-1 inline-flex text-[#58a6ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
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

          <p className="mt-4 text-[#8b949e]" aria-hidden="true">
            <span className="text-[#3fb950]">kcd@argentina</span>
            <span className="text-[#e6edf3]">:</span>
            <span className="text-[#58a6ff]">~/agenda</span>
            <span className="text-[#e6edf3]">$ </span>
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#e6edf3]" />
          </p>
        </div>
      </div>
    </dialog>
  )
}
