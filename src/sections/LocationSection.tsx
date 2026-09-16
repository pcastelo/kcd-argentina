import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { getEvent } from '@/lib/event'
import { formatEventDate, formatEventTimeRange } from '@/lib/formatEventDate'

function SubwayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-primary"
      aria-hidden="true"
    >
      <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
    </svg>
  )
}

function BusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-secondary"
      aria-hidden="true"
    >
      <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
    </svg>
  )
}

type DetailRowProps = {
  label: string
  value: ReactNode
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </dt>
      <dd className="mt-1 text-base text-text sm:text-lg">{value}</dd>
    </div>
  )
}

export function LocationSection() {
  const { t, i18n } = useTranslation()
  const event = getEvent()
  const { venue } = event
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR'
  const eventDate = formatEventDate(event.dateStart, event.timezone, locale)
  const eventHours = formatEventTimeRange(
    event.dateStart,
    event.dateEnd,
    event.timezone,
    locale,
  )

  return (
    <Section id="local" tone="plain" className="scroll-mt-8">
      <Container>
        <SectionHeader
          eyebrow={t('location.title')}
          title={venue.name}
          subtitle={t('location.subtitle')}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {venue.image ? (
            <figure className="relative overflow-hidden rounded-2xl border border-border shadow-[0_0_32px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]">
              <img
                src={venue.image}
                alt={t('location.venueImageAlt', { venue: venue.name })}
                className="aspect-[4/3] h-full w-full object-cover"
                loading="lazy"
                width={1280}
                height={960}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-4 py-3 text-right text-xs text-text-muted">
                {t('location.photoCredit')}
              </figcaption>
            </figure>
          ) : null}

          <div className="flex flex-col justify-center">
            <dl>
              <DetailRow label={t('location.when')} value={eventDate} />
              <DetailRow label={t('location.hours')} value={eventHours} />
              <DetailRow label={t('location.area')} value={t('location.neighborhood')} />
              <DetailRow label={t('location.address')} value={venue.address} />
            </dl>
            {venue.mapUrl ? (
              <div className="mt-6">
                <Button
                  href={venue.mapUrl}
                  variant="primary"
                  className="min-h-11 w-full sm:w-auto"
                  aria-label={t('location.openInMapsAriaLabel')}
                >
                  {t('location.openInMaps')}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {venue.mapEmbedUrl ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <iframe
              title={t('location.mapTitle')}
              src={venue.mapEmbedUrl}
              className="h-72 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}

        <div className="mt-12">
          <h3 className="text-center text-2xl font-bold text-text">
            {t('location.howToGetThere')}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-muted">
            {t('location.transportHint')}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card
              glow
              className="border-l-4 border-l-primary p-7 pl-8 sm:p-8 sm:pl-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <SubwayIcon />
                </div>
                <h4 className="text-lg font-semibold text-text">
                  {t('location.subte')}
                </h4>
              </div>
              <p className="mt-5 leading-relaxed text-text-muted">
                {t('location.subteDetails')}
              </p>
            </Card>
            <Card
              glow
              className="border-l-4 border-l-secondary p-7 pl-8 sm:p-8 sm:pl-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <BusIcon />
                </div>
                <h4 className="text-lg font-semibold text-text">
                  {t('location.bus')}
                </h4>
              </div>
              <p className="mt-5 leading-relaxed text-text-muted">
                {t('location.busDetails')}
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  )
}
