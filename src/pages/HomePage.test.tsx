import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { HomePage } from '@/pages/HomePage'

describe('HomePage', () => {
  it('renders hero, countdown, CTA, and sponsor empty state in Spanish', async () => {
    await i18n.changeLanguage('es')

    render(
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>,
    )

    expect(
      screen.getByRole('heading', { name: 'KCD Argentina 2026' }),
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
    expect(screen.getByText(/Plaza Galicia/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('home.sponsors.becomeSponsor') }),
    ).toBeInTheDocument()
  })

  it('renders English copy at /en locale', async () => {
    await i18n.changeLanguage('en')

    render(
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>,
    )

    expect(
      screen.getByText(i18n.t('home.heroSubtitle')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: i18n.t('home.ctaTicketsAriaLabel'),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('home.sponsors.becomeSponsor') }),
    ).toBeInTheDocument()
  })
})
