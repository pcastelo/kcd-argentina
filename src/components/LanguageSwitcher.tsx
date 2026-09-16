import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DEFAULT_LOCALE, isValidLocale, swapLocale } from '@/lib/locale'

const focusRingClasses =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'

export function LanguageSwitcher() {
  const { locale } = useParams<{ locale: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const currentLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  const alternatePath = swapLocale(location.pathname, currentLocale)

  return (
    <button
      type="button"
      className={`min-h-11 min-w-11 border border-border px-3 text-sm text-text hover:text-primary ${focusRingClasses}`}
      aria-label={t('languageSwitcher.label')}
      onClick={() => navigate(`${alternatePath}${location.hash}`)}
    >
      {t('languageSwitcher.switchTo')}
    </button>
  )
}
