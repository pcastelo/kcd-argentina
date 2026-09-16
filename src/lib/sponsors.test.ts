import { describe, expect, it } from 'vitest'
import { sortSponsors } from '@/lib/sponsors'
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
        slug: 'platinum-a',
        name: 'Alpha Platinum',
        tier: 'platinum',
        logo: '/sponsors/platinum-a.png',
      },
    ]

    expect(sortSponsors(sponsors).map((sponsor) => sponsor.slug)).toEqual([
      'platinum-a',
      'gold-a',
      'silver-b',
    ])
  })
})
