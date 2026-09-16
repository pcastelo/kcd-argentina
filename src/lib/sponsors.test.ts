import { describe, expect, it } from 'vitest'
import {
  getPopulatedSponsorTiers,
  groupSponsorsByTier,
  sortSponsors,
} from '@/lib/sponsors'
import type { Sponsor } from '@/schemas/collectionSchemas'

describe('sortSponsors', () => {
  it('sorts by tier, order, then name', () => {
    const sponsors: Sponsor[] = [
      {
        slug: 'silver-b',
        name: 'Beta',
        tier: 'silver',
        logo: '/sponsors/silver-b.png',
        order: 2,
      },
      {
        slug: 'gold-a',
        name: 'Alpha Gold',
        tier: 'gold',
        logo: '/sponsors/gold-a.png',
        order: 1,
      },
      {
        slug: 'diamond-a',
        name: 'Alpha Diamond',
        tier: 'diamond',
        logo: '/sponsors/diamond-a.png',
      },
      {
        slug: 'platinum-a',
        name: 'Alpha Platinum',
        tier: 'platinum',
        logo: '/sponsors/platinum-a.png',
      },
    ]

    expect(sortSponsors(sponsors).map((sponsor) => sponsor.slug)).toEqual([
      'diamond-a',
      'platinum-a',
      'gold-a',
      'silver-b',
    ])
  })

  it('groups sponsors by tier and returns only populated tiers', () => {
    const sponsors: Sponsor[] = [
      {
        slug: 'gold-a',
        name: 'Gold',
        tier: 'gold',
        logo: '/sponsors/gold-a.png',
      },
      {
        slug: 'diamond-a',
        name: 'Diamond',
        tier: 'diamond',
        logo: '/sponsors/diamond-a.png',
      },
    ]

    const groups = groupSponsorsByTier(sponsors)

    expect(groups.get('diamond')).toHaveLength(1)
    expect(groups.get('platinum')).toHaveLength(0)
    expect(getPopulatedSponsorTiers(groups)).toEqual(['diamond', 'gold'])
  })
})
