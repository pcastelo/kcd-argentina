import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { SessionDetailDialog } from '@/components/SessionDetailDialog'
import type { AgendaDisplaySession } from '@/lib/agenda'
import type { Speaker } from '@/schemas/collectionSchemas'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  })
})

const session: AgendaDisplaySession = {
  id: 'talk-1',
  slug: 'demo-talk',
  title: 'Charla demo',
  abstract: 'Resumen de la charla demo.',
  speakerSlugs: ['ada-speaker'],
  room: 'sala-1',
  startTime: '2026-10-03T10:30:00-03:00',
  endTime: '2026-10-03T11:00:00-03:00',
  durationMinutes: 30,
  type: 'talk',
}

const speakers: Speaker[] = [
  {
    slug: 'ada-speaker',
    name: 'Ada Speaker',
    title: 'Platform Engineer',
    company: 'Example Co',
    photo: 'https://example.com/ada.jpg',
    social: { linkedin: 'https://www.linkedin.com/in/ada-speaker/' },
  },
]

function renderDialog(
  props: Partial<ComponentProps<typeof SessionDetailDialog>> = {},
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <SessionDetailDialog
        open
        session={session}
        speakers={speakers}
        roomLabel="Sala Principal"
        typeLabel="Charla"
        timezone="America/Argentina/Buenos_Aires"
        locale="es-AR"
        onClose={vi.fn()}
        {...props}
      />
    </I18nextProvider>,
  )
}

describe('SessionDetailDialog', () => {
  it('renders session title, time, room, type, abstract, and speakers', async () => {
    await i18n.changeLanguage('es')
    renderDialog()

    expect(screen.getByRole('heading', { name: 'Charla demo' })).toBeInTheDocument()
    expect(screen.getByText('Charla')).toBeInTheDocument()
    expect(screen.getByText(/Sala Principal/)).toBeInTheDocument()
    expect(screen.getByText(/30 min/)).toBeInTheDocument()
    expect(screen.getByText('Resumen de la charla demo.')).toBeInTheDocument()
    expect(screen.getByText('Ada Speaker')).toBeInTheDocument()
    expect(screen.getByText(/Platform Engineer/)).toBeInTheDocument()
  })

  it('shows noAbstract fallback when abstract is missing', async () => {
    await i18n.changeLanguage('es')
    renderDialog({
      session: { ...session, abstract: undefined },
    })

    expect(screen.getByText(i18n.t('agenda.detail.noAbstract'))).toBeInTheDocument()
  })

  it('hides speakers section when speakers list is empty', async () => {
    await i18n.changeLanguage('es')
    renderDialog({ speakers: [] })

    expect(
      screen.queryByText(i18n.t('agenda.detail.speakersHeading')),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Ada Speaker')).not.toBeInTheDocument()
  })

  it('invokes onClose when close control is activated', async () => {
    await i18n.changeLanguage('es')
    const onClose = vi.fn()
    renderDialog({ onClose })

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('agenda.detail.closeAriaLabel'),
      }),
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders LinkedIn link when speaker has social.linkedin', async () => {
    await i18n.changeLanguage('es')
    renderDialog()

    const link = screen.getByRole('link', {
      name: i18n.t('agenda.detail.viewProfile', { name: 'Ada Speaker' }),
    })
    expect(link).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/ada-speaker/',
    )
    expect(link).toHaveAttribute('target', '_blank')
  })
})
