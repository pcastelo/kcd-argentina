import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import i18n from '@/lib/i18n'
import { buildSessionMeta, getPermalinkSessions } from '@/lib/sessionMeta'
import { router as appRouter } from '@/routes'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  })
})

const session = getPermalinkSessions().find((s) => s.speakerSlugs.length > 0)!

function renderApp(path: string) {
  const router = createMemoryRouter(appRouter.routes, { initialEntries: [path] })
  render(
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>,
  )
  return router
}

function meta(selector: string) {
  return document.head.querySelector(selector)?.getAttribute('content')
}

describe('session permalinks (full app)', () => {
  it('opens the session dialog, sets session OG tags, and closes back to home', async () => {
    const path = `/en/agenda/${session.slug}`
    const expected = buildSessionMeta(session, 'en')
    const router = renderApp(path)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent(
      session.title,
    )
    expect(within(dialog).getByRole('link', { name: expected.url })).toHaveAttribute(
      'href',
      expected.url,
    )

    await waitFor(() => expect(document.title).toBe(expected.title))
    expect(meta('meta[property="og:image"]')).toBe(expected.image)
    expect(expected.image).toBe(
      `https://kcdargentina.ar/og/sessions/en/${session.slug}.jpg`,
    )
    expect(meta('meta[property="og:description"]')).toContain('October 3, 2026')
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      expected.url,
    )

    fireEvent.click(
      within(dialog).getByRole('button', { name: i18n.t('agenda.detail.closeAriaLabel') }),
    )
    await waitFor(() => expect(router.state.location.pathname).toBe('/en'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clicking a session card navigates to its permalink', async () => {
    const router = renderApp('/es')
    const card = await screen.findByRole('button', {
      name: new RegExp(session.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    })
    fireEvent.click(card)

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/es/agenda/${session.slug}`),
    )
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('unknown session slug renders home without a dialog', async () => {
    renderApp('/es/agenda/does-not-exist')
    await screen.findByRole('heading', { name: 'KCD Argentina 2026' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
