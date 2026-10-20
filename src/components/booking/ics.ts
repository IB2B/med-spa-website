// Builds a one-event .ics file (RFC 5545) for "Download .ics" and the Google Calendar link.
// Adapted from the TORCH site (crm-lp/src/components/booking/ics.ts).

function icsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function icsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n")
}

type CalendarEvent = { start: string; end: string; title: string; description: string }

export function downloadIcs({ start, end, title, description }: CalendarEvent) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Intelligent B2B//Med spa booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsDate(start)}-medspa-call@intelligentb2b.com`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(title)}`,
    `DESCRIPTION:${icsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "clinic-analysis-call.ics"
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** "Add to Google Calendar" link for the same event. */
export function googleCalendarUrl({ start, end, title, description }: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${icsDate(start)}/${icsDate(end)}`,
    details: description,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
