import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { NotFoundPage } from '@/pages/NotFoundPage'

describe('NotFoundPage', () => {
  it('renders branded 404 with link home for the locale', async () => {
    await i18n.changeLanguage('es')

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/es/agenda']}>
          <Routes>
            <Route path="/:locale/*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    )

    expect(
      screen.getByRole('heading', { name: i18n.t('common.notFoundTitle') }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: i18n.t('common.notFoundHome') }),
    ).toHaveAttribute('href', '/es')
    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute(
      'href',
      '/es#agenda',
    )
  })
})
