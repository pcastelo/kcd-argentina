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
  'community',
  'venue',
] as const

function tierSortIndex(tier: Sponsor['tier']): number {
  const index = TIER_ORDER.indexOf(tier as (typeof TIER_ORDER)[number])
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
