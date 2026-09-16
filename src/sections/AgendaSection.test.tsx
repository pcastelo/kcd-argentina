import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { AgendaSection } from '@/sections/AgendaSection'
import type { Session } from '@/schemas/collectionSchemas'

vi.mock('@/lib/agenda', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/agenda')>()
  return {
    ...actual,
    getSessions: vi.fn(),
    getSpeakers: vi.fn(),
  }
})

import { getSessions, getSpeakers } from '@/lib/agenda'

const mockedGetSessions = vi.mocked(getSessions)
const mockedGetSpeakers = vi.mocked(getSpeakers)

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <AgendaSection />
    </I18nextProvider>,
  )
}

describe('AgendaSection', () => {
  it('renders a Lima-style timeline with room filters', async () => {
    await i18n.changeLanguage('es')

    const sessions: Session[] = [
      {
        id: '2026-10-03-1030-sala-1-demo-talk',
        slug: 'demo-talk',
        title: 'Charla demo',
        speakerSlugs: ['ada-speaker'],
        speakerNames: ['Ada Speaker'],
        room: 'sala-1',
        startTime: '2026-10-03T10:30:00-03:00',
        endTime: '2026-10-03T11:00:00-03:00',
        durationMinutes: 30,
        type: 'talk',
      },
      {
        id: '2026-10-03-1000-plenario-keynote',
        slug: 'keynote-demo',
        title: 'Keynote demo',
        speakerSlugs: [],
        room: 'plenario',
        startTime: '2026-10-03T10:00:00-03:00',
        endTime: '2026-10-03T10:30:00-03:00',
        durationMinutes: 30,
        type: 'keynote',
      },
    ]

    mockedGetSessions.mockReturnValue(sessions)
    mockedGetSpeakers.mockReturnValue([{ slug: 'ada-speaker', name: 'Ada Speaker' }])

    renderSection()

    expect(screen.getByRole('heading', { name: 'Agenda' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Sala Principal/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('Charla demo')).toBeInTheDocument()
    expect(screen.getByText('Ada Speaker')).toBeInTheDocument()
    expect(screen.queryByText('Keynote demo')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: /Todos/i }))

    expect(screen.getByText('Charla demo')).toBeInTheDocument()
    expect(screen.getByText('Keynote demo')).toBeInTheDocument()
  })
})
