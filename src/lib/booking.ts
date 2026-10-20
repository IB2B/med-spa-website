// Booking rules shared by the booking section (browser) and /api/booking/* (server): meeting length,
// validation schema, tracking and error codes. Adapted from the TORCH site (crm-lp/src/lib/booking.ts):
// same calendar and slot rules, shorter form for clinic owners.
import { z } from "zod"

import { isValidEmail } from "@/lib/email"
import { isLocale, locales } from "@/i18n/config"

/** Length of a booking call, in minutes (matches the calendar's slot length). */
export const MEETING_MINUTES = 30
/** How far ahead visitors can book. The free-slots API allows at most 31 days per request. */
export const BOOKING_DAYS = 30

/** Every booking from this page is tagged with this, so the CRM can tell it apart from TORCH bookings. */
export const BOOKING_SOURCE = "medspa-landing"

/** URL parameters kept with the booking (appointment note) when present. */
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const

/**
 * "Monthly revenue" options. These values are what the CRM receives (tag + note), so never translate
 * them; the page translates the labels instead.
 */
export const REVENUE_OPTIONS = ["under-10k", "10-30k", "30-60k", "60k-plus"] as const
export type RevenueOption = (typeof REVENUE_OPTIONS)[number]

/** True for a timezone the runtime knows, e.g. "Europe/Rome". */
export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 64) return false
  try {
    new Intl.DateTimeFormat("en", { timeZone: value })
    return true
  } catch {
    return false
  }
}

/**
 * International phone number: "+", country code, then digits (E.164: 8 to 15 digits in total).
 * Spaces, dashes, dots and brackets are removed first.
 */
export function normalizePhone(value: string): string {
  return value.replace(/[\s\-.()]/g, "")
}
export function isValidPhone(value: unknown): value is string {
  return typeof value === "string" && /^\+[1-9]\d{7,14}$/.test(normalizePhone(value))
}

/** "Anna Maria Rossi" → { firstName: "Anna", lastName: "Maria Rossi" }. */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/)
  return { firstName, lastName: rest.join(" ") }
}

/** Every reason a booking can fail; the page shows a translated message for each. */
export type BookingErrorCode = "invalid" | "slot_taken" | "rate_limited" | "unavailable" | "failed"

/** Field-level problems the form can show next to a field. */
export type BookingFieldError = "required" | "invalid" | "too_long"

const text = (max: number) =>
  z
    .string({ error: "required" })
    .trim()
    .min(1, { error: "required" })
    .max(max, { error: "too_long" })

export const bookingSchema = z.object({
  fullName: text(120),
  clinic: text(120),
  email: z
    .string({ error: "required" })
    .trim()
    .toLowerCase()
    .min(1, { error: "required" })
    .refine(isValidEmail, { error: "invalid" }),
  phone: z
    .string({ error: "required" })
    .trim()
    .min(1, { error: "required" })
    .refine(isValidPhone, { error: "invalid" })
    .transform(normalizePhone),
  revenue: z.enum(REVENUE_OPTIONS).optional(),
  /** Slot start as an ISO date string (any offset). */
  slot: z
    .string({ error: "required" })
    .refine((v) => !Number.isNaN(Date.parse(v)), { error: "invalid" }),
  timezone: z.string().refine(isValidTimeZone, { error: "invalid" }),
  lang: z.string().refine(isLocale, { error: "invalid" }).optional().default(locales[0]),
  /** utm_* values from the page URL (unknown keys are dropped, values capped). */
  utm: z
    .partialRecord(z.enum(UTM_KEYS), z.string().trim().max(200))
    .optional()
    .default({}),
  /** Honeypot: hidden from people, bots fill it in. Must stay empty. */
  website: z.string().optional().default(""),
})

export type BookingInput = z.input<typeof bookingSchema>
export type BookingData = z.output<typeof bookingSchema>

/** Zod issues → { field: code } (first problem per field). */
export function fieldErrors(error: z.ZodError): Partial<Record<keyof BookingData, BookingFieldError>> {
  const out: Partial<Record<keyof BookingData, BookingFieldError>> = {}
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof BookingData | undefined
    if (!field || out[field]) continue
    const code = issue.message as BookingFieldError
    out[field] = code === "required" || code === "too_long" ? code : "invalid"
  }
  return out
}

/** Response of POST /api/booking/create. */
export type BookingResponse =
  | { ok: true; start: string; end: string }
  | { ok: false; code: BookingErrorCode; fields?: Partial<Record<keyof BookingData, BookingFieldError>> }

/** Response of GET /api/booking/slots. */
export type SlotsResponse = { ok: true; slots: string[] } | { ok: false; code: BookingErrorCode }
