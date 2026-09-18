import type { ReactElement } from 'react'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it } from 'vitest'
import { SEOHead } from '@/components/SEOHead'
import i18n from '@/lib/i18n'

function renderSEO(ui: ReactElement) {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </HelmetProvider>,
  )
}

describe('SEOHead', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es')
    document.title = ''
    document.documentElement.lang = 'es'
  })

  it('sets title, description, canonical, OG, Twitter, and html lang for Spanish home', async () => {
    renderSEO(
      <SEOHead
        titleKey="seo.homeTitle"
        descriptionKey="seo.homeDescription"
        path="/es"
        locale="es"
      />,
    )

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.homeTitle'))
    })

    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe(i18n.t('seo.homeDescription'))
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://kcdargentina.ar/es')
    expect(
      document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    ).toBe('https://kcdargentina.ar/og-image.jpg')
    expect(
      document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
    ).toBe('website')
    expect(
      document.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
    ).toBe('es_AR')
    expect(
      document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    ).toBe('summary_large_image')
    expect(document.documentElement.lang).toBe('es')
  })

  it('sets English location metadata', async () => {
    await i18n.changeLanguage('en')

    renderSEO(
      <SEOHead
        titleKey="seo.locationTitle"
        descriptionKey="seo.locationDescription"
        path="/en/location"
        locale="en"
      />,
    )

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.locationTitle', { lng: 'en' }))
    })

    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe(i18n.t('seo.locationDescription', { lng: 'en' }))
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://kcdargentina.ar/en/location')
    expect(
      document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
    ).toBe('https://kcdargentina.ar/og-image.jpg')
    expect(document.documentElement.lang).toBe('en')
  })

  it('honors locale prop even when active i18n language differs', async () => {
    await i18n.changeLanguage('es')

    renderSEO(
      <SEOHead
        titleKey="seo.homeTitle"
        descriptionKey="seo.homeDescription"
        path="/en"
        locale="en"
      />,
    )

    await waitFor(() => {
      expect(document.title).toBe(i18n.t('seo.homeTitle', { lng: 'en' }))
    })
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://kcdargentina.ar/en')
    expect(document.documentElement.lang).toBe('en')
  })
})
