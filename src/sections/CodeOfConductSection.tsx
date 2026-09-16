import { useTranslation } from 'react-i18next'
import { MarkdownContent } from '@/components/MarkdownContent'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { getCodeOfConductMarkdown } from '@/lib/codeOfConduct'
import { getEvent } from '@/lib/event'

export function CodeOfConductSection() {
  const { t, i18n } = useTranslation()
  const event = getEvent()
  const content = getCodeOfConductMarkdown(i18n.language)

  return (
    <Section id="conduct" tone="plain" className="scroll-mt-8">
      <Container className="max-w-3xl">
        <SectionHeader eyebrow={t('conduct.eyebrow')} title={t('conduct.title')} />
        <MarkdownContent content={content} className="mt-8" />
        <p className="mt-8 text-center text-sm text-text-muted">
          {t('conduct.reportIntro')}{' '}
          <a
            href={`mailto:${event.contactEmail}`}
            className="text-primary hover:text-primary/90 underline"
          >
            {event.contactEmail}
          </a>
        </p>
      </Container>
    </Section>
  )
}
