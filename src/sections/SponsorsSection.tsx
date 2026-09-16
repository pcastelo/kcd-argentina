import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { SponsorLogoCard } from '@/components/SponsorLogoCard'
import { getEvent } from '@/lib/event'
import {
  getPopulatedSponsorTiers,
  getSponsors,
  groupSponsorsByTier,
  SPONSOR_TIER_LAYOUT,
  TIER_ORDER,
} from '@/lib/sponsors'

export function SponsorsSection() {
  const { t } = useTranslation()
  const event = getEvent()
  const sponsors = getSponsors()
  const groups = groupSponsorsByTier(sponsors)
  const populatedTiers = getPopulatedSponsorTiers(groups)
  const hasOpenTiers = populatedTiers.length < TIER_ORDER.length

  return (
    <Section id="sponsors" tone="surface" className="scroll-mt-8">
      <Container>
        <SectionHeader
          eyebrow={t('sponsors.eyebrow')}
          title={t('sponsors.title')}
          subtitle={t('sponsors.subtitle')}
          badge={
            sponsors.length > 0
              ? t('sponsors.count', { count: sponsors.length })
              : undefined
          }
        />

        {sponsors.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="max-w-2xl text-text-muted">
              {t('home.sponsors.emptyState')}
            </p>
            <Button href={event.sponsorProspectusUrl} variant="primary" openInNewTab>
              {t('sponsors.becomeSponsor')}
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {populatedTiers.map((tier) => {
              const tierSponsors = groups.get(tier) ?? []
              const layout = SPONSOR_TIER_LAYOUT[tier]

              return (
                <section key={tier} aria-labelledby={`sponsors-tier-${tier}`}>
                  <h3
                    id={`sponsors-tier-${tier}`}
                    className="text-center text-sm font-semibold uppercase tracking-wider text-primary"
                  >
                    {t(`sponsors.tiers.${tier}`)}
                  </h3>
                  <ul className={`mt-6 ${layout.listClassName}`}>
                    {tierSponsors.map((sponsor) => (
                      <SponsorLogoCard
                        key={sponsor.slug}
                        sponsor={sponsor}
                        tier={tier}
                      />
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        )}

        {sponsors.length > 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            {hasOpenTiers ? (
              <p className="max-w-2xl text-sm text-text-muted">
                {t('sponsors.stillOpen')}
              </p>
            ) : null}
            <Button href={event.sponsorProspectusUrl} variant="primary" openInNewTab>
              {t('sponsors.becomeSponsor')}
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
