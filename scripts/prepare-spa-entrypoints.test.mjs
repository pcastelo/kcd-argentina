import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import {
  prepareSpaEntrypoints,
  SPA_LOCALE_ENTRYPOINTS,
} from './prepare-spa-entrypoints.mjs'

describe('prepare-spa-entrypoints', () => {
  it('copies index.html to locale.html and locale/index.html', () => {
    const dist = join(tmpdir(), `kcd-spa-entry-${Date.now()}`)
    mkdirSync(dist, { recursive: true })
    writeFileSync(join(dist, 'index.html'), '<html>spa</html>', 'utf8')

    try {
      const written = prepareSpaEntrypoints(dist)
      expect(SPA_LOCALE_ENTRYPOINTS).toEqual(['es', 'en'])
      expect(written).toHaveLength(4)

      for (const locale of SPA_LOCALE_ENTRYPOINTS) {
        expect(existsSync(join(dist, `${locale}.html`))).toBe(true)
        expect(existsSync(join(dist, locale, 'index.html'))).toBe(true)
      }
    } finally {
      rmSync(dist, { recursive: true, force: true })
    }
  })
})
