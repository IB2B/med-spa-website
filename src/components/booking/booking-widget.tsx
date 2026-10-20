"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Download } from "lucide-react"

import { fmt, type Locale } from "@/i18n/config"
import type { BookingDict } from "@/i18n/dictionaries/booking"
import { UTM_KEYS, splitName, type BookingInput, type BookingResponse, type SlotsResponse } from "@/lib/booking"
import { cn } from "@/lib/utils"

import { DetailsForm, emptyDetails, fullPhone, type DetailsValues } from "./details-form"
import { downloadIcs, googleCalendarUrl } from "./ics"
import { SlotPicker, type SlotsState } from "./slot-picker"
import { browserTimeZone, formatLongDate, formatTime, timeZoneLabel } from "./time"

type Step = 0 | 1 | 2
type Booked = { start: string; end: string; firstName: string }

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40"

// The 3-step booking widget (pick a time → your details → confirmed), on this page, with no iframe:
// it talks to /api/booking/slots and /api/booking/create, which book on the same calendar as the
// TORCH site. Every booking carries the utm_* params of the page URL; the server tags it "medspa-landing".
export function BookingWidget({ t, lang }: { t: BookingDict; lang: Locale }) {
  const [step, setStep] = useState<Step>(0)
  const [timeZone, setTimeZone] = useState("")
  const [slots, setSlots] = useState<SlotsState>({ status: "loading" })
  const [slot, setSlot] = useState<string | null>(null)
  const [notice, setNotice] = useState<string>()
  const [values, setValues] = useState<DetailsValues>(() => emptyDetails(lang))
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string>()
  const [serverFields, setServerFields] = useState<Extract<BookingResponse, { ok: false }>["fields"]>()
  const [booked, setBooked] = useState<Booked | null>(null)
  const [utm, setUtm] = useState<Partial<Record<(typeof UTM_KEYS)[number], string>>>({})

  const loadSlots = useCallback(async (tz: string, quiet = false) => {
    if (!quiet) setSlots({ status: "loading" })
    try {
      const res = await fetch(`/api/booking/slots?timezone=${encodeURIComponent(tz)}`, { cache: "no-store" })
      const data = (await res.json()) as SlotsResponse
      if (data.ok) setSlots({ status: "ready", slots: data.slots })
      else if (!quiet) setSlots({ status: "error" })
    } catch {
      if (!quiet) setSlots({ status: "error" })
    }
  }, [])

  // Browser-only values, read once on mount: the visitor's timezone (then the first slot load) and the
  // utm_* params of this page's URL.
  useEffect(() => {
    const tz = browserTimeZone()
    const params = new URLSearchParams(window.location.search)
    const found: typeof utm = {}
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) found[key] = value.slice(0, 200)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only values once on mount
    setTimeZone(tz)
    setUtm(found)
    void loadSlots(tz)
  }, [loadSlots])

  // While the visitor is choosing, keep availability fresh (every 2 minutes and when they come back
  // to the tab), so a time someone else just booked disappears instead of failing later. Same as TORCH.
  useEffect(() => {
    if (step !== 0 || !timeZone) return
    const refresh = () => {
      if (document.visibilityState === "visible") void loadSlots(timeZone, true)
    }
    const id = window.setInterval(refresh, 120_000)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [step, timeZone, loadSlots])

  const toInput = (v: DetailsValues): BookingInput => ({
    fullName: v.fullName,
    clinic: v.clinic,
    email: v.email,
    phone: fullPhone(v),
    revenue: v.revenue || undefined,
    slot: slot ?? "",
    timezone: timeZone || "UTC",
    lang,
    utm,
    website: v.website,
  })

  async function submit(input: BookingInput) {
    if (submitting) return
    setSubmitting(true)
    setServerError(undefined)
    setServerFields(undefined)
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const data = (await res.json()) as BookingResponse
      if (data.ok) {
        setBooked({ start: data.start, end: data.end, firstName: splitName(input.fullName).firstName })
        setStep(2)
      } else if (data.code === "slot_taken") {
        // Someone took it between step 1 and now: back to the calendar with fresh slots.
        setSlot(null)
        setNotice(t.slotTaken)
        setStep(0)
        void loadSlots(timeZone)
      } else {
        if (data.fields) setServerFields(data.fields)
        setServerError(t.errors[data.code])
      }
    } catch {
      setServerError(t.errors.failed)
    } finally {
      setSubmitting(false)
    }
  }

  const event = booked
    ? { start: booked.start, end: booked.end, title: t.eventTitle, description: t.eventDescription }
    : null

  return (
    <div className="bg-white text-neutral-950">
      {/* Steps */}
      <ol aria-label={t.stepsLabel} className="grid grid-cols-3 border-b border-neutral-200">
        {t.steps.map((label, i) => {
          const current = i === step
          const done = i < step
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-4 font-mono text-[0.625rem] tracking-wide uppercase sm:px-6 sm:text-xs",
                current ? "border-accent text-neutral-950" : "border-transparent text-neutral-400",
                done && "text-neutral-600"
              )}
            >
              <span className={cn("shrink-0", current || done ? "text-accent-text" : "")}>{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate">{label}</span>
            </li>
          )
        })}
      </ol>

      <div className="p-4 sm:p-8">
        {step === 0 ? (
          <SlotPicker
            t={t}
            lang={lang}
            timeZone={timeZone}
            onTimeZoneChange={(tz) => {
              setTimeZone(tz)
              setNotice(undefined)
              void loadSlots(tz)
            }}
            state={slots}
            onRetry={() => void loadSlots(timeZone)}
            onPick={(s) => {
              setSlot(s)
              setNotice(undefined)
              setServerError(undefined)
              setStep(1)
            }}
            notice={notice}
          />
        ) : null}

        {step === 1 && slot ? (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-neutral-100 px-4 py-3 sm:px-5">
              <div>
                <p className="font-mono text-[0.6875rem] tracking-wide text-neutral-500 uppercase">{t.chosen}</p>
                <p className="mt-1 font-medium">
                  {formatLongDate(slot, timeZone, lang)} · {formatTime(slot, timeZone, lang)}
                </p>
                <p className="font-mono text-[0.6875rem] tracking-wide text-neutral-500 uppercase">{timeZoneLabel(timeZone, lang)}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(0)}
                disabled={submitting}
                className={`inline-flex min-h-11 items-center rounded-sm font-mono text-xs tracking-wide text-accent-text uppercase underline underline-offset-4 hover:text-accent-hover disabled:opacity-50 ${ring}`}
              >
                {t.change}
              </button>
            </div>
            <DetailsForm
              t={t}
              lang={lang}
              values={values}
              onChange={setValues}
              toInput={toInput}
              onSubmit={(input) => void submit(input)}
              submitting={submitting}
              serverFields={serverFields}
              serverError={serverError}
            />
          </div>
        ) : null}

        {step === 2 && booked && event ? (
          <div role="status" className="py-6 sm:py-10">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-none bg-accent text-white">
              <Check className="size-6" strokeWidth={2.5} />
            </span>
            <p className="mt-6 text-3xl leading-tight font-medium tracking-tighter uppercase sm:text-4xl">
              {fmt(t.bookedTitle, { name: booked.firstName })}
            </p>
            <p className="mt-3 text-lg font-medium">
              {formatLongDate(booked.start, timeZone, lang)} · {formatTime(booked.start, timeZone, lang)}
            </p>
            <p className="font-mono text-[0.6875rem] tracking-wide text-neutral-500 uppercase">{timeZoneLabel(timeZone, lang)}</p>
            <p className="mt-5 max-w-md font-mono text-xs leading-relaxed text-neutral-700 uppercase">{t.reminder}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center rounded-none bg-neutral-950 px-5 font-mono text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-neutral-800 ${ring}`}
              >
                {t.addGoogle}
              </a>
              <button
                type="button"
                onClick={() => downloadIcs(event)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-none border border-neutral-300 bg-white px-5 font-mono text-xs font-medium tracking-wide uppercase transition-colors hover:bg-neutral-100 ${ring}`}
              >
                <Download className="size-4" aria-hidden="true" />
                {t.downloadIcs}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
