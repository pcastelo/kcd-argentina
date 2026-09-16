import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { getEvent } from '@/lib/event'
import { getSponsors, TIER_ORDER } from '@/lib/sponsors'
import type { Sponsor } from '@/schemas/collectionSchemas'

function groupSponsorsByTier(sponsors: Sponsor[]) {
  const groups = new Map<string, Sponsor[]>()

  for (const tier of TIER_ORDER) {
    groups.set(tier, [])
  }

  for (const sponsor of sponsors) {
    const tierSponsors = groups.get(sponsor.tier) ?? []
    tierSponsors.push(sponsor)
    groups.set(sponsor.tier, tierSponsors)
  }

  return groups
}

export function SponsorsSection() {
  const { t } = useTranslation()
  const event = getEvent()
  const sponsors = getSponsors()
  const groups = groupSponsorsByTier(sponsors)

  return (
    <Section id="sponsors" tone="surface" className="scroll-mt-8">
      <Container>
        <SectionHeader
          eyebrow={t('sponsors.eyebrow')}
          title={t('sponsors.title')}
          subtitle={t('sponsors.subtitle')}
        />

        <div className="mt-10 space-y-10">
          {TIER_ORDER.map((tier) => {
            const tierSponsors = groups.get(tier) ?? []

            return (
              <div key={tier}>
                <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-primary">
                  {t(`sponsors.tiers.${tier}`)}
                </h3>
                {tierSponsors.length === 0 ? (
                  <p className="mt-4 text-center text-sm text-text-muted">
                    {t('sponsors.emptyTier')}
                  </p>
                ) : (
                  <ul className="mt-6 flex flex-wrap items-center justify-center gap-8">
                    {tierSponsors.map((sponsor) => (
                      <li key={sponsor.slug}>
                        <div
                          className="flex h-20 min-w-[11rem] items-center justify-center rounded-lg border border-border/60 bg-white px-5 py-3 shadow-sm"
                        >
                          {sponsor.url ? (
                            <a
                              href={sponsor.url}
                              rel="noopener noreferrer"
                              target="_blank"
                              className="inline-flex max-w-full rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                            >
                              <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                loading="lazy"
                                className="max-h-12 w-auto max-w-[12rem] object-contain"
                              />
                            </a>
                          ) : (
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              loading="lazy"
                              className="max-h-12 w-auto max-w-[12rem] object-contain"
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href={event.sponsorProspectusUrl} variant="primary" openInNewTab>
            {t('sponsors.becomeSponsor')}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
