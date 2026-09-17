# Data import scripts

## Sessionize API (source of truth)

Agenda and speaker content for the public site is generated from the Sessionize public API. This replaces the legacy Excel pipeline for day-to-day updates.

- **Endpoint:** `vxssqlh8` (override with `SESSIONIZE_ENDPOINT_ID`)
- **API:** `https://sessionize.com/api/v2/{endpointId}/view/All`
- **Output:** `src/data/sessions.json`, `src/data/speakers.json`
- **GitHub issue:** [#25 — Sessionize API sync (agenda + speakers)](https://github.com/pcastelo/kcd-argentina/issues/25)

### Local sync

```bash
npm run sync:sessionize -- --dry-run
npm run sync:sessionize
```

`--dry-run` prints session/speaker counts without writing files.

### Organizer requirements

1. **Schedule announced** in Sessionize — sessions must have `startsAt`, `endsAt`, and `roomId`.
2. **Speakers confirmed** in Sessionize admin — unconfirmed speakers are omitted from the API (and from the site).
3. **Endpoint filter** — keep the Sessionize endpoint filter aligned with accepted/informed sessions.

### Automated sync (GitHub Actions)

Workflow: `.github/workflows/sync-sessionize.yml`

- Runs every 15 minutes and on manual `workflow_dispatch`
- Executes `npm run sync:sessionize`
- Commits to `main` only when JSON changes
- Push to `main` triggers the existing Pages deploy workflow

### Rollback

1. Revert the data commit on `main`, or restore the previous JSON from git history.
2. Disable or delete `.github/workflows/sync-sessionize.yml` if you need to stop auto-updates.

### Mapping notes

| Sessionize | Site |
|------------|------|
| Service sessions (reception, keynotes, breaks, lunch) | `room: plenario` |
| Sala Principal (content) | `sala-1` |
| Sala 2 | `sala-2` |
| Sala 3 (Workshops) | `sala-3` |
| Times in API | ISO `-03:00` on `2026-10-03` |

Workshop continuation rows for the agenda grid are still virtual in `src/lib/agenda.ts` — they are not stored in JSON.

## Legacy Excel pipeline (fallback only)

Use only when the API is unavailable or for offline recovery.

```bash
npm run import:agenda [path-to-Agenda.xlsx]
npm run import:sessionize [path-to-export.xlsx]   # deprecated — prefer sync:sessionize
npm run import:data
```

`import-sessionize.mjs` is deprecated in favor of `sync-sessionize.mjs`.
