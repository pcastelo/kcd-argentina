import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeader } from '@/components/SectionHeader'

describe('SectionHeader', () => {
  it('renders eyebrow, title, subtitle, note, and badge', () => {
    render(
      <SectionHeader
        eyebrow="Community"
        title="Speakers"
        subtitle="Meet the lineup"
        note="Draft agenda"
        badge="25 speakers"
      />,
    )

    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Speakers', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Meet the lineup')).toBeInTheDocument()
    expect(screen.getByText('Draft agenda')).toBeInTheDocument()
    expect(screen.getByText('25 speakers')).toBeInTheDocument()
  })
})
