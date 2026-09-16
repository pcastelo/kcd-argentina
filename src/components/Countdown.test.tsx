import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { Countdown } from '@/components/Countdown'
import i18n from '@/lib/i18n'

const startIso = '2026-10-03T09:00:00-03:00'
const endIso = '2026-10-03T19:00:00-03:00'

function renderCountdown(getNow: () => number) {
  return render(
    <I18nextProvider i18n={i18n}>
      <Countdown
        dateStart={startIso}
        dateEnd={endIso}
        getNow={getNow}
      />
    </I18nextProvider>,
  )
}

describe('Countdown', () => {
  it('renders countdown units before the event starts', async () => {
    await i18n.changeLanguage('es')
    const now = new Date('2026-10-01T09:00:00-03:00').getTime()

    renderCountdown(() => now)

    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(
      screen.getByText(i18n.t('home.countdown.days')),
    ).toBeInTheDocument()
  })

  it('renders in-progress message during the event', async () => {
    await i18n.changeLanguage('en')
    const now = new Date('2026-10-03T10:00:00-03:00').getTime()

    renderCountdown(() => now)

    expect(
      screen.getByText(i18n.t('home.countdown.eventStarted')),
    ).toBeInTheDocument()
  })

  it('renders thank-you message after the event ends', async () => {
    await i18n.changeLanguage('es')
    const now = new Date('2026-10-03T20:00:00-03:00').getTime()

    renderCountdown(() => now)

    expect(
      screen.getByText(i18n.t('home.countdown.eventEnded')),
    ).toBeInTheDocument()
  })
})
