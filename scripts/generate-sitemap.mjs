import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadSessionMeta } from './prerender-session-pages.mjs'

const rootDir = dirname(fileURLToPath(import.meta.url))
const site = JSON.parse(
  readFileSync(join(rootDir, '..', 'src', 'data', 'site.json'), 'utf8'),
)

const SITE_ORIGIN = site.origin

/** Locale home routes — SPA hash sections are not separate URLs. */
const HOME_ROUTE_PAIRS = [['/es', '/en']]

function url(path) {
  return `${SITE_ORIGIN}${path}`
}

function alternateLinks(esPath, enPath) {
  return [
    `    <xhtml:link rel="alternate" hreflang="es-AR" href="${url(esPath)}" />`,
    `    <xhtml:link rel="alternate" hreflang="en-US" href="${url(enPath)}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(esPath)}" />`,
  ].join('\n')
}

function urlEntry(path, esPath, enPath) {
  return `  <url>
    <loc>${url(path)}</loc>
${alternateLinks(esPath, enPath)}
  </url>`
}

/** Session permalinks are pre-rendered with their own OG tags; list them too. */
export async function sessionRoutePairs() {
  const { getPermalinkSessions, sessionPermalinkPath } = await loadSessionMeta()
  return getPermalinkSessions().map((session) => [
    sessionPermalinkPath('es', session.slug),
    sessionPermalinkPath('en', session.slug),
  ])
}

export function buildSitemap(extraRoutePairs = []) {
  const entries = [...HOME_ROUTE_PAIRS, ...extraRoutePairs].flatMap(([esPath, enPath]) => [
    urlEntry(esPath, esPath, enPath),
    urlEntry(enPath, esPath, enPath),
  ])

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${entries.join('\n')}
</urlset>
`
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isMain) {
  const outPath = join(rootDir, '..', 'dist', 'sitemap.xml')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buildSitemap(await sessionRoutePairs()), 'utf8')
  console.log(`Wrote ${outPath}`)
}
