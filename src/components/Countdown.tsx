import { useTranslation } from 'react-i18next'
import { useCountdown } from '@/hooks/useCountdown'

type CountdownProps = {
  dateStart: string
  dateEnd: string
  getNow?: () => number
  className?: string
}

type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds'

const UNITS: CountdownUnit[] = ['days', 'hours', 'minutes', 'seconds']

export function Countdown({
  dateStart,
  dateEnd,
  getNow,
  className,
}: CountdownProps) {
  const { t } = useTranslation()
  const { days, hours, minutes, seconds, phase } = useCountdown(
    dateStart,
    dateEnd,
    getNow,
  )

  const values: Record<CountdownUnit, number> = {
    days,
    hours,
    minutes,
    seconds,
  }

  if (phase === 'during') {
    return (
      <p className={className} role="status">
        {t('home.countdown.eventStarted')}
      </p>
    )
  }

  if (phase === 'after') {
    return (
      <p className={className} role="status">
        {t('home.countdown.eventEnded')}
      </p>
    )
  }

  return (
    <div
      role="timer"
      className={`rounded-lg border border-border bg-surface/80 px-4 py-5 sm:px-6${className ? ` ${className}` : ''}`}
    >
      <div className="grid grid-cols-4 divide-x divide-border">
        {UNITS.map((unit) => (
          <div key={unit} className="flex flex-col items-center px-2 sm:px-4">
            <span className="text-2xl font-bold tabular-nums text-text sm:text-3xl">
              {values[unit]}
            </span>
            <span className="mt-1 text-xs text-text-muted sm:text-sm">
              {t(`home.countdown.${unit}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
