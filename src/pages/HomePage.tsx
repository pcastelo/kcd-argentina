import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Countdown } from '@/components/Countdown'
import { SEOHead } from '@/components/SEOHead'
import { useLocale } from '@/hooks/useLocale'
import { brandAssets } from '@/lib/brand'
import { getEvent } from '@/lib/event'
import { formatEventDate, formatEventTimeRange } from '@/lib/formatEventDate'
import { localePath } from '@/lib/locale'
import { CodeOfConductSection } from '@/sections/CodeOfConductSection'
import { AgendaSection } from '@/sections/AgendaSection'
import { LocationSection } from '@/sections/LocationSection'
import { OrganizersSection } from '@/sections/OrganizersSection'
import { SpeakersSection } from '@/sections/SpeakersSection'
import { SponsorsSection } from '@/sections/SponsorsSection'

export function HomePage() {
  const { t } = useTranslation()
  const { hash } = useLocation()
  const locale = useLocale()
  const event = getEvent()
  const localeTag = locale === 'en' ? 'en-US' : 'es-AR'
  const isLocationSection = hash === '#local'
  const eventDate = formatEventDate(event.dateStart, event.timezone, localeTag)
  const eventHours = formatEventTimeRange(
    event.dateStart,
    event.dateEnd,
    event.timezone,
    localeTag,
  )

  const quickLinks = [
    { key: 'nav.agenda', hash: 'agenda' },
    { key: 'nav.speakers', hash: 'speakers' },
    { key: 'nav.sponsors', hash: 'sponsors' },
    { key: 'nav.location', hash: 'local' },
  ] as const

  return (
    <>
      <SEOHead
        titleKey={isLocationSection ? 'seo.locationTitle' : 'seo.homeTitle'}
        descriptionKey={
          isLocationSection ? 'seo.locationDescription' : 'seo.homeDescription'
        }
        path={isLocationSection ? `/${locale}/location` : `/${locale}`}
        locale={locale}
      />
      <section
        id="home"
        className="relative flex min-h-[calc(100dvh-4.5rem)] scroll-mt-8 items-center overflow-hidden bg-bg"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/70 to-bg"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_color-mix(in_srgb,var(--color-primary)_12%,transparent)_0%,_transparent_65%)]"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex w-full flex-col items-center py-12 text-center sm:py-16 lg:py-20">
          <img
            src={brandAssets.logoDark}
            alt=""
            className="h-auto w-full max-w-[18rem] sm:max-w-[22rem] md:max-w-[28rem]"
            width={448}
            height={130}
          />
          <h1 className="sr-only">{event.title}</h1>
          <p className="mt-8 max-w-3xl text-xl font-medium leading-snug text-text sm:mt-10 sm:text-2xl md:text-3xl">
            {t('home.heroSubtitle')}
          </p>
          <p className="mt-3 max-w-2xl text-base text-text-muted sm:text-lg">
            {t('home.tagline', { city: event.city })}
          </p>

          <ul
            className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            aria-label={t('home.eventMetaLabel')}
          >
            {[event.venue.name, eventDate, eventHours].map((label) => (
              <li
                key={label}
                className="rounded-full border border-primary/25 bg-surface/50 px-3 py-1.5 text-sm text-text-muted backdrop-blur-sm sm:px-4"
              >
                {label}
              </li>
            ))}
          </ul>

          <Countdown
            dateStart={event.dateStart}
            dateEnd={event.dateEnd}
            className="mt-10 w-full max-w-3xl shadow-lg shadow-primary/10 sm:mt-12"
          />

          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:mt-12 sm:max-w-none sm:flex-row sm:justify-center">
            <Button
              href={event.registrationUrl}
              variant="primary"
              className="min-h-12 w-full px-8 text-base sm:w-auto"
              aria-label={t('home.ctaTicketsAriaLabel')}
            >
              {t('home.ctaTickets')}
            </Button>
            <Button
              href={localePath(locale, undefined, 'agenda')}
              variant="ghost"
              openInNewTab={false}
              className="min-h-12 w-full px-8 text-base sm:w-auto"
            >
              {t('home.ctaAgenda')}
            </Button>
          </div>

          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium sm:mt-12"
            aria-label={t('home.quickNavLabel')}
          >
            {quickLinks.map((item) => (
              <a
                key={item.hash}
                href={localePath(locale, undefined, item.hash)}
                className="text-primary hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      <SponsorsSection />
      <AgendaSection />
      <SpeakersSection />
      <LocationSection />
      <OrganizersSection />
      <CodeOfConductSection />
    </>
  )
}
