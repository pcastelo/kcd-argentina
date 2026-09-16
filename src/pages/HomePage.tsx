import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { getEvent } from '@/lib/event'
import { formatEventDate } from '@/lib/formatEventDate'

export function HomePage() {
  const { t } = useTranslation()
  const event = getEvent()
  const eventDate = formatEventDate(event.dateStart, event.timezone)

  return (
    <Container className="flex flex-col justify-center py-16">
      <h1 className="text-3xl font-bold text-text">{t('app.name')}</h1>
      <p className="mt-4 text-lg text-text">
        {t('home.tagline', { city: event.city })}
      </p>
      <p className="mt-2 text-text-muted">
        {t('home.venueDate', { venue: event.venue.name, date: eventDate })}
      </p>
      <p className="mt-6 text-sm text-text-muted">{t('home.placeholder')}</p>
    </Container>
  )
}
