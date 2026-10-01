import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import {
  buildSessionMeta,
  getPermalinkSessions,
  sessionCardPath,
} from '../src/lib/sessionMeta'

describe('pre-rendered permalink pages (build artifact)', () => {
  const distDir = join(process.cwd(), 'dist')

  it('every permalink has a 1200x630 JPEG social card when dist exists', async () => {
    if (!existsSync(join(distDir, 'index.html'))) {
      return
    }

    for (const session of getPermalinkSessions()) {
      for (const locale of ['es', 'en']) {
        const file = join(distDir, sessionCardPath(locale, session.slug).slice(1))
        const { format, width, height } = await sharp(file).metadata()
        expect({ format, width, height }).toEqual({ format: 'jpeg', width: 1200, height: 630 })
      }
    }
  })

  it('every permalink has static HTML with session OG tags when dist exists', () => {
    if (!existsSync(join(distDir, 'index.html'))) {
      return
    }

    for (const session of getPermalinkSessions()) {
      for (const locale of ['es', 'en']) {
        const expected = buildSessionMeta(session, locale)
        for (const file of [`${expected.path}.html`, `${expected.path}/index.html`]) {
          const html = readFileSync(join(distDir, file), 'utf8')
          const doc = new DOMParser().parseFromString(html, 'text/html')
          const get = (sel) => doc.querySelector(sel)?.getAttribute('content')
          expect(get('meta[property="og:title"]')).toBe(expected.title)
          expect(get('meta[property="og:image"]')).toBe(expected.image)
          expect(get('meta[property="og:url"]')).toBe(expected.url)
          expect(get('meta[property="og:description"]')).toBe(expected.description)
          expect(doc.querySelectorAll('meta[property="og:title"]')).toHaveLength(1)
        }
      }
    }
  })
})
