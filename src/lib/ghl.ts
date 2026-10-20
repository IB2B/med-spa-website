// All GoHighLevel (LeadConnector) API v2 calls used by the booking page and the newsletter, in one
// server-only module. Endpoints, Version headers and fields are checked against HighLevel's official
// OpenAPI specs (github.com/GoHighLevel/highlevel-api-docs, apps/calendars.json, contacts.json, locations.json).
//
// The token and IDs come from server environment variables (no NEXT_PUBLIC_ prefix), so they never
// reach the browser. Only import this file from route handlers and server components.
//
// Private Integration scopes needed: calendars.readonly, calendars/events.write, contacts.readonly,
// contacts.write, locations/customFields.readonly.

const BASE_URL = "https://services.leadconnectorhq.com"

// Each API group has its own Version header value (from the specs).
const CALENDARS_VERSION = "2021-04-15"
const CONTACTS_VERSION = "2021-07-28"
const LOCATIONS_VERSION = "2021-07-28"

const TIMEOUT_MS = 10_000

/** Enough for contact calls (booking and newsletter). */
export type GhlAuth = { token: string; locationId: string }
/** Booking also needs the calendar. */
export type GhlConfig = GhlAuth & { calendarId: string }

/** The three booking variables, or null when any is missing (the booking API then answers 503). */
export function ghlBookingConfig(): GhlConfig | null {
  const token = process.env.GHL_PRIVATE_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  const calendarId = process.env.GHL_CALENDAR_ID
  return token && locationId && calendarId ? { token, locationId, calendarId } : null
}

/** A failed GHL call. `status` is the HTTP status (0 for network errors or timeouts). */
export class GhlError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string
  ) {
    super(message)
    this.name = "GhlError"
  }
}

async function ghl<T>(
  config: GhlAuth,
  path: string,
  init: { method?: "GET" | "POST"; version: string; body?: unknown; query?: Record<string, string> }
): Promise<T> {
  const url = new URL(path, BASE_URL)
  for (const [key, value] of Object.entries(init.query ?? {})) url.searchParams.set(key, value)

  let res: Response
  try {
    res = await fetch(url, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Version: init.version,
        Accept: "application/json",
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (e) {
    throw new GhlError(`${init.method ?? "GET"} ${path}: ${e instanceof Error ? e.message : "request failed"}`, 0, "")
  }

  const text = await res.text()
  if (!res.ok) throw new GhlError(`${init.method ?? "GET"} ${path}: HTTP ${res.status}`, res.status, text.slice(0, 2000))
  try {
    return (text ? JSON.parse(text) : {}) as T
  } catch {
    throw new GhlError(`${init.method ?? "GET"} ${path}: invalid JSON`, res.status, text.slice(0, 2000))
  }
}

/* ---------- Calendars ---------- */

/** GET /calendars/{calendarId}/free-slots → { "2024-10-28": { slots: ["2024-10-28T10:00:00-05:00", …] }, … } */
type FreeSlotsResponse = Record<string, { slots?: string[] } | string | undefined>

/**
 * Free slot start times (ISO strings with offset) between two instants, in the given IANA timezone.
 * The API allows at most 31 days per request.
 */
export async function getFreeSlots(config: GhlConfig, start: Date, end: Date, timezone: string): Promise<string[]> {
  const data = await ghl<FreeSlotsResponse>(config, `/calendars/${encodeURIComponent(config.calendarId)}/free-slots`, {
    version: CALENDARS_VERSION,
    query: { startDate: String(start.getTime()), endDate: String(end.getTime()), timezone },
  })
  // Keys are dates; other keys (e.g. traceId) are skipped.
  const slots: string[] = []
  for (const [key, value] of Object.entries(data)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || typeof value !== "object" || !value?.slots) continue
    slots.push(...value.slots)
  }
  return slots.sort((a, b) => Date.parse(a) - Date.parse(b))
}

export type AppointmentInput = {
  contactId: string
  startTime: string
  endTime: string
  title: string
}

type AppointmentResponse = { id: string; calendarId: string; contactId: string; startTime?: string; endTime?: string }

/** POST /calendars/events/appointments, status "confirmed". GHL also checks the slot is free. */
export async function createAppointment(config: GhlConfig, input: AppointmentInput): Promise<AppointmentResponse> {
  return ghl<AppointmentResponse>(config, "/calendars/events/appointments", {
    method: "POST",
    version: CALENDARS_VERSION,
    body: {
      calendarId: config.calendarId,
      locationId: config.locationId,
      contactId: input.contactId,
      startTime: input.startTime,
      endTime: input.endTime,
      title: input.title,
      appointmentStatus: "confirmed",
    },
  })
}

/** POST /calendars/appointments/{appointmentId}/notes (body max 5000 characters). */
export async function addAppointmentNote(config: GhlConfig, appointmentId: string, body: string): Promise<void> {
  await ghl(config, `/calendars/appointments/${encodeURIComponent(appointmentId)}/notes`, {
    method: "POST",
    version: CALENDARS_VERSION,
    body: { body: body.slice(0, 5000) },
  })
}

/* ---------- Contacts ---------- */

// Anyone can type any email into a public form, so form data must never overwrite an existing
// contact (its name, phone, tags…). The forms first look for an existing contact with
// findExistingContact, and only create one with upsertContact when there is none.

type DuplicateContactResponse = { contact?: { id?: string } | null }

/**
 * GET /contacts/search/duplicate: the contact GHL would match for this email (and phone), using the
 * location's "Allow Duplicate Contact" rules, i.e. the same matching upsert uses. Null when there is none.
 */
export async function findExistingContact(config: GhlAuth, match: { email: string; phone?: string }): Promise<string | null> {
  const data = await ghl<DuplicateContactResponse>(config, "/contacts/search/duplicate", {
    version: CONTACTS_VERSION,
    query: { locationId: config.locationId, email: match.email, ...(match.phone ? { number: match.phone } : {}) },
  })
  // The response isn't described in the spec. If it ever changes shape, stop here rather than
  // fall through to an upsert that could overwrite an existing contact.
  if (!("contact" in data)) {
    throw new GhlError("GET /contacts/search/duplicate: unexpected response", 200, JSON.stringify(data).slice(0, 2000))
  }
  return data.contact?.id ?? null
}

export type ContactInput = {
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  timezone?: string
  source?: string
  customFields?: { id: string; field_value: string }[]
}

type UpsertContactResponse = { new?: boolean; contact: { id: string } }

/**
 * POST /contacts/upsert. Only call it after findExistingContact found nothing: on an existing contact
 * it would overwrite the fields sent. Tags are NOT sent here (on upsert they replace all of a contact's
 * tags); use addContactTags instead.
 */
export async function upsertContact(config: GhlAuth, input: ContactInput): Promise<{ id: string; isNew: boolean }> {
  const data = await ghl<UpsertContactResponse>(config, "/contacts/upsert", {
    method: "POST",
    version: CONTACTS_VERSION,
    body: { locationId: config.locationId, ...input },
  })
  if (!data.contact?.id) throw new GhlError("POST /contacts/upsert: no contact id in response", 200, JSON.stringify(data).slice(0, 2000))
  return { id: data.contact.id, isNew: Boolean(data.new) }
}

/** POST /contacts/{contactId}/tags: adds tags, keeps the ones the contact already has. */
export async function addContactTags(config: GhlAuth, contactId: string, tags: string[]): Promise<void> {
  await ghl(config, `/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "POST",
    version: CONTACTS_VERSION,
    body: { tags },
  })
}

/* ---------- Custom fields ---------- */

type CustomFieldsResponse = { customFields?: { id: string; fieldKey?: string; name?: string }[] }

// Field IDs don't change, so each one is looked up once per server instance.
const customFieldIds = new Map<string, string>()

/**
 * ID of a contact custom field by its key, e.g. "plan_interest" (GHL stores it as "contact.plan_interest").
 * GET /locations/{locationId}/customFields?model=contact. Null when the field doesn't exist.
 */
export async function getContactCustomFieldId(config: GhlConfig, key: string): Promise<string | null> {
  const cached = customFieldIds.get(key)
  if (cached) return cached
  const data = await ghl<CustomFieldsResponse>(config, `/locations/${encodeURIComponent(config.locationId)}/customFields`, {
    version: LOCATIONS_VERSION,
    query: { model: "contact" },
  })
  const field = data.customFields?.find((f) => f.fieldKey === `contact.${key}` || f.fieldKey === key)
  if (!field) return null
  customFieldIds.set(key, field.id)
  return field.id
}
