import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { getEvent } from '@/lib/event'
import { Container } from '@/components/Container'
import { DEFAULT_LOCALE, isValidLocale, localePath } from '@/lib/locale'

const externalLinkClasses =
  'text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm'

const internalLinkClasses =
  'text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm'

export function Footer() {
  const { t } = useTranslation()
  const event = getEvent()
  const { locale: localeParam } = useParams<{ locale: string }>()
  const locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE

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
          <Link
            to={localePath(locale, undefined, 'organizers')}
            className={internalLinkClasses}
          >
            {t('footer.organizers')}
          </Link>
          <Link
            to={localePath(locale, undefined, 'conduct')}
            className={internalLinkClasses}
          >
            {t('footer.conduct')}
          </Link>
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
