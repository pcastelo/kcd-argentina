import { useTranslation } from 'react-i18next'
import { getEvent } from '@/lib/event'
import { formatEventDate } from '@/lib/formatEventDate'

export function HomePage() {
  const { t } = useTranslation()
  const event = getEvent()
  const eventDate = formatEventDate(event.dateStart, event.timezone)

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-100">{t('app.name')}</h1>
      <p className="mt-4 text-lg text-slate-300">
        {t('home.tagline', { city: event.city })}
      </p>
      <p className="mt-2 text-slate-400">
        {t('home.venueDate', { venue: event.venue.name, date: eventDate })}
      </p>
      <p className="mt-6 text-sm text-slate-500">{t('home.placeholder')}</p>
    </main>
  )
}
