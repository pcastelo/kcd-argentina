import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const distDir = join(rootDir, '..', 'dist')
const indexPath = join(distDir, 'index.html')

/** Locale prefixes that must return HTTP 200 on GitHub Pages (not soft-404). */
export const SPA_LOCALE_ENTRYPOINTS = ['es', 'en']

/**
 * Copy the SPA shell to locale paths so GitHub Pages serves them as real files.
 * Without this, /es and /en fall through to 404.html with status 404 (soft-404),
 * which hurts search indexing even though the app hydrates correctly.
 */
export function prepareSpaEntrypoints(dist = distDir) {
  const source = join(dist, 'index.html')
  if (!existsSync(source)) {
    throw new Error(`Missing ${source}; run vite build first`)
  }

  const written = []
  for (const locale of SPA_LOCALE_ENTRYPOINTS) {
    const flat = join(dist, `${locale}.html`)
    copyFileSync(source, flat)
    written.push(flat)

    const dir = join(dist, locale)
    mkdirSync(dir, { recursive: true })
    const nested = join(dir, 'index.html')
    copyFileSync(source, nested)
    written.push(nested)
  }

  return written
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isMain) {
  if (!existsSync(indexPath)) {
    console.error(`Missing ${indexPath}; run vite build first`)
    process.exit(1)
  }
  const written = prepareSpaEntrypoints()
  for (const path of written) {
    console.log(`Wrote ${path}`)
  }
}
