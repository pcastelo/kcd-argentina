import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/Header'

describe('Header', () => {
  it('renders locale-aware links and language switcher on /es', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/:locale',
          element: <Header />,
        },
      ],
      { initialEntries: ['/es'] },
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByAltText(/KCD Argentina/i)).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'href',
      '/es',
    )
    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute(
      'href',
      '/es/agenda',
    )
    expect(screen.getByRole('link', { name: 'Oradores' })).toHaveAttribute(
      'href',
      '/es/speakers',
    )
    expect(screen.getByRole('link', { name: 'Patrocinadores' })).toHaveAttribute(
      'href',
      '/es/sponsors',
    )
    expect(screen.getByRole('link', { name: /Ubicaci/i })).toHaveAttribute(
      'href',
      '/es/location',
    )
    expect(
      screen.getByRole('button', { name: 'Cambiar idioma' }),
    ).toBeInTheDocument()
  })
})
