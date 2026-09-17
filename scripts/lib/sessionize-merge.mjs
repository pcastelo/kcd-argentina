export function fold(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function slugify(value) {
  return fold(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function normalizeTitle(value) {
  return fold(value).replace(/[.!?]+$/g, '').trim()
}

export function splitSpeakerNames(value) {
  return String(value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}

export function nameTokens(name) {
  return fold(name)
    .split(/\s+/)
    .filter((token) => token.length > 2)
}

export function namesOverlap(leftName, rightName) {
  const leftTokens = nameTokens(leftName)
  const rightTokens = nameTokens(rightName)
  if (leftTokens.length === 0 || rightTokens.length === 0) {
    return false
  }

  const shared = leftTokens.filter((token) => rightTokens.includes(token))
  const minimum = Math.min(leftTokens.length, rightTokens.length)

  return shared.length >= minimum || (leftTokens.length === 1 && shared.length === 1)
}

export function namesMatch(agendaName, sessionizeName) {
  return namesOverlap(agendaName, sessionizeName)
}

export function cleanText(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
}

export function parseTagLine(value) {
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

  const dashMatch = text.match(/^(.+?)\s+[-\u2013\u2014]\s+(.+)$/)
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

export function parseUrl(value) {
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

export function mapLanguage(value) {
  const text = fold(value)
  if (text.startsWith('en')) {
    return 'en'
  }
  if (text.startsWith('es') || text.startsWith('span')) {
    return 'es'
  }
  return undefined
}

export function inferLanguageFromTitle(title) {
  if (/[áéíóúñ¿¡]/i.test(title)) {
    return 'es'
  }

  const text = fold(title)
  const spanishHints =
    /\b(de|del|la|el|los|las|un|una|con|para|por|como|que|en|y|tu|es|son|esta|este|al|gobernanza|charla|agente|desde|hacia|cuando|desde|tambien|puede|llamar|contencion|visibilidad|poder|arquitectura|integracion|banco|aplicar|contra|costos|agentes|ejecutando|codigo|confiable|construi|propio|juez|hackathons)\b/i
  const englishHints =
    /\b(the|and|with|from|your|who|how|what|one|many|across|writes|code|designs|architecture|playbook|maturities|standardizing|started|scratch|inside|breaking|stop|learn|enterprise|document|extraction|production|integrated|innersource|scaling|innovation|open source|simply|resolve|incident|babysitting|gpus|crossplane|jailbreaks|vulnerabilities|attacks|babysitting|document|extraction)\b/i

  if (englishHints.test(text) && !spanishHints.test(text)) {
    return 'en'
  }

  return 'es'
}

export function parseSpeakerLinks(links = []) {
  const social = {}

  for (const link of links) {
    const type = fold(link.linkType ?? link.title ?? '')
    const url = parseUrl(link.url)

    if (!url) {
      continue
    }

    if (type.includes('linkedin')) {
      social.linkedin = url
    } else if (type.includes('twitter') || type === 'x') {
      social.twitter = cleanText(link.url)
    } else if (type.includes('github')) {
      social.github = url
    }
  }

  if (!social.linkedin && !social.twitter && !social.github) {
    return undefined
  }

  return social
}

export function findSpeakerSlugForName(name, sessionizeSpeakers, existingBySlug) {
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

export function attachSessionSlugs(speakers, sessions) {
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
