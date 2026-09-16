import { Outlet } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'

export function LocaleLayout() {
  useLocale()

  return <Outlet />
}
