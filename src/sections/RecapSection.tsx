import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'

const RECAP_PHOTOS = [
  {
    src: '/images/recap/01-group.webp',
    captionKey: 'recap.caption01',
    altKey: 'recap.altGroup',
    width: 800,
    height: 600,
  },
  {
    src: '/images/recap/02-audience.webp',
    captionKey: 'recap.caption02',
    altKey: 'recap.altAudience',
    width: 800,
    height: 533,
  },
  {
    src: '/images/recap/03-speaker.webp',
    captionKey: 'recap.caption03',
    altKey: 'recap.altSpeaker',
    width: 800,
    height: 533,
  },
  {
    src: '/images/recap/04-mate.webp',
    captionKey: 'recap.caption04',
    altKey: 'recap.altMate',
    width: 800,
    height: 533,
  },
] as const

export function RecapSection() {
  const { t } = useTranslation()

  return (
    <Section id="recap" tone="pattern" className="scroll-mt-8">
      <Container>
        <SectionHeader
          eyebrow={t('recap.eyebrow')}
          title={t('recap.title')}
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {RECAP_PHOTOS.map((photo) => (
            <li key={photo.src}>
              <figure className="relative overflow-hidden rounded-lg bg-surface aspect-[4/3]">
                <img
                  src={photo.src}
                  alt={t(photo.altKey)}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 pb-2.5 pt-8 text-sm font-medium text-white">
                  {t(photo.captionKey)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
