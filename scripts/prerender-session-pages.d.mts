// Mirrors SessionMeta in src/lib/sessionMeta.ts (not imported: the node
// tsconfig cannot resolve that module's JSON imports).
export type SessionPageMeta = {
  path: string
  url: string
  title: string
  description: string
  image: string
  imageAlt: string
  twitterCard: string
  locale: string
}

export function renderSessionHtml(
  indexHtml: string,
  meta: SessionPageMeta,
  siteName: string,
): string

