import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { DEFAULT_LOCALE, isValidLocale, localePath } from '@/lib/locale'

export function NotFoundPage() {
  const { t } = useTranslation()
  const { locale: localeParam } = useParams<{ locale: string }>()
  const locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE

  return (
    <section className="flex min-h-[calc(100dvh-12rem)] items-center bg-bg">
      <Container className="py-16 text-center sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
          {t('common.notFoundTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-text-muted sm:text-lg">
          {t('common.notFoundBody')}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={localePath(locale)} variant="primary" openInNewTab={false}>
            {t('common.notFoundHome')}
          </Button>
          <Link
            to={localePath(locale, undefined, 'agenda')}
            className="rounded-md px-4 py-2 text-sm font-medium text-primary hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {t('nav.agenda')}
          </Link>
          <Link
            to={localePath(locale, undefined, 'speakers')}
            className="rounded-md px-4 py-2 text-sm font-medium text-primary hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {t('nav.speakers')}
          </Link>
        </div>
      </Container>
    </section>
  )
}
