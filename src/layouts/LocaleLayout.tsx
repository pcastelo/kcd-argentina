import { Outlet } from 'react-router-dom'
import { useHashScroll } from '@/hooks/useHashScroll'
import { useLocale } from '@/hooks/useLocale'

export function LocaleLayout() {
  useLocale()
  useHashScroll()

  return <Outlet />
}
