import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeader } from '@/components/SectionHeader'

describe('SectionHeader', () => {
  it('renders eyebrow as heading when title is omitted', () => {
    render(
      <SectionHeader
        eyebrow="// Speakers"
        subtitle="Meet the lineup"
        note="Draft agenda"
        badge="25 speakers"
      />,
    )

    expect(
      screen.getByRole('heading', { name: '// Speakers', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Meet the lineup')).toBeInTheDocument()
    expect(screen.getByText('Draft agenda')).toBeInTheDocument()
    expect(screen.getByText('25 speakers')).toBeInTheDocument()
  })

  it('renders eyebrow and title when both are provided', () => {
    render(
      <SectionHeader
        eyebrow="// Community"
        title="Code of Conduct"
        subtitle="Be excellent to each other"
      />,
    )

    expect(screen.getByText('// Community')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Code of Conduct', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Be excellent to each other')).toBeInTheDocument()
  })
})
