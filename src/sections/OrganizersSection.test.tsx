import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { OrganizersSection } from '@/sections/OrganizersSection'
import type { Organizer } from '@/schemas/collectionSchemas'

vi.mock('@/lib/organizers', () => ({
  getOrganizers: vi.fn(),
}))

import { getOrganizers } from '@/lib/organizers'

const mockedGetOrganizers = vi.mocked(getOrganizers)

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <OrganizersSection />
    </I18nextProvider>,
  )
}

describe('OrganizersSection', () => {
  it('renders organizer name, role, and company', async () => {
    await i18n.changeLanguage('es')
    const organizers: Organizer[] = [
      {
        slug: 'lead',
        name: 'Ada Organizer',
        role: 'Lead Organizer',
        company: 'Cloud Native Co',
        linkedin: 'https://www.linkedin.com/in/ada-organizer/',
      },
    ]
    mockedGetOrganizers.mockReturnValue(organizers)

    renderSection()

    expect(screen.getByText('Ada Organizer')).toBeInTheDocument()
    expect(screen.getByText('Lead Organizer')).toBeInTheDocument()
    expect(screen.getByText('Cloud Native Co')).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /Ver perfil de LinkedIn de Ada Organizer/i,
      }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/ada-organizer/')
  })

  it('renders organizer without role or company', async () => {
    await i18n.changeLanguage('es')
    const organizers: Organizer[] = [
      {
        slug: 'juan-pablo-martinez',
        name: 'Juan Pablo Martinez',
        photo: '/organizers/juan-pablo-martinez.png',
        linkedin: 'https://www.linkedin.com/in/juan-martinez-6978a7327/',
      },
    ]
    mockedGetOrganizers.mockReturnValue(organizers)

    renderSection()

    expect(screen.getByText('Juan Pablo Martinez')).toBeInTheDocument()
    expect(screen.queryByText('Organizador')).not.toBeInTheDocument()
  })
})
