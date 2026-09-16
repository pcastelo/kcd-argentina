/**
 * Import sessions and speakers from the local Agenda.xlsx workbook.
 *
 * Usage:
 *   node scripts/import-agenda.mjs [path-to-Agenda.xlsx]
 *
 * Default path: ../Buenos Aires 2026/Coordinacion/Agenda/Agenda.xlsx
 */
import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const defaultWorkbook = resolve(
  repoRoot,
  '..',
  'Buenos Aires 2026',
  'Coordinacion',
  'Agenda',
  'Agenda.xlsx',
)

const EVENT_DATE = '2026-10-03'
const TIMEZONE_OFFSET = '-03:00'

const ROOM_COLUMNS = [
  { index: 1, room: 'sala-1' },
  { index: 2, room: 'sala-2' },
  { index: 3, room: 'sala-3' },
]

const SPEAKER_SHEET = 'Agenda'
const TITLE_SHEET = 'Agenda con nombre de charlas'

function fold(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}

function stripMarkdown(value) {
  return String(value ?? '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\u2615|\uD83C\uDF5A/g, '')
    .trim()
}

function slugify(value) {
  return fold(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function parseTimeRange(horario) {
  const match = String(horario).match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!match) {
    return null
  }

  const [, startHour, startMinute, endHour, endMinute] = match
  return {
    start: `${EVENT_DATE}T${startHour.padStart(2, '0')}:${startMinute}:00${TIMEZONE_OFFSET}`,
    end: `${EVENT_DATE}T${endHour.padStart(2, '0')}:${endMinute}:00${TIMEZONE_OFFSET}`,
  }
}

function parseWorkshopRange(text) {
  const match = String(text).match(/\((\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\)/)
  if (!match) {
    return null
  }

  const [, startHour, startMinute, endHour, endMinute] = match
  return {
    start: `${EVENT_DATE}T${startHour.padStart(2, '0')}:${startMinute}:00${TIMEZONE_OFFSET}`,
    end: `${EVENT_DATE}T${endHour.padStart(2, '0')}:${endMinute}:00${TIMEZONE_OFFSET}`,
  }
}

function durationMinutes(startTime, endTime) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.round((end - start) / 60_000)
}

function isSkippableCell(value) {
  const text = fold(stripMarkdown(value))
  return !text || text.includes('continuacion')
}

function isPlaceholderSpeaker(value) {
  const text = fold(stripMarkdown(value))
  return (
    !text ||
    text === 'slot 1' ||
    text === 'tbd' ||
    text.includes('continuacion')
  )
}

function classifySession(title, room) {
  const text = fold(title)

  if (text.includes('recepcion') || text.includes('acreditacion')) {
    return 'reception'
  }
  if (text.includes('keynote')) {
    return 'keynote'
  }
  if (text.includes('coffee break')) {
    return 'break'
  }
  if (text.includes('almuerzo')) {
    return 'lunch'
  }
  if (text.includes('transicion') || text.includes('actividad corta')) {
    return 'transition'
  }
  if (text.includes('margen') || text.includes('rotacion') || text.includes('cierre de workshop')) {
    return 'margin'
  }
  if (room === 'sala-3' || text.includes('workshop')) {
    return 'workshop'
  }

  return 'talk'
}

function isPlenaryBlock(title, rowValues) {
  const sala2 = stripMarkdown(rowValues[2])
  const sala3 = stripMarkdown(rowValues[3])
  const text = fold(title)

  if (sala2 || sala3) {
    return false
  }

  return (
    text.includes('plenario') ||
    text.includes('recepcion') ||
    text.includes('acreditacion') ||
    text.includes('keynote') ||
    text.includes('coffee break') ||
    text.includes('almuerzo')
  )
}

function isMarginRow(rowValues) {
  return ROOM_COLUMNS.every(({ index }) => {
    const text = fold(stripMarkdown(rowValues[index]))
    return text.includes('margen') || text.includes('rotacion') || text.includes('cierre de workshop')
  })
}

function shouldRegisterSpeaker(name, type) {
  if (['reception', 'break', 'lunch', 'margin', 'transition'].includes(type)) {
    return false
  }

  const text = fold(name)
  if (text.includes('keynote') && text.includes('plenario')) {
    return false
  }
  if (text.includes('recepcion') || text.includes('acreditacion')) {
    return false
  }
  if (text.includes('coffee break') || text.includes('almuerzo')) {
    return false
  }
  if (/^\d{1,2}:\d{2}\)?$/.test(text)) {
    return false
  }

  return true
}

function parseWorkshopTitle(titleCell) {
  const raw = stripMarkdown(titleCell)
  const numberMatch = raw.match(/workshop\s*(\d+)/i)
  return numberMatch ? `Workshop ${numberMatch[1]}` : 'Workshop'
}

function parseWorkshopFacilitator(titleCell) {
  const raw = stripMarkdown(titleCell)
  const suffix = raw.split(/\s-\s/).at(-1)?.trim() ?? ''
  if (!suffix || /^tbd$/i.test(suffix) || /\(\d{1,2}:\d{2}/.test(suffix)) {
    return []
  }
  return [suffix]
}

function looksLikePersonName(name) {
  if (name.length > 80) {
    return false
  }
  if (name.includes(':')) {
    return false
  }
  if (/workshop\s*\d/i.test(name)) {
    return false
  }
  return true
}

function parseSpeakerNames(speakerCell, titleCell, type) {
  const speakers = []

  if (type === 'keynote') {
    const closingMatch = stripMarkdown(titleCell).match(/-\s*([^()]+)$/i)
    if (closingMatch) {
      speakers.push(closingMatch[1].trim())
    }
  } else if (type === 'workshop') {
    speakers.push(...parseWorkshopFacilitator(titleCell))
  } else if (!isPlaceholderSpeaker(speakerCell)) {
    for (const part of stripMarkdown(speakerCell).split(/\s*-\s*/)) {
      const name = part.trim()
      if (name && !/^tbd$/i.test(name)) {
        speakers.push(name)
      }
    }
  }

  return [...new Set(speakers)].filter(
    (name) => shouldRegisterSpeaker(name, type) && looksLikePersonName(name),
  )
}

function normalizeTitle(titleCell, type) {
  const raw = stripMarkdown(titleCell)
  let title = raw

  if (type === 'keynote') {
    title = raw.replace(/\s*\(Plenario\)/i, '').replace(/\s*-\s*[^-]+$/i, '').trim()
  }

  if (type === 'workshop') {
    title = parseWorkshopTitle(titleCell)
  }

  if (type === 'break') {
    title = 'Coffee Break'
  }

  if (type === 'lunch') {
    title = 'Almuerzo'
  }

  return title
}

function buildSessionId(startTime, room, slug) {
  const timePart = startTime.slice(11, 16).replace(':', '')
  return `${EVENT_DATE}-${timePart}-${room}-${slug}`
}

function registerSpeaker(speakerSlugByName, name) {
  if (!speakerSlugByName.has(name)) {
    let slugCandidate = slugify(name)
    let counter = 2
    while ([...speakerSlugByName.values()].includes(slugCandidate)) {
      slugCandidate = `${slugify(name)}-${counter}`
      counter += 1
    }
    speakerSlugByName.set(name, slugCandidate)
  }
  return speakerSlugByName.get(name)
}

function importWorkbook(workbookPath) {
  const workbook = XLSX.readFile(workbookPath)
  const speakerRows = XLSX.utils.sheet_to_json(workbook.Sheets[SPEAKER_SHEET], {
    header: 1,
    defval: '',
  })
  const titleRows = XLSX.utils.sheet_to_json(workbook.Sheets[TITLE_SHEET], {
    header: 1,
    defval: '',
  })

  const sessions = []
  const speakerSlugByName = new Map()

  for (let rowIndex = 1; rowIndex < speakerRows.length; rowIndex += 1) {
    const speakerRow = speakerRows[rowIndex]
    const titleRow = titleRows[rowIndex] ?? []
    const timeRange = parseTimeRange(speakerRow[0])

    if (!timeRange) {
      continue
    }

    if (isMarginRow(speakerRow)) {
      const title = 'Margen / Rotaci\u00f3n general'
      const slug = slugify(title)
      sessions.push({
        id: buildSessionId(timeRange.start, 'plenario', slug),
        slug,
        title,
        speakerSlugs: [],
        room: 'plenario',
        startTime: timeRange.start,
        endTime: timeRange.end,
        durationMinutes: durationMinutes(timeRange.start, timeRange.end),
        type: 'margin',
      })
      continue
    }

    for (const { index, room: defaultRoom } of ROOM_COLUMNS) {
      const speakerCell = speakerRow[index]
      const titleCell = titleRow[index]

      if (isSkippableCell(titleCell) && isSkippableCell(speakerCell)) {
        continue
      }

      const preliminaryType = classifySession(
        stripMarkdown(titleCell || speakerCell),
        defaultRoom,
      )
      const title = normalizeTitle(titleCell || speakerCell, preliminaryType)

      if (!title) {
        continue
      }

      const room = isPlenaryBlock(title, speakerRow) ? 'plenario' : defaultRoom
      const type = classifySession(title, room)
      const workshopRange = type === 'workshop' ? parseWorkshopRange(titleCell) : null
      const startTime = workshopRange?.start ?? timeRange.start
      const endTime = workshopRange?.end ?? timeRange.end
      const slug = slugify(title)
      const speakerNames = parseSpeakerNames(speakerCell, titleCell, type)
      const speakerSlugs = speakerNames.map((name) =>
        registerSpeaker(speakerSlugByName, name),
      )

      sessions.push({
        id: buildSessionId(startTime, room, slug),
        slug,
        title,
        speakerSlugs,
        speakerNames: speakerNames.length > 0 ? speakerNames : undefined,
        room,
        startTime,
        endTime,
        durationMinutes: durationMinutes(startTime, endTime),
        type,
        language: 'es',
      })
    }
  }

  const speakers = [...speakerSlugByName.entries()]
    .map(([name, slug]) => ({ slug, name }))
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))

  return { sessions, speakers }
}

function main() {
  const workbookPath = resolve(process.argv[2] ?? defaultWorkbook)
  const { sessions, speakers } = importWorkbook(workbookPath)

  writeFileSync(
    join(repoRoot, 'src/data/sessions.json'),
    `${JSON.stringify(sessions, null, 2)}\n`,
    'utf8',
  )
  writeFileSync(
    join(repoRoot, 'src/data/speakers.json'),
    `${JSON.stringify(speakers, null, 2)}\n`,
    'utf8',
  )

  console.log(`Imported ${sessions.length} sessions and ${speakers.length} speakers from:`)
  console.log(workbookPath)
}

main()
