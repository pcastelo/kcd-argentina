import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { HomePage } from '@/pages/HomePage'

describe('HomePage', () => {
  it('renders event title and placeholder copy', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>,
    )
    expect(
      screen.getByRole('heading', { name: 'KCD Argentina 2026' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Sitio en construcción/i),
    ).toBeInTheDocument()
  })
})
