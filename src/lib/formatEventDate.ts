export function formatEventDate(
  isoDate: string,
  timezone: string,
  locale = 'es-AR',
): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: timezone,
  }).format(new Date(isoDate))
}
