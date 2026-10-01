import { useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { absoluteUrl, ogImageUrl, ogLocale } from '@/lib/seo'

type SEOHeadProps = {
  path: string
  locale: 'es' | 'en'
  image?: string
  imageAlt?: string
  twitterCard?: 'summary' | 'summary_large_image'
} & (
  | { titleKey: string; descriptionKey: string; title?: never; description?: never }
  | { title: string; description: string; titleKey?: never; descriptionKey?: never }
)

export function SEOHead({
  titleKey,
  descriptionKey,
  path,
  locale,
  image = ogImageUrl(),
  imageAlt,
  twitterCard = 'summary_large_image',
  ...props
}: SEOHeadProps) {
  const { t } = useTranslation()
  // Force lng from the route locale so first paint does not wait on i18n.changeLanguage.
  const title = titleKey ? t(titleKey, { lng: locale }) : props.title!
  const description = descriptionKey
    ? t(descriptionKey, { lng: locale })
    : props.description!
  const canonical = absoluteUrl(path)
  const siteName = t('seo.ogSiteName', { lng: locale })

  // Remove no-JS fallback tags from index.html so Helmet can own locale-specific meta.
  useLayoutEffect(() => {
    document
      .querySelectorAll('[data-seo-fallback]')
      .forEach((node) => node.remove())
  }, [])

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      {imageAlt ? <meta property="og:image:alt" content={imageAlt} /> : null}
      <meta property="og:locale" content={ogLocale(locale)} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
