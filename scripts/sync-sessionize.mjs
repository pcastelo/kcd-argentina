/**
 * Build sessions.json and speakers.json from the Sessionize public API.
 *
 * Usage:
 *   node scripts/sync-sessionize.mjs [--endpoint-id <id>] [--dry-run]
 *
 * Environment:
 *   SESSIONIZE_ENDPOINT_ID ù defaults to vxssqlh8
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildSessionsJson,
  buildSpeakersJson,
  countScheduledSessions,
  DEFAULT_ENDPOINT_ID,
  fetchAll,
  summarizeSync,
} from './lib/sessionize-api.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const sessionsPath = join(repoRoot, 'src/data/sessions.json')
const speakersPath = join(repoRoot, 'src/data/speakers.json')

function parseArgs(argv) {
  const options = {
    endpointId: process.env.SESSIONIZE_ENDPOINT_ID?.trim() || DEFAULT_ENDPOINT_ID,
    dryRun: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--endpoint-id') {
      options.endpointId = argv[index + 1]
      index += 1
    }
  }

  return options
}

function readExistingSpeakers() {
  try {
    return JSON.parse(readFileSync(speakersPath, 'utf8'))
  } catch {
    return []
  }
}

function printSummary(endpointId, summary) {
  console.log(`Sessionize endpoint: ${endpointId}`)
  console.log(`Sessions: ${summary.sessionCount}`)
  console.log(`Speakers: ${summary.speakerCount}`)
  console.log(`Service sessions: ${summary.serviceCount}`)
  console.log(`Workshops: ${summary.workshopCount}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const apiData = await fetchAll(options.endpointId)
  const scheduledCount = countScheduledSessions(apiData.sessions ?? [])

  if (scheduledCount === 0) {
    throw new Error('Sessionize API returned zero scheduled sessions; refusing to overwrite JSON')
  }

  const existingSpeakers = readExistingSpeakers()
  const sessions = buildSessionsJson(apiData, existingSpeakers)
  const speakers = buildSpeakersJson(apiData, sessions, existingSpeakers)
  const summary = summarizeSync(sessions, speakers)

  printSummary(options.endpointId, summary)

  if (options.dryRun) {
    console.log('Dry run: no files written')
    return
  }

  writeFileSync(sessionsPath, `${JSON.stringify(sessions, null, 2)}\n`, 'utf8')
  writeFileSync(speakersPath, `${JSON.stringify(speakers, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${sessionsPath}`)
  console.log(`Wrote ${speakersPath}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
