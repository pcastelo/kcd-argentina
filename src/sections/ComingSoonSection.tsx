import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'

type ComingSoonSectionProps = {
  sectionId: string
  titleKey: string
}

export function ComingSoonSection({
  sectionId,
  titleKey,
}: ComingSoonSectionProps) {
  const { t } = useTranslation()

  return (
    <Section
      id={sectionId}
      className="scroll-mt-8 border-t border-border bg-surface/30"
    >
      <Container className="py-4 text-center">
        <h2 className="text-2xl font-bold text-text sm:text-3xl">
          {t(titleKey)}
        </h2>
        <p className="mt-3 text-text-muted">{t('common.comingSoon')}</p>
      </Container>
    </Section>
  )
}
