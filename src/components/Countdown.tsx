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
      aria-live="polite"
      className={`grid grid-cols-2 gap-4 sm:grid-cols-4${className ? ` ${className}` : ''}`}
    >
      {UNITS.map((unit) => (
        <div
          key={unit}
          className="rounded-md border border-border bg-surface/80 px-3 py-4"
        >
          <span className="block text-3xl font-bold tabular-nums text-text">
            {values[unit]}
          </span>
          <span className="mt-1 block text-sm text-text-muted">
            {t(`home.countdown.${unit}`)}
          </span>
        </div>
      ))}
    </div>
  )
}
