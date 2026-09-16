/**
 * Enrich speakers.json and sessions.json from a Sessionize Excel export.
 *
 * Usage:
 *   node scripts/import-sessionize.mjs [path-to-export.xlsx]
 *
 * Default: ../kubernetes-community-days-argentina-2026 accepted sessions - exported 2026-09-16.xlsx
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const defaultWorkbook = resolve(
  repoRoot,
  '..',
  'kubernetes-community-days-argentina-2026 accepted sessions - exported 2026-09-16.xlsx',
)

const SESSIONS_SHEET = 'Accepted sessions'
const SPEAKERS_SHEET = 'Accepted speakers'

function fold(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

function slugify(value) {
  return fold(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function normalizeTitle(value) {
  return fold(value).replace(/[.!?]+$/g, '').trim()
}

function splitSpeakerNames(value) {
  return String(value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}

function nameTokens(name) {
  return fold(name)
    .split(/\s+/)
    .filter((token) => token.length > 2)
}

function namesOverlap(leftName, rightName) {
  const leftTokens = nameTokens(leftName)
  const rightTokens = nameTokens(rightName)
  if (leftTokens.length === 0 || rightTokens.length === 0) {
    return false
  }

  const shared = leftTokens.filter((token) => rightTokens.includes(token))
  const minimum = Math.min(leftTokens.length, rightTokens.length)

  return shared.length >= minimum || (leftTokens.length === 1 && shared.length === 1)
}

function namesMatch(agendaName, sessionizeName) {
  return namesOverlap(agendaName, sessionizeName)
}

function mapLanguage(value) {
  const text = fold(value)
  if (text.startsWith('en')) {
    return 'en'
  }
  if (text.startsWith('es') || text.startsWith('span')) {
    return 'es'
  }
  return undefined
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
}

function parseTagLine(value) {
  const text = cleanText(value)
  if (!text) {
    return { title: undefined, company: undefined }
  }

  const atMatch = text.match(/^(.+?)\s+at\s+(.+)$/i)
  if (atMatch) {
    return {
      title: atMatch[1].trim(),
      company: atMatch[2].trim(),
    }
  }

  const dashMatch = text.match(/^(.+?)\s+[-ùù]\s+(.+)$/)
  if (dashMatch) {
    const left = dashMatch[1].trim()
    const right = dashMatch[2].trim()
    const leftLooksLikeCompany =
      /\b(banco|bank|aws|google|microsoft|amazon|axa|testkube|orca|compartamos)\b/i.test(
        left,
      ) || left.split(/\s+/).length <= 3

    if (leftLooksLikeCompany) {
      return { company: left, title: right }
    }

    return { title: text, company: undefined }
  }

  return { title: text, company: undefined }
}

function parseUrl(value) {
  const text = String(value ?? '').trim()
  if (!text) {
    return undefined
  }
  try {
    return new URL(text).toString()
  } catch {
    return undefined
  }
}

function buildSessionizeSpeakers(rows) {
  const speakers = []
  const bySlug = new Map()
  const byId = new Map()

  for (const row of rows) {
    const name = `${row.FirstName} ${row.LastName}`.trim()
    const slug = slugify(name)
    const { title, company } = parseTagLine(row.TagLine)
    const speaker = {
      slug,
      name,
      title,
      company,
      bio: cleanText(row.Bio) || undefined,
      photo: parseUrl(row['Profile Picture']),
      social: {
        linkedin: parseUrl(row.LinkedIn),
        twitter: cleanText(row['X (Twitter)']) || undefined,
      },
      sessionizeId: row['Speaker Id'],
    }

    if (!speaker.social.linkedin && !speaker.social.twitter) {
      delete speaker.social
    }

    speakers.push(speaker)
    bySlug.set(slug, speaker)
    byId.set(row['Speaker Id'], speaker)
  }

  return { speakers, bySlug, byId }
}

function findSpeakerSlugForName(name, sessionizeSpeakers, existingBySlug) {
  const direct = slugify(name)

  for (const [slug, speaker] of existingBySlug.entries()) {
    if (namesOverlap(name, speaker.name)) {
      return slug
    }
  }

  for (const speaker of sessionizeSpeakers.speakers) {
    if (namesOverlap(name, speaker.name)) {
      return speaker.slug
    }
  }

  if (sessionizeSpeakers.bySlug.has(direct)) {
    return direct
  }

  return direct
}

function findSessionizeRow(agendaSession, sessionizeRows) {
  const agendaTitle = normalizeTitle(agendaSession.title)
  const byTitle = sessionizeRows.find(
    (row) => normalizeTitle(row.Title) === agendaTitle,
  )
  if (byTitle) {
    return byTitle
  }

  const agendaSpeakers = agendaSession.speakerNames ?? []
  if (agendaSpeakers.length === 0) {
    return undefined
  }

  const candidates = sessionizeRows.filter((row) => {
    const sessionSpeakers = splitSpeakerNames(row.Speakers)
    return agendaSpeakers.some((agendaSpeaker) =>
      sessionSpeakers.some((sessionSpeaker) =>
        namesMatch(agendaSpeaker, sessionSpeaker),
      ),
    )
  })

  if (candidates.length === 1) {
    return candidates[0]
  }

  if (candidates.length > 1) {
    const workshopCandidate = candidates.find(
      (row) => fold(row['Session format']) === 'workshop',
    )
    if (workshopCandidate && agendaSession.type === 'workshop') {
      return workshopCandidate
    }

    const talkCandidate = candidates.find(
      (row) => fold(row['Session format']) !== 'workshop',
    )
    if (talkCandidate && agendaSession.type === 'talk') {
      return talkCandidate
    }
  }

  return undefined
}

function mergeSpeakers(sessionizeSpeakers, existingSpeakers, sessions) {
  const mergedBySlug = new Map()
  const existingBySlug = new Map(existingSpeakers.map((speaker) => [speaker.slug, speaker]))

  for (const speaker of sessionizeSpeakers.speakers) {
    let slug = speaker.slug
    for (const [existingSlug, existingSpeaker] of existingBySlug.entries()) {
      if (namesOverlap(existingSpeaker.name, speaker.name)) {
        slug = existingSlug
        break
      }
    }

    mergedBySlug.set(slug, {
      slug,
      name: speaker.name,
      title: speaker.title,
      company: speaker.company,
      bio: speaker.bio,
      photo: speaker.photo,
      social: speaker.social,
    })
  }

  for (const speaker of existingSpeakers) {
    if (!mergedBySlug.has(speaker.slug)) {
      const stillReferenced = sessions.some((session) =>
        session.speakerSlugs.includes(speaker.slug),
      )
      if (stillReferenced) {
        mergedBySlug.set(speaker.slug, speaker)
      }
    }
  }

  return [...mergedBySlug.values()].sort((left, right) =>
    left.name.localeCompare(right.name, 'es'),
  )
}

function enrichSessions(sessions, sessionizeRows, sessionizeSpeakers, existingSpeakers) {
  const existingBySlug = new Map(
    [...existingSpeakers, ...sessionizeSpeakers.speakers].map((speaker) => [
      speaker.slug,
      speaker,
    ]),
  )
  let matched = 0

  const enriched = sessions.map((session) => {
    if (session.isWorkshopContinuation) {
      return session
    }
    if (!['talk', 'workshop'].includes(session.type)) {
      return session
    }

    const row = findSessionizeRow(session, sessionizeRows)
    if (!row) {
      return session
    }

    matched += 1
    const sessionSpeakers = splitSpeakerNames(row.Speakers)
    const speakerSlugs = sessionSpeakers.map((name) =>
      findSpeakerSlugForName(name, sessionizeSpeakers, existingBySlug),
    )
    const speakerNames = sessionSpeakers
    const abstract = cleanText(row.Description)
    const language = mapLanguage(row.Language)
    const track = cleanText(row.Track) || undefined
    const title = cleanText(row.Title)
    const shouldReplaceGenericTitle = /^workshop(\s+\d+)?$/i.test(session.title)

    return {
      ...session,
      title: shouldReplaceGenericTitle ? title : session.title,
      abstract: abstract || session.abstract,
      language: language ?? session.language,
      track,
      speakerSlugs,
      speakerNames,
      slug: slugify(shouldReplaceGenericTitle ? title : session.title),
    }
  })

  return { enriched, matched }
}

function attachSessionSlugs(speakers, sessions) {
  const slugsBySpeaker = new Map(speakers.map((speaker) => [speaker.slug, new Set()]))

  for (const session of sessions) {
    for (const slug of session.speakerSlugs ?? []) {
      slugsBySpeaker.get(slug)?.add(session.slug)
    }
  }

  return speakers.map((speaker) => {
    const sessionSlugs = [...(slugsBySpeaker.get(speaker.slug) ?? [])].sort()
    if (sessionSlugs.length === 0) {
      return speaker
    }
    return { ...speaker, sessionSlugs }
  })
}

function main() {
  const workbookPath = resolve(process.argv[2] ?? defaultWorkbook)
  const workbook = XLSX.readFile(workbookPath)
  const sessionizeSessions = XLSX.utils.sheet_to_json(workbook.Sheets[SESSIONS_SHEET])
  const sessionizeSpeakerRows = XLSX.utils.sheet_to_json(workbook.Sheets[SPEAKERS_SHEET])

  const existingSpeakers = JSON.parse(
    readFileSync(join(repoRoot, 'src/data/speakers.json'), 'utf8'),
  )
  const existingSessions = JSON.parse(
    readFileSync(join(repoRoot, 'src/data/sessions.json'), 'utf8'),
  )

  const sessionizeSpeakers = buildSessionizeSpeakers(sessionizeSpeakerRows)
  const { enriched, matched } = enrichSessions(
    existingSessions,
    sessionizeSessions,
    sessionizeSpeakers,
    existingSpeakers,
  )
  const speakers = attachSessionSlugs(
    mergeSpeakers(sessionizeSpeakers, existingSpeakers, enriched),
    enriched,
  )

  writeFileSync(
    join(repoRoot, 'src/data/speakers.json'),
    `${JSON.stringify(speakers, null, 2)}\n`,
    'utf8',
  )
  writeFileSync(
    join(repoRoot, 'src/data/sessions.json'),
    `${JSON.stringify(enriched, null, 2)}\n`,
    'utf8',
  )

  console.log(`Sessionize export: ${workbookPath}`)
  console.log(`Speakers written: ${speakers.length}`)
  console.log(`Sessions enriched from Sessionize: ${matched}/${sessionizeSessions.length}`)
  console.log(
    `Sessions with photo: ${speakers.filter((speaker) => speaker.photo).length}`,
  )
}

main()
