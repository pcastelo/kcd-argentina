import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { runnerImport } from 'vite'
import { renderSessionCard } from './lib/session-card.mjs'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')

const LOCALES = ['es', 'en']

function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Load the app's TS meta builder (shared with the client) through Vite. */
export async function loadSessionMeta() {
  const { module } = await runnerImport(
    join(rootDir, 'src', 'lib', 'sessionMeta.ts'),
    {
      root: rootDir,
      configFile: false,
      logLevel: 'error',
      resolve: { alias: { '@': join(rootDir, 'src') } },
    },
  )
  return module
}

function ogLocale(locale) {
  return locale === 'en' ? 'en_US' : 'es_AR'
}

/**
 * Swap the index.html `data-seo-fallback` tags for session-specific ones so
 * crawlers that do not run JS (WhatsApp, Slack, LinkedIn, X…) get a rich card.
 * Tags keep `data-seo-fallback` so SEOHead still removes them after hydrate.
 */
export function renderSessionHtml(indexHtml, meta, siteName) {
  const tags = [
    ['meta', { name: 'description', content: meta.description }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:title', content: meta.title }],
    ['meta', { property: 'og:description', content: meta.description }],
    ['meta', { property: 'og:url', content: meta.url }],
    ['meta', { property: 'og:image', content: meta.image }],
    ['meta', { property: 'og:image:alt', content: meta.imageAlt }],
    ['meta', { property: 'og:image:width', content: '2400' }],
    ['meta', { property: 'og:image:height', content: '1260' }],
    ['meta', { property: 'og:locale', content: ogLocale(meta.locale) }],
    ['meta', { name: 'twitter:card', content: meta.twitterCard }],
    ['meta', { name: 'twitter:title', content: meta.title }],
    ['meta', { name: 'twitter:description', content: meta.description }],
    ['meta', { name: 'twitter:image', content: meta.image }],
    ['link', { rel: 'canonical', href: meta.url }],
  ]
    .map(([tag, attrs]) => {
      const rendered = Object.entries(attrs)
        .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
        .join(' ')
      return `<${tag} data-seo-fallback ${rendered} />`
    })
    .join('\n    ')

  const withoutFallback = indexHtml.replace(
    /<(meta|link)\s+data-seo-fallback[^>]*>\s*/g,
    '',
  )
  if (withoutFallback === indexHtml) {
    throw new Error('index.html has no data-seo-fallback tags to replace')
  }

  return withoutFallback
    .replace(/<html lang="[^"]*"/, `<html lang="${meta.locale}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
    .replace(/\s*<\/head>/, `\n    ${tags}\n  </head>`)
}

export async function prerenderSessionPages(dist = distDir) {
  const indexPath = join(dist, 'index.html')
  if (!existsSync(indexPath)) {
    throw new Error(`Missing ${indexPath}; run vite build first`)
  }
  const indexHtml = readFileSync(indexPath, 'utf8')
  const {
    getPermalinkSessions,
    buildSessionMeta,
    buildSessionCardData,
    sessionCardPath,
  } = await loadSessionMeta()
  const locales = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      JSON.parse(
        readFileSync(join(rootDir, 'src', 'locales', `${locale}.json`), 'utf8'),
      ),
    ]),
  )

  const written = []
  for (const session of getPermalinkSessions()) {
    for (const locale of LOCALES) {
      const meta = buildSessionMeta(session, locale)
      const html = renderSessionHtml(
        indexHtml,
        meta,
        locales[locale].seo.ogSiteName,
      )
      // Same layout as prepare-spa-entrypoints: flat file + dir index so
      // GitHub Pages returns 200 with and without a trailing slash.
      const relative = meta.path.slice(1)
      const flat = join(dist, `${relative}.html`)
      const nested = join(dist, relative, 'index.html')
      for (const target of [flat, nested]) {
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, html, 'utf8')
        written.push(target)
      }

      const card = join(dist, sessionCardPath(locale, session.slug).slice(1))
      mkdirSync(dirname(card), { recursive: true })
      writeFileSync(
        card,
        await renderSessionCard(buildSessionCardData(session, locale)),
      )
      written.push(card)
    }
  }

  return written
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isMain) {
  const written = await prerenderSessionPages()
  console.log(`Wrote ${written.length} session permalink pages and cards`)
}
