import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from '@/components/Footer'

describe('Footer', () => {
  it('renders footer landmark with event contact and attribution', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByText('Growing Cloud Native Together'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'kcd.argentina@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:kcd.argentina@gmail.com')
    expect(screen.getByRole('link', { name: 'Linktree' })).toHaveAttribute(
      'href',
      'https://linktr.ee/kcd.argentina',
    )
    expect(screen.getByRole('link', { name: 'CNCF Supported Event' })).toHaveAttribute(
      'href',
      'https://www.cncf.io/',
    )
    expect(screen.getByText(/2026/)).toBeInTheDocument()
    expect(screen.getByText(/KCD Argentina/)).toBeInTheDocument()
  })
})
