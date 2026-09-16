import { render, screen, waitFor } from '@testing-library/react'
import { useLocation } from 'react-router-dom'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useLocale } from '@/hooks/useLocale'
import i18n from '@/lib/i18n'

function LocaleProbe() {
  const locale = useLocale()
  const location = useLocation()

  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="pathname">{location.pathname}</span>
    </div>
  )
}

describe('useLocale', () => {
  beforeEach(() => {
    document.documentElement.lang = 'es'
    void i18n.changeLanguage('es')
  })

  it('syncs Spanish locale with i18n and document lang', async () => {
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage')

    const router = createMemoryRouter(
      [
        {
          path: '/:locale',
          element: <LocaleProbe />,
        },
      ],
      { initialEntries: ['/es'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('es')
      expect(document.documentElement.lang).toBe('es')
      expect(changeLanguageSpy).toHaveBeenCalledWith('es')
    })
  })

  it('syncs English locale with i18n and document lang', async () => {
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage')

    const router = createMemoryRouter(
      [
        {
          path: '/:locale',
          element: <LocaleProbe />,
        },
      ],
      { initialEntries: ['/en'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en')
      expect(document.documentElement.lang).toBe('en')
      expect(changeLanguageSpy).toHaveBeenCalledWith('en')
    })
  })

  it('redirects unsupported locales to the Spanish equivalent path', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/:locale/*',
          element: <LocaleProbe />,
        },
        {
          path: '/:locale',
          element: <LocaleProbe />,
        },
      ],
      { initialEntries: ['/fr/agenda'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/es/agenda')
    })
  })
})
