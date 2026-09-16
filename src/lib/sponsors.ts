import sponsorsData from '@/data/sponsors.json'
import {
  type Sponsor,
  sponsorsSchema,
} from '@/schemas/collectionSchemas'

export const TIER_ORDER = [
  'platinum',
  'gold',
  'silver',
  'community',
  'venue',
] as const

export function sortSponsors(sponsors: Sponsor[]): Sponsor[] {
  return [...sponsors].sort((left, right) => {
    const tierDiff =
      TIER_ORDER.indexOf(left.tier) - TIER_ORDER.indexOf(right.tier)
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
