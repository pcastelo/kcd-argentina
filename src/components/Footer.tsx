import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { getEvent } from '@/lib/event'
import { Container } from '@/components/Container'
import { DEFAULT_LOCALE, isValidLocale, localePath } from '@/lib/locale'
import { InstagramIcon, LinkedInIcon, LinktreeIcon, MeetupIcon } from '@/components/icons'

const externalLinkClasses =
  'text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm'

const internalLinkClasses =
  'text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm'

const socialIconLinkClasses =
  'text-primary hover:text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-sm'

const PLATFORM_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  meetup: MeetupIcon,
}

export function Footer() {
  const { t } = useTranslation()
  const event = getEvent()
  const { locale: localeParam } = useParams<{ locale: string }>()
  const locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE

  const socialLinks = event.socialLinks?.filter(
    (link) => link.platform in PLATFORM_ICONS,
  )

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
        {socialLinks && socialLinks.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-text-muted">{t('footer.followUs')}:</span>
            {socialLinks.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform]
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  className={socialIconLinkClasses}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={t('footer.socialAriaLabel', {
                    platform: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
                  })}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
            <a
              href={event.linktreeUrl}
              className={socialIconLinkClasses}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Linktree"
            >
              <LinktreeIcon className="h-5 w-5" />
            </a>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-text-muted">{t('footer.copyright')}</p>
      </Container>
    </footer>
  )
}
