import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Countdown } from '@/components/Countdown'
import { SponsorStrip } from '@/components/SponsorStrip'
import { getEvent } from '@/lib/event'
import { formatEventDate } from '@/lib/formatEventDate'

export function HomePage() {
  const { t, i18n } = useTranslation()
  const event = getEvent()
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR'
  const eventDate = formatEventDate(event.dateStart, event.timezone, locale)

  return (
    <>
      <section className="relative overflow-hidden bg-bg">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/75 to-bg"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex flex-col items-center py-16 text-center sm:py-24">
          <img
            src="/logo.png"
            alt="KCD Argentina 2026"
            className="h-20 w-20 sm:h-24 sm:w-24"
            width={96}
            height={96}
          />
          <h1 className="mt-6 text-4xl font-bold text-text sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-muted">
            {t('home.heroSubtitle')}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {t('home.tagline', { city: event.city })}
          </p>
          <Countdown
            dateStart={event.dateStart}
            dateEnd={event.dateEnd}
            className="mt-8 w-full max-w-2xl"
          />
          <Button
            href={event.registrationUrl}
            variant="primary"
            className="mt-8 min-h-11 w-full max-w-xs sm:w-auto"
            aria-label={t('home.ctaTicketsAriaLabel')}
          >
            {t('home.ctaTickets')}
          </Button>
          <p className="mt-4 text-text-muted">
            {t('home.venueDate', {
              venue: event.venue.name,
              date: eventDate,
            })}
          </p>
        </Container>
      </section>
      <SponsorStrip linktreeUrl={event.linktreeUrl} />
    </>
  )
}
