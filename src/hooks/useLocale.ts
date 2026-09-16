import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import i18n from '@/lib/i18n'
import {
  DEFAULT_LOCALE,
  isValidLocale,
  localePath,
  type Locale,
} from '@/lib/locale'

export function useLocale(): Locale {
  const { locale } = useParams<{ locale: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!locale) {
      navigate(localePath(DEFAULT_LOCALE), { replace: true })
      return
    }

    if (!isValidLocale(locale)) {
      const segments = location.pathname.split('/').filter(Boolean)
      segments.shift()
      navigate(localePath(DEFAULT_LOCALE, segments.join('/') || undefined), {
        replace: true,
      })
      return
    }

    void i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale, location.pathname, navigate])

  return isValidLocale(locale) ? locale : DEFAULT_LOCALE
}
