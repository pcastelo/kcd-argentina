import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function RootLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        {t('a11y.skipToContent')}
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
