/** Brand assets under `public/images/`. */
export const brandAssets = {
  logoDark: '/images/kcd-logo-buenos-aires-2026.png',
  icon: '/images/kcd-icon.png',
  iconPng: '/images/kcd-icon.png',
} as const

export function getBrandIconSrc(): string {
  return brandAssets.iconPng
}
