import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { HomePage } from '@/pages/HomePage'

function renderHome(initialEntry = '/es') {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/:locale" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('HomePage', () => {
  it('renders hero, countdown, CTA, and sponsor empty state in Spanish', async () => {
    await i18n.changeLanguage('es')

    renderHome('/es')

    expect(
      screen.getByRole('heading', { name: 'KCD Argentina 2026', hidden: true }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(i18n.t('home.heroSubtitle')),
    ).toBeInTheDocument()
    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: i18n.t('home.ctaTicketsAriaLabel'),
      }),
    ).toHaveAttribute(
      'href',
      'https://www.eventbrite.com/e/kcd-argentina-2026-tickets-1999811690600',
    )
    const eventMeta = screen.getByLabelText('Detalles del evento')
    expect(eventMeta).toHaveTextContent('Plaza Galicia')
    expect(eventMeta).toHaveTextContent(/3 de octubre de 2026/i)
    expect(
      screen.getByRole('heading', { name: 'Plaza Galicia', level: 2 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('sponsors.becomeSponsor') }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.homeTitle', { lng: 'es' }))
    })
  })

  it('renders English copy at /en locale', async () => {
    await i18n.changeLanguage('en')

    renderHome('/en')

    expect(
      screen.getByText(i18n.t('home.heroSubtitle')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: i18n.t('home.ctaTicketsAriaLabel'),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('sponsors.becomeSponsor') }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.homeTitle', { lng: 'en' }))
    })
  })

  it('uses location SEO when the URL hash is #local', async () => {
    await i18n.changeLanguage('es')

    renderHome('/es#local')

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.locationTitle', { lng: 'es' }))
    })
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://kcdargentina.ar/es/location')
  })

  it('uses URL locale for SEO even when i18n language is still Spanish', async () => {
    await i18n.changeLanguage('es')

    renderHome('/en')

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.homeTitle', { lng: 'en' }))
    })
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://kcdargentina.ar/en')
    expect(document.documentElement.lang).toBe('en')
  })
})
