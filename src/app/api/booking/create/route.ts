import { checkBotId } from "botid/server"

import {
  BOOKING_SOURCE,
  MEETING_MINUTES,
  bookingSchema,
  fieldErrors,
  splitName,
  type BookingData,
  type BookingResponse,
} from "@/lib/booking"
import {
  GhlError,
  addAppointmentNote,
  addContactTags,
  createAppointment,
  findExistingContact,
  getFreeSlots,
  ghlBookingConfig,
  upsertContact,
} from "@/lib/ghl"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { isJson, isSameSite } from "@/lib/request-guard"

const HOUR = 60 * 60 * 1000

function reply(body: BookingResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

/** Appointment note: where the booking came from, revenue band, and (for an existing contact) what was typed. */
function bookingNote(data: BookingData, existing: boolean) {
  const lines = [`Source: ${BOOKING_SOURCE}`]
  for (const [key, value] of Object.entries(data.utm)) if (value) lines.push(`${key}: ${value}`)
  lines.push(`Monthly revenue: ${data.revenue ?? "not given"}`)
  if (existing) {
    lines.push(
      "",
      "Booked with an email or phone that matches this contact. Details typed in the form (not saved to the contact):",
      `Name: ${data.fullName}`,
      `Clinic: ${data.clinic}`,
      `Email: ${data.email}`,
      `WhatsApp: ${data.phone}`
    )
  }
  return lines.join("\n")
}

/** Is this exact start time still in the calendar's free slots? */
async function slotStillFree(config: NonNullable<ReturnType<typeof ghlBookingConfig>>, startMs: number, timezone: string) {
  // Look a few hours around the slot; compare instants, not strings (offsets can differ).
  const slots = await getFreeSlots(config, new Date(startMs - 12 * HOUR), new Date(startMs + 12 * HOUR), timezone)
  return slots.some((s) => Date.parse(s) === startMs)
}

// POST /api/booking/create
// Same flow as the TORCH site's /api/booking (crm-lp/src/app/api/booking/route.ts): validate, re-check
// the slot, find or create the contact, tag it, create a confirmed appointment on GHL_CALENDAR_ID.
// Differences: the med spa form fields, the "medspa-landing" source/tag, and utm_* + revenue in the note.
export async function POST(request: Request) {
  const config = ghlBookingConfig()
  if (!config) return reply({ ok: false, code: "unavailable" }, 503)

  // Only our own page may post here (see src/lib/request-guard.ts), and not bots (Vercel BotID).
  if (!isSameSite(request) || !isJson(request)) {
    console.warn("[booking/create] cross-site or non-JSON request rejected")
    return reply({ ok: false, code: "failed" }, 403)
  }
  if ((await checkBotId()).isBot) {
    console.warn("[booking/create] BotID flagged a bot, rejected")
    return reply({ ok: false, code: "failed" }, 403)
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return reply({ ok: false, code: "invalid" }, 400)
  }

  const parsed = bookingSchema.safeParse(raw)
  if (!parsed.success) return reply({ ok: false, code: "invalid", fields: fieldErrors(parsed.error) }, 400)
  const data = parsed.data

  // Honeypot filled in: a bot. Answer like a success so it doesn't retry, but do nothing.
  if (data.website) {
    console.warn("[booking/create] honeypot filled, ignored")
    const end = new Date(Date.parse(data.slot) + MEETING_MINUTES * 60_000).toISOString()
    return reply({ ok: true, start: new Date(data.slot).toISOString(), end })
  }

  if (!rateLimit(`booking:${clientIp(request)}`, 5, HOUR)) {
    console.warn("[booking/create] rate limited")
    return reply({ ok: false, code: "rate_limited" }, 429)
  }

  const startMs = Date.parse(data.slot)
  if (startMs <= Date.now()) return reply({ ok: false, code: "slot_taken" }, 409)
  const start = new Date(startMs).toISOString()
  const end = new Date(startMs + MEETING_MINUTES * 60_000).toISOString()
  const { firstName, lastName } = splitName(data.fullName)

  try {
    if (!(await slotStillFree(config, startMs, data.timezone))) {
      return reply({ ok: false, code: "slot_taken" }, 409)
    }

    // Anyone can type any email or phone here, so an existing contact is never updated from the form:
    // the booking goes on that contact as it is, and the typed details go into the appointment note.
    const existingId = await findExistingContact(config, { email: data.email, phone: data.phone })
    let contactId = existingId
    if (!contactId) {
      const contact = await upsertContact(config, {
        firstName,
        lastName: lastName || undefined,
        companyName: data.clinic,
        email: data.email,
        phone: data.phone,
        timezone: data.timezone,
        source: BOOKING_SOURCE,
      })
      contactId = contact.id
    }

    const tags = [BOOKING_SOURCE, "website-booking"]
    if (data.revenue) tags.push(`revenue-${data.revenue}`)
    await addContactTags(config, contactId, tags)

    let appointment
    try {
      appointment = await createAppointment(config, {
        contactId,
        startTime: start,
        endTime: end,
        title: `Med spa clinic analysis – ${data.clinic} – ${data.fullName}`,
      })
    } catch (e) {
      // The calendar validates the slot too: if someone booked it in the last seconds, it refuses with 4xx.
      if (e instanceof GhlError && e.status >= 400 && e.status < 500 && /slot|available|book/i.test(e.body)) {
        console.warn("[booking/create] slot refused by the calendar:", e.body)
        return reply({ ok: false, code: "slot_taken" }, 409)
      }
      throw e
    }

    // The note is a nice-to-have: if it fails, the booking still stands.
    await addAppointmentNote(config, appointment.id, bookingNote(data, Boolean(existingId))).catch((e) =>
      console.error("[booking/create] note failed:", e instanceof GhlError ? `${e.message} ${e.body}` : e)
    )

    return reply({ ok: true, start, end })
  } catch (e) {
    console.error("[booking/create]", e instanceof GhlError ? `${e.message} ${e.body}` : e)
    return reply({ ok: false, code: "failed" }, 502)
  }
}
