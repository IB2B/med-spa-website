// Copied from the TORCH site (crm-lp/src/app/api/booking/slots/route.ts): same calendar, same rules.
import { BOOKING_DAYS, isValidTimeZone, type SlotsResponse } from "@/lib/booking"
import { GhlError, getFreeSlots, ghlBookingConfig } from "@/lib/ghl"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { isSameSite } from "@/lib/request-guard"

const DAY = 24 * 60 * 60 * 1000

function reply(body: SlotsResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

/** "1767225600000" or "2026-01-01T00:00:00Z" → ms, or NaN. */
function toMs(value: string | null): number {
  if (!value) return NaN
  return /^\d+$/.test(value) ? Number(value) : Date.parse(value)
}

// GET /api/booking/slots?start=&end=&timezone=
// start/end: milliseconds or ISO dates (default: now → BOOKING_DAYS ahead). The range is clamped to
// [now, now + BOOKING_DAYS]. Returns free slot start times as ISO strings in the given timezone.
export async function GET(request: Request) {
  const config = ghlBookingConfig()
  if (!config) return reply({ ok: false, code: "unavailable" }, 503)

  // Each request costs a GHL API call: only our own booking page may ask (see src/lib/request-guard.ts).
  if (!isSameSite(request)) {
    console.warn("[booking/slots] cross-site request rejected")
    return reply({ ok: false, code: "failed" }, 403)
  }

  // Generous limit: the page loads slots once, plus a refresh if a slot gets taken.
  if (!rateLimit(`slots:${clientIp(request)}`, 60, 10 * 60 * 1000)) {
    console.warn("[booking/slots] rate limited")
    return reply({ ok: false, code: "rate_limited" }, 429)
  }

  const params = new URL(request.url).searchParams
  const timezone = params.get("timezone") ?? "UTC"
  if (!isValidTimeZone(timezone)) return reply({ ok: false, code: "invalid" }, 400)

  const now = Date.now()
  const latest = now + BOOKING_DAYS * DAY
  const startParam = toMs(params.get("start"))
  const endParam = toMs(params.get("end"))
  const start = Math.max(now, Number.isNaN(startParam) ? now : startParam)
  const end = Math.min(latest, Number.isNaN(endParam) ? latest : endParam)
  if (end <= start) return reply({ ok: true, slots: [] })

  try {
    const slots = await getFreeSlots(config, new Date(start), new Date(end), timezone)
    // GHL can return slots that already started today; only offer future ones.
    return reply({ ok: true, slots: slots.filter((s) => Date.parse(s) > now) })
  } catch (e) {
    console.error("[booking/slots]", e instanceof GhlError ? `${e.message} ${e.body}` : e)
    return reply({ ok: false, code: "failed" }, 502)
  }
}
