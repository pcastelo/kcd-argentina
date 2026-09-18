import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildSitemap } from './generate-sitemap.mjs'
import site from '../src/data/site.json'

describe('generate-sitemap', () => {
  it('lists home and location locales with hreflang alternates', () => {
    const xml = buildSitemap()

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain(`${site.origin}/es`)
    expect(xml).toContain(`${site.origin}/en`)
    expect(xml).toContain(`${site.origin}/es/location`)
    expect(xml).toContain(`${site.origin}/en/location`)
    expect(xml).toContain('hreflang="es-AR"')
    expect(xml).toContain('hreflang="en-US"')
    expect(xml).toContain('hreflang="x-default"')
  })
})

describe('SEO build artifacts', () => {
  const distDir = join(process.cwd(), 'dist')

  it('keeps robots.txt open with sitemap pointer when dist exists', () => {
    const robotsPath = join(distDir, 'robots.txt')
    if (!existsSync(robotsPath)) {
      return
    }

    const robots = readFileSync(robotsPath, 'utf8')
    expect(robots).toMatch(/Allow:\s*\//)
    expect(robots).not.toMatch(/Disallow:\s*\//)
    expect(robots).toContain(`Sitemap: ${site.origin}/sitemap.xml`)
  })

  it('publishes sitemap and OG image when dist exists', () => {
    const sitemapPath = join(distDir, 'sitemap.xml')
    const ogPath = join(distDir, site.ogImagePath.replace(/^\//, ''))
    if (!existsSync(sitemapPath)) {
      return
    }

    const sitemap = readFileSync(sitemapPath, 'utf8')
    expect(sitemap).toContain(`${site.origin}/es`)
    expect(existsSync(ogPath)).toBe(true)
  })
})
