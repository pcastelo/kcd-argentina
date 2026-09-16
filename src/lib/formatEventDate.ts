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

export function formatEventTimeRange(
  dateStart: string,
  dateEnd: string,
  timezone: string,
  locale = 'es-AR',
): string {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale.startsWith('en'),
    timeZone: timezone,
  }
  const formatter = new Intl.DateTimeFormat(locale, timeOptions)
  return `${formatter.format(new Date(dateStart))}–${formatter.format(new Date(dateEnd))}`
}
