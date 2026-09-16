import { useTranslation } from 'react-i18next'
import { getEvent } from '@/lib/event'
import { Container } from '@/components/Container'

const externalLinkClasses =
  'text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm'

export function Footer() {
  const { t } = useTranslation()
  const event = getEvent()

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-8">
        <p className="text-sm text-text-muted">{t('footer.tagline')}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span>
            {t('footer.contact')}:{' '}
            <a
              href={`mailto:${event.contactEmail}`}
              className={externalLinkClasses}
            >
              {event.contactEmail}
            </a>
          </span>
          <span>
            {t('footer.social')}:{' '}
            <a
              href={event.linktreeUrl}
              className={externalLinkClasses}
              rel="noopener noreferrer"
              target="_blank"
            >
              Linktree
            </a>
          </span>
          <a
            href="https://www.cncf.io/"
            className={externalLinkClasses}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('footer.cncf')}
          </a>
        </div>
        <p className="mt-4 text-xs text-text-muted">{t('footer.copyright')}</p>
      </Container>
    </footer>
  )
}
