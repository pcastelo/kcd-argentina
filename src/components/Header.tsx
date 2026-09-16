import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Container } from '@/components/Container'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { DEFAULT_LOCALE, isValidLocale, localePath } from '@/lib/locale'

const navItems = [
  { key: 'nav.home', segment: undefined },
  { key: 'nav.agenda', segment: 'agenda' },
  { key: 'nav.speakers', segment: 'speakers' },
  { key: 'nav.sponsors', segment: 'sponsors' },
  { key: 'nav.location', segment: 'location' },
] as const

const focusRingClasses =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'

const linkClasses = `text-text-muted hover:text-text ${focusRingClasses}`

export function Header() {
  const { t } = useTranslation()
  const { locale: localeParam } = useParams<{ locale: string }>()
  const locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE

  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-center gap-4 py-4">
        <Link to={localePath(locale)} className={focusRingClasses}>
          <img
            src="/logo.png"
            alt="KCD Argentina 2026"
            className="h-10 w-10"
            width={40}
            height={40}
          />
        </Link>
        <nav
          className="flex flex-1 flex-wrap items-center gap-4"
          aria-label={t('nav.ariaLabel')}
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={localePath(locale, item.segment)}
              className={linkClasses}
            >
              {t(item.key)}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      </Container>
    </header>
  )
}
