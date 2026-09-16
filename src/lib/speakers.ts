import speakersData from '@/data/speakers.json'
import { type Speaker, speakersSchema } from '@/schemas/collectionSchemas'

const PLACEHOLDER_SLUGS = new Set(['aws-ug-sec-arg', 'women-in-cloud-tbd'])

export function getSpeakers(): Speaker[] {
  const result = speakersSchema.safeParse(speakersData)
  if (!result.success) {
    throw new Error(`Invalid speakers.json: ${result.error.message}`)
  }

  return result.data
}

export function getSpeakerRoster(): Speaker[] {
  return getSpeakers()
    .filter((speaker) => !PLACEHOLDER_SLUGS.has(speaker.slug))
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))
}

const MAX_AFFILIATION_LENGTH = 72

function trimAffiliationPart(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function splitRoleAndCompany(title: string): { role: string; company?: string } {
  const enMatch = title.match(/^(.+?)\s+en\s+([^,]+)/i)
  if (enMatch) {
    return {
      role: trimAffiliationPart(enMatch[1]),
      company: trimAffiliationPart(enMatch[2]),
    }
  }

  const atMatch = title.match(/^(.+?)\s+at\s+(.+)$/i)
  if (atMatch) {
    return {
      role: trimAffiliationPart(atMatch[1]),
      company: trimAffiliationPart(atMatch[2]),
    }
  }

  const ofMatch = title.match(/^(.+?)\s+of\s+([^,]+)/i)
  if (ofMatch) {
    return {
      role: trimAffiliationPart(ofMatch[1]),
      company: trimAffiliationPart(ofMatch[2]),
    }
  }

  return { role: trimAffiliationPart(title) }
}

function compactRoleList(role: string): string {
  const parts = role
    .split(',')
    .map((part) => trimAffiliationPart(part))
    .filter(Boolean)

  if (parts.length <= 2) {
    return parts.join(', ')
  }

  return parts.slice(0, 2).join(', ')
}

function truncateAffiliation(value: string): string {
  if (value.length <= MAX_AFFILIATION_LENGTH) {
    return value
  }

  return `${value.slice(0, MAX_AFFILIATION_LENGTH - 1).trimEnd()}\u2026`
}

export function formatSpeakerAffiliation(
  speaker: Pick<Speaker, 'title' | 'company'>,
): string | undefined {
  const rawTitle = speaker.title?.trim()
  const explicitCompany = speaker.company?.trim()

  if (!rawTitle && !explicitCompany) {
    return undefined
  }

  if (rawTitle && explicitCompany) {
    const role = compactRoleList(rawTitle)
    return truncateAffiliation(`${role} at ${explicitCompany}`)
  }

  if (rawTitle) {
    const { role, company } = splitRoleAndCompany(rawTitle)

    if (company) {
      return truncateAffiliation(`${role} at ${company}`)
    }

    return truncateAffiliation(compactRoleList(role))
  }

  return truncateAffiliation(explicitCompany!)
}
