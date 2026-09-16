import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { SponsorsSection } from '@/sections/SponsorsSection'
import type { Sponsor } from '@/schemas/collectionSchemas'

vi.mock('@/lib/sponsors', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sponsors')>()
  return {
    ...actual,
    getSponsors: vi.fn(),
  }
})

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
  it('renders empty state and CTA when there are no sponsors', async () => {
    await i18n.changeLanguage('es')
    mockedGetSponsors.mockReturnValue([])

    renderSection()

    expect(
      screen.getByRole('heading', { name: i18n.t('sponsors.title'), level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText(i18n.t('home.sponsors.emptyState'))).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('sponsors.becomeSponsor') }),
    ).toHaveAttribute(
      'href',
      'https://drive.google.com/file/d/1BnQVM6NC_qYVlDo5VuSaYHEL7T0y9AOb/view',
    )
    expect(screen.queryByText(i18n.t('sponsors.emptyTier'))).not.toBeInTheDocument()
  })

  it('renders populated tier groups with sized logo cards', async () => {
    await i18n.changeLanguage('en')
    const sponsors: Sponsor[] = [
      {
        slug: 'crubyt',
        name: 'Crubyt',
        tier: 'diamond',
        logo: '/sponsors/crubyt.webp',
        url: 'https://crubyt.com/',
      },
      {
        slug: 'venue-partner',
        name: 'Banco Galicia',
        tier: 'venue',
        logo: '/sponsors/banco-galicia.png',
      },
    ]
    mockedGetSponsors.mockReturnValue(sponsors)

    renderSection()

    expect(screen.getByText('2 sponsors')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Diamond', level: 3 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Venue', level: 3 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Crubyt/i }),
    ).toHaveAttribute('href', 'https://crubyt.com/')
    expect(screen.getByRole('img', { name: 'Banco Galicia' })).toHaveAttribute(
      'src',
      '/sponsors/banco-galicia.png',
    )
    expect(screen.getByText(i18n.t('sponsors.stillOpen'))).toBeInTheDocument()
    expect(screen.queryByText(i18n.t('sponsors.emptyTier'))).not.toBeInTheDocument()
  })
})
