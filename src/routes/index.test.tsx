import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, Navigate, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LocaleLayout } from '@/layouts/LocaleLayout'
import { RootLayout } from '@/layouts/RootLayout'
import i18n from '@/lib/i18n'
import { HomePage } from '@/pages/HomePage'
import { HashRedirectPage } from '@/pages/HashRedirectPage'
import { LocationPage } from '@/pages/LocationPage'

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
              children: [
                { index: true, element: <HomePage /> },
                { path: 'location', element: <LocationPage /> },
              ],
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
              children: [
                { index: true, element: <HomePage /> },
                { path: 'location', element: <LocationPage /> },
              ],
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
              children: [
                { index: true, element: <HomePage /> },
                { path: 'location', element: <LocationPage /> },
              ],
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

  it('redirects /es/location to /es#local', async () => {
    await i18n.changeLanguage('es')

    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          children: [
            {
              path: ':locale',
              element: <LocaleLayout />,
              children: [
                { index: true, element: <HomePage /> },
                { path: 'location', element: <LocationPage /> },
                { path: 'organizers', element: <HashRedirectPage hash="organizers" /> },
                {
                  path: 'code-of-conduct',
                  element: <HashRedirectPage hash="conduct" />,
                },
              ],
            },
          ],
        },
      ],
      { initialEntries: ['/es/location'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/es')
      expect(router.state.location.hash).toBe('#local')
      expect(
        screen.getByRole('heading', { name: 'Plaza Galicia', level: 2 }),
      ).toBeInTheDocument()
    })
  })

  it('redirects /es/organizers to /es#organizers', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          children: [
            {
              path: ':locale',
              element: <LocaleLayout />,
              children: [
                { index: true, element: <HomePage /> },
                { path: 'organizers', element: <HashRedirectPage hash="organizers" /> },
              ],
            },
          ],
        },
      ],
      { initialEntries: ['/es/organizers'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/es')
      expect(router.state.location.hash).toBe('#organizers')
    })
  })

  it('redirects /es/code-of-conduct to /es#conduct', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          children: [
            {
              path: ':locale',
              element: <LocaleLayout />,
              children: [
                { index: true, element: <HomePage /> },
                {
                  path: 'code-of-conduct',
                  element: <HashRedirectPage hash="conduct" />,
                },
              ],
            },
          ],
        },
      ],
      { initialEntries: ['/es/code-of-conduct'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/es')
      expect(router.state.location.hash).toBe('#conduct')
    })
  })
})
