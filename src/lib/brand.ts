/** Brand assets under `public/images/`. Icon SVG: official `KCD 2026.svg` (hexagon, no text). */
export const brandAssets = {
  logoDark: '/images/kcd-logo-dark.png',
  icon: '/images/kcd-icon.svg',
  iconPng: '/images/kcd-icon.png',
} as const

export function getBrandIconSrc(): string {
  return brandAssets.icon
}
