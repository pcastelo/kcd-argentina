# KCD Argentina 2026

[![CI](https://github.com/pcastelo/kcd-argentina/actions/workflows/ci.yml/badge.svg)](https://github.com/pcastelo/kcd-argentina/actions/workflows/ci.yml)

Public marketing site for **Kubernetes Community Days Argentina** — static Vite + React app deployed to GitHub Pages.

| Item | Value |
|------|-------|
| Event | 3 October 2026 · Plaza Galicia · Buenos Aires |
| Production (Pages) | https://pcastelo.github.io/kcd-argentina/ |
| Custom domain | https://kcdargentina.ar |
| SDD store | [kcd-argentina-sdd](https://github.com/pcastelo/kcd-argentina-sdd) |

## Prerequisites

- Node.js **20+** (see `.nvmrc`)
- npm 10+

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/
npm test             # Vitest
npm run lint         # oxlint
npm run typecheck    # tsc -b
npm run validate:data  # Zod validation for src/data/*.json
```

## Development workflow

1. Branch from `main`: `feature/<issue>-<change-name>` (never commit features directly on `main`).
2. Plan in OpenSpec store (`kcd-argentina-sdd`), implement here, open PR with `Closes #N`.
3. CI runs on every PR to `main` (lint, typecheck, validate:data, test, build).

## Deployment

- **Repository:** public (required for free GitHub Pages).
- **Pages source:** GitHub Actions (Settings → Pages → Build and deployment → GitHub Actions).
- **Trigger:** merge to `main` runs the Deploy workflow and publishes `dist/`.
- **SPA routing:** deploy copies `index.html` to `404.html` for client-side routes.

## Search indexing

The live site allows crawlers: `public/robots.txt` uses `Allow: /` and points to `https://kcdargentina.ar/sitemap.xml`. Locale pages set titles, descriptions, and Open Graph tags via `react-helmet-async` (issue [#14](https://github.com/pcastelo/kcd-argentina/issues/14)).

**Note:** Locale entrypoints (`/es`, `/en`) are real HTML files copied at build time so GitHub Pages returns HTTP 200 (not a soft-404 via `404.html`). Unknown paths still use `404.html` with status 404 and the in-app NotFound page.

## Stack

- Vite 8 + React 19 + TypeScript (`strict`) + oxlint
- Tailwind CSS 4 (`@tailwindcss/vite`)
- react-router-dom, i18next, Zod
- Vitest + Testing Library

## Content

Event and collection data live in `src/data/*.json`, validated with Zod schemas in `src/schemas/`.
