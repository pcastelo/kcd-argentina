import { describe, expect, it } from 'vitest'
import {
  formatSpeakerAffiliation,
  getSpeakerRoster,
  getSpeakers,
} from '@/lib/speakers'

describe('speakers', () => {
  it('loads speakers from data', () => {
    expect(getSpeakers().length).toBeGreaterThan(0)
  })

  it('excludes placeholder community workshop entries from the roster', () => {
    const slugs = new Set(getSpeakerRoster().map((speaker) => speaker.slug))

    expect(slugs.has('aws-ug-sec-arg')).toBe(false)
    expect(slugs.has('women-in-cloud-tbd')).toBe(false)
    expect(slugs.has('axel-labruna')).toBe(true)
  })

  it('formats role and company for display', () => {
    expect(
      formatSpeakerAffiliation({
        title: 'Cloud Engineer',
        company: 'Amazon Web Services',
      }),
    ).toBe('Cloud Engineer at Amazon Web Services')
  })

  it('falls back to role-only affiliation', () => {
    expect(formatSpeakerAffiliation({ title: 'CNCF Ambassador' })).toBe(
      'CNCF Ambassador',
    )
  })

  it('parses Spanish role en company and drops long trailing clauses', () => {
    expect(
      formatSpeakerAffiliation({
        title:
          'Consultor de Infraestructura en Compartamos Banco, enfocado en resiliencia, troubleshooting y operación de plataformas cloud native sobre Kubernetes',
      }),
    ).toBe('Consultor de Infraestructura at Compartamos Banco')
  })

  it('keeps at most two comma-separated roles', () => {
    expect(
      formatSpeakerAffiliation({
        title: 'Solutions Engineer, CNCF Ambassador, OpenSource Contributor',
      }),
    ).toBe('Solutions Engineer, CNCF Ambassador')
  })
})
