import cocEn from '../../content/code-of-conduct.en.md?raw'
import cocEs from '../../content/code-of-conduct.es.md?raw'

export function getCodeOfConductMarkdown(locale: string): string {
  return locale === 'en' ? cocEn : cocEs
}
