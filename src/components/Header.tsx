import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Container } from '@/components/Container'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getBrandIconSrc } from '@/lib/brand'
import { DEFAULT_LOCALE, isValidLocale, localePath } from '@/lib/locale'

const navItems = [
  { key: 'nav.home', hash: undefined },
  { key: 'nav.agenda', hash: 'agenda' },
  { key: 'nav.speakers', hash: 'speakers' },
  { key: 'nav.sponsors', hash: 'sponsors' },
  { key: 'nav.location', hash: 'local' },
  { key: 'nav.organizers', hash: 'organizers' },
] as const

const focusRingClasses =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'

const linkClasses = `text-text-muted hover:text-text ${focusRingClasses}`

function isNavItemCurrent(
  hash: string | undefined,
  locationHash: string,
): boolean {
  const normalized = locationHash === '#' ? '' : locationHash
  if (!hash) {
    return normalized === '' || normalized === '#home'
  }
  return normalized === `#${hash}`
}

export function Header() {
  const { t } = useTranslation()
  const { locale: localeParam } = useParams<{ locale: string }>()
  const { hash } = useLocation()
  const locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE

  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-center gap-4 py-4">
        <Link to={localePath(locale)} className={focusRingClasses}>
          <img
            src={getBrandIconSrc()}
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
          {navItems.map((item) => {
            const current = isNavItemCurrent(item.hash, hash)
            return (
              <Link
                key={item.key}
                to={localePath(locale, undefined, item.hash)}
                className={linkClasses}
                aria-current={current ? 'page' : undefined}
              >
                {t(item.key)}
              </Link>
            )
          })}
          <LanguageSwitcher />
        </nav>
      </Container>
    </header>
  )
}
