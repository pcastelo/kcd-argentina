/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { type Plugin, defineConfig } from 'vite'
import { renderSessionHtml } from './scripts/prerender-session-pages.mjs'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const SESSION_PERMALINK = /^\/(es|en)\/agenda\/([^/?#]+)\/?(?:[?#].*)?$/
const SESSION_CARD = /^\/og\/sessions\/(es|en)\/([^/?#]+)\.png(?:[?#].*)?$/
const SESSION_CARD_GALLERY = /^\/og\/sessions\/?(?:[?#].*)?$/

/** Origin the request came in on (localhost, tailnet, …) for absolute dev URLs. */
function requestOrigin(req: IncomingMessage): string {
  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host)
  const forwarded = req.headers['x-forwarded-proto']
  const proto = forwarded
    ? String(forwarded).split(',')[0]
    : /^(localhost|127\.|\[::1\])/.test(host)
      ? 'http'
      : 'https'
  return `${proto}://${host}`
}

/**
 * Dev-only twin of scripts/prerender-session-pages.mjs: serve session
 * permalinks with their OG tags, render their social cards on demand, and
 * list every card at /og/sessions/ so link previews can be checked locally.
 */
function sessionPermalinkDevMeta(): Plugin {
  return {
    name: 'session-permalink-dev-meta',
    apply: 'serve',
    configureServer(server) {
      const loadSessionMeta = () =>
        server.ssrLoadModule('/src/lib/sessionMeta.ts')

      server.middlewares.use(async (req, res, next) => {
        const url = req.method === 'GET' ? (req.url ?? '') : ''
        try {
          if (SESSION_CARD_GALLERY.test(url)) {
            const { getPermalinkSessions, sessionCardPath, sessionPermalinkPath } =
              await loadSessionMeta()
            const items = getPermalinkSessions().flatMap(
              (session: { slug: string; title: string }) =>
                (['es', 'en'] as const).map(
                  (locale) =>
                    `<a href="${sessionPermalinkPath(locale, session.slug)}"><img loading='lazy' src="${sessionCardPath(locale, session.slug)}" alt='' /><span>${locale} · ${session.slug}</span></a>`,
                ),
            )
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(
              `<!doctype html><meta charset='utf-8'><title>Session cards</title><style>body{background:#010409;color:#94a3b8;font:14px system-ui;margin:24px}div{display:grid;grid-template-columns:repeat(auto-fill,minmax(480px,1fr));gap:24px}a{color:inherit;text-decoration:none;display:flex;flex-direction:column;gap:6px}img{width:100%;aspect-ratio:1200/630;border-radius:8px;border:1px solid #1e293b}</style><h1>Session social cards</h1><div>${items.join('')}</div>`,
            )
            return
          }

          const cardMatch = url.match(SESSION_CARD)
          if (cardMatch) {
            const [, locale, slug] = cardMatch
            const { findPermalinkSession, buildSessionCardData } =
              await loadSessionMeta()
            const session = findPermalinkSession(slug)
            if (!session) {
              return next()
            }
            const { renderSessionCard } = await import(
              './scripts/lib/session-card.mjs'
            )
            res.setHeader('Content-Type', 'image/png')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(
              await renderSessionCard(buildSessionCardData(session, locale)),
            )
            return
          }

          const pageMatch = url.match(SESSION_PERMALINK)
          if (!pageMatch) {
            return next()
          }
          const [, locale, slug] = pageMatch
          const { findPermalinkSession, buildSessionMeta, sessionCardPath } =
            await loadSessionMeta()
          const session = findPermalinkSession(slug)
          if (!session) {
            return next()
          }
          const messages = await server.ssrLoadModule(
            `/src/locales/${locale}.json`,
          )
          const indexHtml = await server.transformIndexHtml(
            url,
            readFileSync(path.join(rootDir, 'index.html'), 'utf8'),
          )
          const meta = {
            ...buildSessionMeta(session, locale),
            // Point at this dev server so inspectors can fetch the card.
            image: `${requestOrigin(req)}${sessionCardPath(locale, slug)}`,
          }
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(
            renderSessionHtml(indexHtml, meta, messages.default.seo.ogSiteName),
          )
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), sessionPermalinkDevMeta()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'scripts/**/*.test.mjs'],
  },
})
