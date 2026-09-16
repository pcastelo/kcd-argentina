import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { getSponsors } from '@/lib/sponsors'

type SponsorStripProps = {
  linktreeUrl: string
}

export function SponsorStrip({ linktreeUrl }: SponsorStripProps) {
  const { t } = useTranslation()
  const sponsors = getSponsors()

  return (
    <Section className="border-t border-border bg-surface">
      <Container>
        <h2 className="text-center text-xl font-semibold text-text">
          {t('home.sponsors.title')}
        </h2>

        {sponsors.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <p className="max-w-xl text-text-muted">
              {t('home.sponsors.emptyState')}
            </p>
            <Button href={linktreeUrl} variant="ghost" openInNewTab>
              {t('home.sponsors.becomeSponsor')}
            </Button>
          </div>
        ) : (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {sponsors.map((sponsor) => (
              <li key={sponsor.slug}>
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      loading="lazy"
                      className="max-h-12 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    loading="lazy"
                    className="max-h-12 w-auto object-contain"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}
