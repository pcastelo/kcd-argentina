import { useTranslation } from 'react-i18next'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { getOrganizers } from '@/lib/organizers'

export function OrganizersSection() {
  const { t } = useTranslation()
  const organizers = getOrganizers()

  return (
    <Section id="organizers" tone="surface" className="scroll-mt-8">
      <Container>
        <SectionHeader
          eyebrow={t('organizers.eyebrow')}
          subtitle={t('organizers.subtitle')}
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizers.map((organizer) => {
            const isPlaceholder = organizer.placeholder === true
            const displayName = isPlaceholder
              ? t('organizers.pendingName')
              : organizer.name
            const displayRole = isPlaceholder
              ? t('organizers.pendingRole')
              : organizer.role ?? null
            const avatarLabel = isPlaceholder
              ? t('organizers.pendingAvatar')
              : organizer.name.charAt(0)

            return (
            <li key={organizer.slug}>
              <Card
                className={`h-full p-6 pt-8 text-center${isPlaceholder ? ' border-dashed opacity-80' : ''}`}
              >
                {organizer.photo ? (
                  <img
                    src={organizer.photo}
                    alt={displayName}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                    loading="lazy"
                    width={96}
                    height={96}
                  />
                ) : (
                  <div
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-bg text-2xl font-bold text-primary"
                    aria-hidden="true"
                  >
                    {avatarLabel}
                  </div>
                )}
                <h3 className="mt-4 text-lg font-semibold text-text">
                  {!isPlaceholder && organizer.linkedin ? (
                    <a
                      href={organizer.linkedin}
                      className="rounded-sm text-text hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                      aria-label={t('organizers.profileAriaLabel', {
                        name: organizer.name,
                      })}
                    >
                      {displayName}
                    </a>
                  ) : (
                    displayName
                  )}
                </h3>
                {displayRole ? (
                  <p className="mt-1 text-sm text-primary">{displayRole}</p>
                ) : null}
                {!isPlaceholder && organizer.company ? (
                  <p className="mt-2 text-sm text-text-muted">
                    {organizer.company}
                  </p>
                ) : null}
              </Card>
            </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
