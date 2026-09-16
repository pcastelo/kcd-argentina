import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { SpeakersSection } from '@/sections/SpeakersSection'
import type { Speaker } from '@/schemas/collectionSchemas'

vi.mock('@/lib/speakers', () => ({
  getSpeakerRoster: vi.fn(),
  formatSpeakerAffiliation: vi.fn(),
}))

import {
  formatSpeakerAffiliation,
  getSpeakerRoster,
} from '@/lib/speakers'

const mockedGetSpeakerRoster = vi.mocked(getSpeakerRoster)
const mockedFormatSpeakerAffiliation = vi.mocked(formatSpeakerAffiliation)

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <SpeakersSection />
    </I18nextProvider>,
  )
}

describe('SpeakersSection', () => {
  it('renders speaker photo, name, and affiliation', async () => {
    await i18n.changeLanguage('es')

    const speakers: Speaker[] = [
      {
        slug: 'abraham-alfaro',
        name: 'Abraham Alfaro',
        title: 'Cloud Engineer',
        company: 'Amazon Web Services',
        photo: 'https://example.com/abraham.jpg',
        social: {
          linkedin: 'https://www.linkedin.com/in/abraham-alfaro/',
        },
      },
    ]

    mockedGetSpeakerRoster.mockReturnValue(speakers)
    mockedFormatSpeakerAffiliation.mockReturnValue(
      'Cloud Engineer at Amazon Web Services',
    )

    renderSection()

    const profileLink = screen.getByRole('link', { name: /Abraham Alfaro/i })

    expect(profileLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/abraham-alfaro/',
    )
    expect(profileLink).toHaveTextContent('Abraham Alfaro')
    expect(
      screen.getByText('Cloud Engineer at Amazon Web Services'),
    ).toBeInTheDocument()
    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      'https://example.com/abraham.jpg',
    )
  })
})
