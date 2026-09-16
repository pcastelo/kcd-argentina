import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import {
  formatSpeakerAffiliation,
  getSpeakerRoster,
} from '@/lib/speakers'
import type { Speaker } from '@/schemas/collectionSchemas'

function SpeakerPhoto({ speaker, linked }: { speaker: Speaker; linked: boolean }) {
  if (speaker.photo) {
    return (
      <img
        src={speaker.photo}
        alt={linked ? '' : speaker.name}
        className="h-28 w-28 rounded-full object-cover ring-2 ring-primary/25 transition duration-200 group-hover:scale-[1.02] group-hover:ring-primary/60"
        loading="lazy"
        width={112}
        height={112}
      />
    )
  }

  return (
    <div
      className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/15 text-3xl font-bold text-primary ring-2 ring-primary/25 transition duration-200 group-hover:scale-[1.02] group-hover:ring-primary/60"
      aria-hidden={linked}
    >
      {speaker.name.charAt(0)}
    </div>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const { t } = useTranslation()
  const affiliation = formatSpeakerAffiliation(speaker)
  const linkedin = speaker.social?.linkedin

  const profileContent = (
    <>
      <SpeakerPhoto speaker={speaker} linked={Boolean(linkedin)} />
      <span className="mt-4 text-base font-bold text-text transition group-hover:text-primary sm:text-lg">
        {speaker.name}
      </span>
    </>
  )

  return (
    <li
      className="group rounded-2xl border border-border/60 bg-surface/50 p-5 text-center backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:bg-surface/80 hover:shadow-lg hover:shadow-primary/10"
    >
      {linkedin ? (
        <a
          href={linkedin}
          className="flex flex-col items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          rel="noopener noreferrer"
          target="_blank"
          aria-label={t('speakers.profileAriaLabel', { name: speaker.name })}
        >
          {profileContent}
        </a>
      ) : (
        <div className="flex flex-col items-center">
          <SpeakerPhoto speaker={speaker} linked={false} />
          <h3 className="mt-4 text-base font-bold text-text sm:text-lg">
            {speaker.name}
          </h3>
        </div>
      )}

      {affiliation ? (
        <p className="mx-auto mt-2 line-clamp-2 max-w-[10.5rem] text-sm leading-snug text-primary sm:max-w-[11.5rem]">
          {affiliation}
        </p>
      ) : null}
    </li>
  )
}

export function SpeakersSection() {
  const { t } = useTranslation()
  const speakers = getSpeakerRoster()

  return (
    <Section id="speakers" tone="pattern" className="scroll-mt-8 py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={t('speakers.eyebrow')}
          title={t('speakers.title')}
          subtitle={t('speakers.subtitle')}
          badge={t('speakers.count', { count: speakers.length })}
        />

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.slug} speaker={speaker} />
          ))}
        </ul>
      </Container>
    </Section>
  )
}
