import { Navigate, useParams } from 'react-router-dom'
import { DEFAULT_LOCALE, isValidLocale } from '@/lib/locale'

type HashRedirectPageProps = {
  hash: string
}

export function HashRedirectPage({ hash }: HashRedirectPageProps) {
  const { locale } = useParams<{ locale: string }>()
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE

  return <Navigate to={`/${validLocale}#${hash}`} replace />
}
