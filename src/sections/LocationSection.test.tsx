import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { LocationSection } from '@/sections/LocationSection'

function renderLocationSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <LocationSection />
    </I18nextProvider>,
  )
}

describe('LocationSection', () => {
  it('renders venue photo, details, map, and transport in Spanish', async () => {
    await i18n.changeLanguage('es')

    renderLocationSection()

    expect(
      screen.getByRole('heading', { name: 'Plaza Galicia', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText(i18n.t('location.eyebrow'))).toBeInTheDocument()
    expect(
      screen.getByRole('img', {
        name: i18n.t('location.venueImageAlt', { venue: 'Plaza Galicia' }),
      }),
    ).toHaveAttribute('src', '/images/venue-plaza-galicia.jpg')
    expect(screen.getByText(/Leiva 4070/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: i18n.t('location.howToGetThere') }),
    ).toBeInTheDocument()
    expect(
      screen.getByTitle(i18n.t('location.mapTitle')),
    ).toHaveAttribute('src', expect.stringContaining('maps.google.com'))
    expect(
      screen.getByRole('link', {
        name: i18n.t('location.openInMapsAriaLabel'),
      }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/place/Plaza+Galicia/@-34.5902575,-58.4482252,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb513b5c3e79f:0xdfdbacf6d4e5908b!8m2!3d-34.5902575!4d-58.4482252!16s%2Fg%2F11q419kzdb',
    )
  })

  it('renders English copy', async () => {
    await i18n.changeLanguage('en')

    renderLocationSection()

    expect(
      screen.getByRole('heading', { name: 'Plaza Galicia', level: 2 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: i18n.t('location.howToGetThere'),
        level: 3,
      }),
    ).toBeInTheDocument()
  })
})
