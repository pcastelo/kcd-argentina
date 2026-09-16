export function formatAgendaClockTime(
  isoDate: string,
  timezone: string,
  locale = 'es-AR',
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale.startsWith('en'),
    timeZone: timezone,
  }).format(new Date(isoDate))
}

export function formatAgendaTimeRange(
  dateStart: string,
  dateEnd: string,
  timezone: string,
  locale = 'es-AR',
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale.startsWith('en'),
    timeZone: timezone,
  })

  return `${formatter.format(new Date(dateStart))} - ${formatter.format(new Date(dateEnd))}`
}
