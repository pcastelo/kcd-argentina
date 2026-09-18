import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { AgendaSection } from '@/sections/AgendaSection'
import type { Session } from '@/schemas/collectionSchemas'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  })
})

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

const talkSession: Session = {
  id: '2026-10-03-1030-sala-1-demo-talk',
  slug: 'demo-talk',
  title: 'Charla demo',
  abstract: 'Abstract de la charla demo.',
  speakerSlugs: ['ada-speaker'],
  speakerNames: ['Ada Speaker'],
  room: 'sala-1',
  startTime: '2026-10-03T10:30:00-03:00',
  endTime: '2026-10-03T11:00:00-03:00',
  durationMinutes: 30,
  type: 'talk',
}

const breakSession: Session = {
  id: '2026-10-03-1100-plenario-break',
  slug: 'coffee-break',
  title: 'Coffee break',
  speakerSlugs: [],
  room: 'plenario',
  startTime: '2026-10-03T11:00:00-03:00',
  endTime: '2026-10-03T11:30:00-03:00',
  durationMinutes: 30,
  type: 'break',
}

const keynoteSession: Session = {
  id: '2026-10-03-1000-plenario-keynote',
  slug: 'keynote-demo',
  title: 'Keynote demo',
  speakerSlugs: [],
  room: 'plenario',
  startTime: '2026-10-03T10:00:00-03:00',
  endTime: '2026-10-03T10:30:00-03:00',
  durationMinutes: 30,
  type: 'keynote',
}

describe('AgendaSection', () => {
  it('renders a Lima-style timeline with room filters', async () => {
    await i18n.changeLanguage('es')

    mockedGetSessions.mockReturnValue([talkSession, keynoteSession])
    mockedGetSpeakers.mockReturnValue([
      {
        slug: 'ada-speaker',
        name: 'Ada Speaker',
        photo: 'https://example.com/ada.jpg',
      },
    ])

    renderSection()

    expect(screen.getByRole('heading', { name: '// Agenda' })).toBeInTheDocument()
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
    expect(screen.getByText('Ada Speaker')).toBeInTheDocument()
    expect(document.querySelector('img[src="https://example.com/ada.jpg"]')).toBeTruthy()

    fireEvent.click(screen.getByRole('tab', { name: /Sala Principal/i }))

    expect(screen.getByText('Ada Speaker')).toBeInTheDocument()
    expect(
      document.querySelector('img[src="https://example.com/ada.jpg"]'),
    ).toBeNull()
  })

  it('opens session detail dialog when a talk card is activated', async () => {
    await i18n.changeLanguage('es')

    mockedGetSessions.mockReturnValue([talkSession, breakSession])
    mockedGetSpeakers.mockReturnValue([
      {
        slug: 'ada-speaker',
        name: 'Ada Speaker',
        photo: 'https://example.com/ada.jpg',
      },
    ])

    renderSection()

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('agenda.sessionAriaLabel', {
          title: 'Charla demo',
          room: i18n.t('agenda.roomsShort.sala-1'),
        }),
      }),
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Charla demo' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Abstract de la charla demo.')).toBeInTheDocument()
  })

  it('does not open dialog when a break card is present', async () => {
    await i18n.changeLanguage('es')

    mockedGetSessions.mockReturnValue([talkSession, breakSession])
    mockedGetSpeakers.mockReturnValue([])

    renderSection()
    fireEvent.click(screen.getByRole('tab', { name: /Todos/i }))

    expect(screen.getByText('Coffee break')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: i18n.t('agenda.sessionAriaLabel', {
          title: 'Coffee break',
          room: i18n.t('agenda.roomsShort.plenario'),
        }),
      }),
    ).toBeNull()
  })

  it('closes session detail dialog on Escape', async () => {
    await i18n.changeLanguage('es')

    mockedGetSessions.mockReturnValue([talkSession])
    mockedGetSpeakers.mockReturnValue([])

    renderSection()

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('agenda.sessionAriaLabel', {
          title: 'Charla demo',
          room: i18n.t('agenda.roomsShort.sala-1'),
        }),
      }),
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Charla demo' }),
    ).toBeInTheDocument()

    const dialog = document.querySelector('dialog')
    expect(dialog).toBeTruthy()
    fireEvent.keyDown(dialog!, { key: 'Escape' })
    // Native cancel -> our onCancel handler; also fire close for safety
    fireEvent(
      dialog!,
      new Event('cancel', { bubbles: true, cancelable: true }),
    )

    expect(
      screen.queryByRole('heading', { level: 2, name: 'Charla demo' }),
    ).not.toBeInTheDocument()
  })
})
