import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/Header'

describe('Header', () => {
  it('renders header landmark, logo, and navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByAltText(/KCD Argentina/i)).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Agenda' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Oradores' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Patrocinadores' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ubicaci/i })).toBeInTheDocument()
  })
})
