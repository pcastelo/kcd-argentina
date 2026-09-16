import sponsorsData from '@/data/sponsors.json'
import {
  type Sponsor,
  sponsorsSchema,
} from '@/schemas/collectionSchemas'

export const TIER_ORDER = [
  'diamond',
  'platinum',
  'gold',
  'light',
  'silver',
  'community',
  'venue',
] as const

export type SponsorTier = (typeof TIER_ORDER)[number]

type SponsorTierLayout = {
  logoClassName: string
  cardClassName: string
  listClassName: string
}

export const SPONSOR_TIER_LAYOUT: Record<SponsorTier, SponsorTierLayout> = {
  diamond: {
    logoClassName: 'max-h-16 w-auto max-w-[14rem] sm:max-h-20 sm:max-w-[18rem]',
    cardClassName:
      'min-h-[7.5rem] min-w-[14rem] px-8 py-6 shadow-lg shadow-primary/15 sm:min-w-[18rem]',
    listClassName: 'flex flex-wrap items-center justify-center gap-8',
  },
  platinum: {
    logoClassName: 'max-h-14 w-auto max-w-[12rem] sm:max-h-16 sm:max-w-[14rem]',
    cardClassName: 'min-h-24 min-w-[12rem] px-6 py-5',
    listClassName: 'flex flex-wrap items-center justify-center gap-6',
  },
  gold: {
    logoClassName: 'max-h-12 w-auto max-w-[11rem] sm:max-h-14 sm:max-w-[12rem]',
    cardClassName: 'min-h-20 min-w-[11rem] px-5 py-4',
    listClassName: 'flex flex-wrap items-center justify-center gap-5',
  },
  light: {
    logoClassName: 'max-h-10 w-auto max-w-[9rem] sm:max-h-12 sm:max-w-[10rem]',
    cardClassName: 'min-h-[4.5rem] min-w-[9.5rem] px-4 py-3',
    listClassName: 'flex flex-wrap items-center justify-center gap-5',
  },
  silver: {
    logoClassName: 'max-h-10 w-auto max-w-[9rem] sm:max-h-12 sm:max-w-[10rem]',
    cardClassName: 'min-h-[4.5rem] min-w-[9.5rem] px-4 py-3',
    listClassName: 'flex flex-wrap items-center justify-center gap-5',
  },
  community: {
    logoClassName: 'max-h-9 w-auto max-w-[8rem] sm:max-h-10 sm:max-w-[9rem]',
    cardClassName: 'min-h-[4rem] min-w-[8.5rem] px-3 py-2.5',
    listClassName: 'flex flex-wrap items-center justify-center gap-4',
  },
  venue: {
    logoClassName: 'max-h-10 w-auto max-w-[10rem] sm:max-h-12 sm:max-w-[11rem]',
    cardClassName: 'min-h-20 min-w-[11rem] px-5 py-4',
    listClassName: 'flex flex-wrap items-center justify-center gap-5',
  },
}

function tierSortIndex(tier: Sponsor['tier']): number {
  const index = TIER_ORDER.indexOf(tier as SponsorTier)
  return index === -1 ? TIER_ORDER.length : index
}

export function sortSponsors(sponsors: Sponsor[]): Sponsor[] {
  return [...sponsors].sort((left, right) => {
    const tierDiff = tierSortIndex(left.tier) - tierSortIndex(right.tier)
    if (tierDiff !== 0) {
      return tierDiff
    }

    const orderDiff = (left.order ?? 0) - (right.order ?? 0)
    if (orderDiff !== 0) {
      return orderDiff
    }

    return left.name.localeCompare(right.name)
  })
}

export function getSponsors(): Sponsor[] {
  const result = sponsorsSchema.safeParse(sponsorsData)
  if (!result.success) {
    throw new Error(`Invalid sponsors.json: ${result.error.message}`)
  }

  return sortSponsors(result.data)
}

export function groupSponsorsByTier(
  sponsors: Sponsor[],
): Map<SponsorTier, Sponsor[]> {
  const groups = new Map<SponsorTier, Sponsor[]>()

  for (const tier of TIER_ORDER) {
    groups.set(tier, [])
  }

  for (const sponsor of sponsors) {
    const tier = sponsor.tier as SponsorTier
    const tierSponsors = groups.get(tier) ?? []
    tierSponsors.push(sponsor)
    groups.set(tier, tierSponsors)
  }

  return groups
}

export function getPopulatedSponsorTiers(
  groups: Map<SponsorTier, Sponsor[]>,
): SponsorTier[] {
  return TIER_ORDER.filter((tier) => (groups.get(tier)?.length ?? 0) > 0)
}
