// Date helpers for the booking page. Slot times are instants (ISO strings); everything the visitor
// sees is formatted in the timezone they chose. Calendar days are plain "YYYY-MM-DD" keys.

/** Instant → "YYYY-MM-DD" in a timezone. */
export function dayKey(value: string | number | Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(value)
  )
}

/** Instant → "HH:MM" (24-hour) in a timezone; lines up the same time of day across days. */
export function clockKey(value: string | number | Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(value)
  )
}

/** "YYYY-MM-DD" → a Date at noon UTC (safe to format with timeZone "UTC"). */
export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(Date.UTC(y!, m! - 1, d!, 12))
}

export function formatTime(value: string | number | Date, timeZone: string, lang: string): string {
  return new Intl.DateTimeFormat(lang, { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date(value))
}

/** e.g. "Thursday 14 October" in the page language. */
export function formatDay(key: string, lang: string): string {
  return new Intl.DateTimeFormat(lang, { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
    keyToDate(key)
  )
}

/** Long date of an instant in a timezone, e.g. "Thursday 14 October 2026". */
export function formatLongDate(value: string | number | Date, timeZone: string, lang: string): string {
  return new Intl.DateTimeFormat(lang, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

/** "Europe/Rome" → "Europe/Rome (GMT+2)" in the page language. */
export function timeZoneLabel(timeZone: string, lang: string): string {
  try {
    const offset = new Intl.DateTimeFormat(lang, { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value
    return offset ? `${timeZone.replace(/_/g, " ")} (${offset})` : timeZone.replace(/_/g, " ")
  } catch {
    return timeZone
  }
}

/** Every IANA timezone the browser knows (falls back to a short list on old browsers). */
export function allTimeZones(current: string): string[] {
  const intl = Intl as unknown as { supportedValuesOf?: (key: "timeZone") => string[] }
  const list = intl.supportedValuesOf?.("timeZone") ?? [
    "UTC",
    "Europe/London",
    "Europe/Rome",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Bucharest",
    "Africa/Casablanca",
    "Asia/Dubai",
    "Asia/Riyadh",
    "America/New_York",
  ]
  return list.includes(current) ? list : [current, ...list]
}

/** The visitor's timezone from the browser, or UTC. */
export function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}
