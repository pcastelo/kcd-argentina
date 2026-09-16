import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, Navigate, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LocaleLayout } from '@/layouts/LocaleLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/HomePage'

describe('locale routes', () => {
  it('redirects root to /es', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Navigate to="/es" replace />,
        },
        {
          element: <RootLayout />,
          children: [
            {
              path: ':locale',
              element: <LocaleLayout />,
              children: [{ index: true, element: <HomePage /> }],
            },
          ],
        },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/es')
      expect(
        screen.getByRole('heading', { name: 'KCD Argentina 2026' }),
      ).toBeInTheDocument()
    })
  })

  it('renders Spanish home at /es', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          children: [
            {
              path: ':locale',
              element: <LocaleLayout />,
              children: [{ index: true, element: <HomePage /> }],
            },
          ],
        },
      ],
      { initialEntries: ['/es'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(
        screen.getByRole('link', {
          name: /Comprar entradas en Eventbrite/i,
        }),
      ).toBeInTheDocument()
    })
  })

  it('renders English home at /en', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          children: [
            {
              path: ':locale',
              element: <LocaleLayout />,
              children: [{ index: true, element: <HomePage /> }],
            },
          ],
        },
      ],
      { initialEntries: ['/en'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(
        screen.getByRole('link', {
          name: 'Buy tickets on Eventbrite (opens in new tab)',
        }),
      ).toBeInTheDocument()
    })
  })
})
