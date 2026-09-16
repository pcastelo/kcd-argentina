import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { SponsorsSection } from '@/sections/SponsorsSection'
import type { Sponsor } from '@/schemas/collectionSchemas'

vi.mock('@/lib/sponsors', () => ({
  getSponsors: vi.fn(),
  TIER_ORDER: ['diamond', 'platinum', 'gold', 'light', 'community', 'venue'],
}))

import { getSponsors } from '@/lib/sponsors'

const mockedGetSponsors = vi.mocked(getSponsors)

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <SponsorsSection />
    </I18nextProvider>,
  )
}

describe('SponsorsSection', () => {
  it('renders tier groups and CTA when empty', async () => {
    await i18n.changeLanguage('es')
    mockedGetSponsors.mockReturnValue([])

    renderSection()

    expect(
      screen.getByRole('heading', { name: i18n.t('sponsors.title'), level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(i18n.t('sponsors.emptyTier')).length).toBeGreaterThan(0)
    expect(
      screen.getByRole('link', { name: i18n.t('sponsors.becomeSponsor') }),
    ).toHaveAttribute(
      'href',
      'https://drive.google.com/file/d/1BnQVM6NC_qYVlDo5VuSaYHEL7T0y9AOb/view',
    )
  })

  it('renders sponsor logos in tier groups', async () => {
    await i18n.changeLanguage('en')
    const sponsors: Sponsor[] = [
      {
        slug: 'venue-partner',
        name: 'Banco Galicia',
        tier: 'venue',
        logo: '/sponsors/banco-galicia.png',
      },
    ]
    mockedGetSponsors.mockReturnValue(sponsors)

    renderSection()

    expect(screen.getByRole('img', { name: 'Banco Galicia' })).toHaveAttribute(
      'src',
      '/sponsors/banco-galicia.png',
    )
  })
})
