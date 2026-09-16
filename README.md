# KCD Argentina 2026

Public marketing site for **Kubernetes Community Days Argentina** — static Vite + React app deployed to GitHub Pages.

| Item | Value |
|------|-------|
| Event | 3 October 2026 · Plaza Galicia · Buenos Aires |
| Production | https://kcdargentina.castelo.ar |
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

## Stack

- Vite 8 + React 19 + TypeScript (`strict`) + oxlint
- Tailwind CSS 4 (`@tailwindcss/vite`)
- react-router-dom, i18next, Zod
- Vitest + Testing Library

## Content

Event and collection data live in `src/data/*.json`, validated with Zod schemas in `src/schemas/`.
