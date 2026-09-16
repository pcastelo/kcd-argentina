import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'

const navItems = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.agenda', to: '/' },
  { key: 'nav.speakers', to: '/' },
  { key: 'nav.sponsors', to: '/' },
  { key: 'nav.location', to: '/' },
] as const

const focusRingClasses =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'

const linkClasses = `text-text-muted hover:text-text ${focusRingClasses}`

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-center gap-4 py-4">
        <Link to="/" className={focusRingClasses}>
          <img
            src="/logo.png"
            alt="KCD Argentina 2026"
            className="h-10 w-10"
            width={40}
            height={40}
          />
        </Link>
        <nav className="flex flex-wrap gap-4" aria-label={t('nav.ariaLabel')}>
          {navItems.map((item) => (
            <Link key={item.key} to={item.to} className={linkClasses}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  )
}
