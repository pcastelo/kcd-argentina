import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/Header'

function renderHeader(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:locale',
        element: <Header />,
      },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('Header', () => {
  it('renders locale-aware hash links and language switcher on /es', () => {
    renderHeader('/es')

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByAltText(/KCD Argentina/i)).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'href',
      '/es',
    )
    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute(
      'href',
      '/es#agenda',
    )
    expect(screen.getByRole('link', { name: 'Speakers' })).toHaveAttribute(
      'href',
      '/es#speakers',
    )
    expect(screen.getByRole('link', { name: 'Patrocinadores' })).toHaveAttribute(
      'href',
      '/es#sponsors',
    )
    expect(screen.getByRole('link', { name: /Ubicaci/i })).toHaveAttribute(
      'href',
      '/es#local',
    )
    expect(
      screen.getByRole('button', { name: 'Cambiar idioma' }),
    ).toBeInTheDocument()
  })

  it('marks Home as current page when hash is empty', () => {
    renderHeader('/es')

    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Agenda' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('marks Agenda as current page for /es#agenda', () => {
    renderHeader('/es#agenda')

    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
