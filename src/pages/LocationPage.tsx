import { Navigate, useParams } from 'react-router-dom'
import { DEFAULT_LOCALE, isValidLocale } from '@/lib/locale'

/** Legacy path → home location section. SEO for #local is owned by HomePage. */
export function LocationPage() {
  const { locale } = useParams<{ locale: string }>()
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE

  return <Navigate to={`/${validLocale}#local`} replace />
}
