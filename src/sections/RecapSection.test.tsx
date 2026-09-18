import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { RecapSection } from '@/sections/RecapSection'

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <RecapSection />
    </I18nextProvider>,
  )
}

describe('RecapSection', () => {
  it('renders section id, localized header, four images and captions in Spanish', async () => {
    await i18n.changeLanguage('es')
    renderSection()

    expect(document.getElementById('recap')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: i18n.t('recap.title') }),
    ).toBeInTheDocument()
    expect(screen.getByText(i18n.t('recap.eyebrow'))).toBeInTheDocument()

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4)
    expect(images[0]).toHaveAttribute('alt', i18n.t('recap.altGroup'))
    expect(images[0]).toHaveAttribute('loading', 'lazy')
    expect(images[0]).toHaveAttribute('src', '/images/recap/01-group.webp')
    expect(images[1]).toHaveAttribute('alt', i18n.t('recap.altAudience'))
    expect(images[2]).toHaveAttribute('alt', i18n.t('recap.altSpeaker'))
    expect(images[3]).toHaveAttribute('alt', i18n.t('recap.altMate'))

    expect(screen.getByText(i18n.t('recap.caption01'))).toBeInTheDocument()
    expect(screen.getByText(i18n.t('recap.caption02'))).toBeInTheDocument()
    expect(screen.getByText(i18n.t('recap.caption03'))).toBeInTheDocument()
    expect(screen.getByText(i18n.t('recap.caption04'))).toBeInTheDocument()
  })

  it('renders English captions and alts', async () => {
    await i18n.changeLanguage('en')
    renderSection()

    expect(
      screen.getByRole('heading', { name: i18n.t('recap.title') }),
    ).toBeInTheDocument()
    expect(screen.getByText(i18n.t('recap.caption01'))).toBeInTheDocument()
    expect(screen.getByAltText(i18n.t('recap.altGroup'))).toBeInTheDocument()
  })
})
