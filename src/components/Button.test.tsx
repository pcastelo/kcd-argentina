import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('renders primary variant as a button with primary classes', () => {
    render(<Button variant="primary">Buy tickets</Button>)
    const button = screen.getByRole('button', { name: 'Buy tickets' })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain('bg-primary')
    expect(button.className).toContain('text-white')
  })

  it('renders ghost variant with ghost classes', () => {
    render(<Button variant="ghost">Learn more</Button>)
    const button = screen.getByRole('button', { name: 'Learn more' })
    expect(button.className).toContain('bg-transparent')
    expect(button.className).toContain('border-border')
    expect(button.className).toContain('text-text')
  })

  it('renders as an external anchor when href is provided', () => {
    render(
      <Button href="https://example.com" variant="primary">
        External
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'External' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders as a same-tab anchor when openInNewTab is false', () => {
    render(
      <Button href="/agenda" openInNewTab={false} variant="primary">
        Agenda
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Agenda' })
    expect(link).toHaveAttribute('href', '/agenda')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })
})
