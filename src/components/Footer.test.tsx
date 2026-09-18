import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Event } from '@/schemas/eventSchema'

vi.mock('@/lib/event', () => ({
  getEvent: vi.fn(),
}))

import { getEvent } from '@/lib/event'
import { Footer } from '@/components/Footer'

const baseEvent: Event = {
  title: 'KCD Argentina 2026',
  dateStart: '2026-10-03T09:00:00-03:00',
  dateEnd: '2026-10-03T19:00:00-03:00',
  city: 'Buenos Aires',
  venue: { name: 'Plaza Galicia', address: 'Leiva 4070' },
  status: 'announced',
  registrationUrl: 'https://eventbrite.com/e/test',
  linktreeUrl: 'https://linktr.ee/kcd.argentina',
  sponsorProspectusUrl: 'https://drive.google.com/file/d/test/view',
  contactEmail: 'kcd.argentina@gmail.com',
  timezone: 'America/Argentina/Buenos_Aires',
}

const eventWithSocial: Event = {
  ...baseEvent,
  socialLinks: [
    { platform: 'instagram', url: 'https://www.instagram.com/kcd.argentina/' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/cncf-buenos-aires/' },
    { platform: 'meetup', url: 'https://www.meetup.com/kubernetes-community-argentina/' },
  ],
}

function renderFooter(locale = 'es') {
  const router = createMemoryRouter(
    [{ path: '/:locale', element: <Footer /> }],
    { initialEntries: [`/${locale}`] },
  )
  return render(<RouterProvider router={router} />)
}

describe('Footer', () => {
  beforeEach(() => {
    vi.mocked(getEvent).mockReturnValue(eventWithSocial)
  })

  it('renders footer landmark with event contact and section links', () => {
    renderFooter()

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByText('Growing Cloud Native Together'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'kcd.argentina@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:kcd.argentina@gmail.com')
    expect(screen.getByRole('link', { name: 'Organizadores' })).toHaveAttribute(
      'href',
      '/es#organizers',
    )
    expect(
      screen.getByRole('link', { name: 'Código de Conducta' }),
    ).toHaveAttribute('href', '/es#conduct')
    expect(screen.getByRole('link', { name: 'CNCF Supported Event' })).toHaveAttribute(
      'href',
      'https://www.cncf.io/',
    )
    expect(screen.getByText(/2026/)).toBeInTheDocument()
    expect(screen.getByText(/KCD Argentina/)).toBeInTheDocument()
  })

  it('renders social follow links with correct hrefs and aria-labels', () => {
    renderFooter()

    expect(screen.getByText(/Seguinos/)).toBeInTheDocument()

    const instagramLink = screen.getByRole('link', {
      name: /Instagram/i,
    })
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/kcd.argentina/',
    )
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute(
      'rel',
      expect.stringContaining('noopener'),
    )

    const linkedinLink = screen.getByRole('link', {
      name: /Linkedin/i,
    })
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/cncf-buenos-aires/',
    )
    expect(linkedinLink).toHaveAttribute('target', '_blank')

    const meetupLink = screen.getByRole('link', {
      name: /Meetup/i,
    })
    expect(meetupLink).toHaveAttribute(
      'href',
      'https://www.meetup.com/kubernetes-community-argentina/',
    )
    expect(meetupLink).toHaveAttribute('target', '_blank')

    const linktreeLink = screen.getByRole('link', { name: 'Linktree' })
    expect(linktreeLink).toHaveAttribute(
      'href',
      'https://linktr.ee/kcd.argentina',
    )
    expect(linktreeLink).toHaveAttribute('target', '_blank')
  })

  it('does not render social follow row when socialLinks is absent', () => {
    vi.mocked(getEvent).mockReturnValue(baseEvent)

    renderFooter()

    expect(screen.queryByText(/Seguinos/)).not.toBeInTheDocument()
  })
})
