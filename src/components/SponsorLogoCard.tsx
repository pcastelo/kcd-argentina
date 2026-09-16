import { useTranslation } from 'react-i18next'
import {
  SPONSOR_TIER_LAYOUT,
  type SponsorTier,
} from '@/lib/sponsors'
import type { Sponsor } from '@/schemas/collectionSchemas'

type SponsorLogoCardProps = {
  sponsor: Sponsor
  tier: SponsorTier
}

export function SponsorLogoCard({ sponsor, tier }: SponsorLogoCardProps) {
  const { t } = useTranslation()
  const layout = SPONSOR_TIER_LAYOUT[tier]

  const cardClassName = [
    'group flex items-center justify-center rounded-2xl border border-border/60 bg-white px-5 py-3 shadow-sm transition duration-200',
    'hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10',
    layout.cardClassName,
  ].join(' ')

  const image = (
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      loading="lazy"
      className={`object-contain transition duration-200 group-hover:scale-[1.02] ${layout.logoClassName}`}
    />
  )

  if (!sponsor.url) {
    return (
      <li>
        <div className={cardClassName}>{image}</div>
      </li>
    )
  }

  return (
    <li>
      <a
        href={sponsor.url}
        rel="noopener noreferrer"
        target="_blank"
        className={`${cardClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
        aria-label={t('sponsors.logoAriaLabel', { name: sponsor.name })}
      >
        {image}
      </a>
    </li>
  )
}
