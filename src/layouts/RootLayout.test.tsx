import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LocaleLayout } from '@/layouts/LocaleLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/HomePage'

describe('RootLayout', () => {
  it('renders header, main, and footer landmarks on /es', () => {
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

    render(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>,
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders skip-to-content link targeting main', () => {
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

    render(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>,
    )

    const skip = screen.getByRole('link', { name: /Saltar al contenido/i })
    expect(skip).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })
})
