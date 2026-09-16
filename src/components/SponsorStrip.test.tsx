import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { SponsorStrip } from '@/components/SponsorStrip'
import i18n from '@/lib/i18n'
import type { Sponsor } from '@/schemas/collectionSchemas'

vi.mock('@/lib/sponsors', () => ({
  getSponsors: vi.fn(),
}))

import { getSponsors } from '@/lib/sponsors'

const mockedGetSponsors = vi.mocked(getSponsors)

function renderStrip() {
  return render(
    <I18nextProvider i18n={i18n}>
      <SponsorStrip linktreeUrl="https://linktr.ee/kcd.argentina" />
    </I18nextProvider>,
  )
}

describe('SponsorStrip', () => {
  it('renders empty-state CTA when there are no sponsors', async () => {
    await i18n.changeLanguage('es')
    mockedGetSponsors.mockReturnValue([])

    renderStrip()

    expect(
      screen.getByText(i18n.t('home.sponsors.emptyState')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('home.sponsors.becomeSponsor') }),
    ).toHaveAttribute('href', 'https://linktr.ee/kcd.argentina')
  })

  it('renders sponsor logos when data exists', async () => {
    await i18n.changeLanguage('en')
    const sponsors: Sponsor[] = [
      {
        slug: 'crubyt',
        name: 'Crubyt',
        tier: 'platinum',
        logo: '/sponsors/crubyt.png',
        url: 'https://crubyt.com',
      },
    ]
    mockedGetSponsors.mockReturnValue(sponsors)

    renderStrip()

    const logo = screen.getByRole('img', { name: 'Crubyt' })
    expect(logo).toHaveAttribute('src', '/sponsors/crubyt.png')
    expect(screen.getByRole('link', { name: 'Crubyt' })).toHaveAttribute(
      'href',
      'https://crubyt.com',
    )
  })
})
