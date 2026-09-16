import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

function renderSwitcher(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:locale',
        element: <LanguageSwitcher />,
      },
      {
        path: '/:locale/agenda',
        element: <LanguageSwitcher />,
      },
    ],
    { initialEntries: [initialEntry] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('LanguageSwitcher', () => {
  it('navigates from /es to /en', async () => {
    const router = renderSwitcher('/es')

    const switcher = screen.getByRole('button', { name: 'Cambiar idioma' })
    expect(switcher).toBeInTheDocument()

    fireEvent.click(switcher)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en')
    })
  })

  it('preserves path segments when switching locale', async () => {
    const router = renderSwitcher('/es/agenda')

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar idioma' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en/agenda')
    })
  })
})
