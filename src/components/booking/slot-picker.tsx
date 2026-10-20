"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Globe } from "lucide-react"

import { whatsappUrl } from "@/content/site"
import { fmt } from "@/i18n/config"
import type { BookingDict } from "@/i18n/dictionaries/booking"
import { cn } from "@/lib/utils"

import { allTimeZones, dayKey, formatDay, formatTime, keyToDate, timeZoneLabel } from "./time"

export type SlotsState = { status: "loading" } | { status: "error" } | { status: "ready"; slots: string[] }

type Month = { year: number; month: number } // month: 0-11

function addMonths({ year, month }: Month, n: number): Month {
  const d = new Date(Date.UTC(year, month + n, 1))
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
}
const monthOf = (key: string): Month => ({ year: Number(key.slice(0, 4)), month: Number(key.slice(5, 7)) - 1 })
const monthIndex = (m: Month) => m.year * 12 + m.month

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
const arrow = `grid size-11 place-items-center rounded-none text-neutral-700 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent ${ring}`

type Props = {
  t: BookingDict
  lang: string
  timeZone: string
  onTimeZoneChange: (tz: string) => void
  state: SlotsState
  onRetry: () => void
  onPick: (slot: string) => void
  /** Shown above the calendar, e.g. "that time was just taken". */
  notice?: string
}

// Step 1: month calendar on the start side (days with free times in accent), the free times of the
// chosen day on the end side (fully booked times aren't shown). Stacks on phones. Logic adapted from
// the TORCH site (crm-lp/src/components/booking/slot-picker.tsx).
export function SlotPicker({ t, lang, timeZone, onTimeZoneChange, state, onRetry, onPick, notice }: Props) {
  const [editingTz, setEditingTz] = useState(false)
  // The current time, updated every minute so slots disappear as soon as they pass.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  // Future free slots grouped by day in the visitor's timezone.
  const byDay = useMemo(() => {
    const map = new Map<string, string[]>()
    if (state.status !== "ready" || !timeZone) return map
    for (const slot of state.slots) {
      if (Date.parse(slot) <= now) continue
      const key = dayKey(slot, timeZone)
      map.set(key, [...(map.get(key) ?? []), slot])
    }
    return map
  }, [state, timeZone, now])

  const days = [...byDay.keys()].sort()
  const firstDay = days[0]
  const lastDay = days[days.length - 1]

  const [pickedDay, setPickedDay] = useState<string | null>(null)
  const [shownMonth, setShownMonth] = useState<Month | null>(null)
  // Fall back to the first day with free times (also after a timezone change or a refresh).
  const selectedDay = pickedDay && byDay.has(pickedDay) ? pickedDay : (firstDay ?? null)
  const month = shownMonth ?? (selectedDay ? monthOf(selectedDay) : monthOf(dayKey(now, timeZone || "UTC")))

  const canPrev = firstDay ? monthIndex(month) > monthIndex(monthOf(firstDay)) : false
  const canNext = lastDay ? monthIndex(month) < monthIndex(monthOf(lastDay)) : false

  const weekdays = useMemo(() => {
    const f = new Intl.DateTimeFormat(lang, { timeZone: "UTC", weekday: "short" })
    // 2024-01-01 is a Monday: weeks start on Monday.
    return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2024, 0, 1 + i, 12))))
  }, [lang])

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(month.year, month.month, 1))
    const lead = (first.getUTCDay() + 6) % 7 // Monday = 0
    const count = new Date(Date.UTC(month.year, month.month + 1, 0)).getUTCDate()
    const out: (string | null)[] = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= count; d++) {
      out.push(`${month.year}-${String(month.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
    }
    return out
  }, [month])

  const monthTitle = new Intl.DateTimeFormat(lang, { timeZone: "UTC", month: "long", year: "numeric" }).format(
    new Date(Date.UTC(month.year, month.month, 1, 12))
  )
  const today = dayKey(now, timeZone || "UTC")
  const times = selectedDay ? (byDay.get(selectedDay) ?? []) : []

  return (
    <div>
      {/* Timezone */}
      <div className="flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] tracking-wide text-neutral-600 uppercase">
        <Globe className="size-3.5 shrink-0" aria-hidden="true" />
        {!timeZone ? null : editingTz ? (
          <label className="flex min-w-0 flex-1 items-center gap-2">
            <span className="sr-only">{t.timezoneLabel}</span>
            <select
              autoFocus
              value={timeZone}
              onChange={(e) => {
                onTimeZoneChange(e.target.value)
                setEditingTz(false)
              }}
              onBlur={() => setEditingTz(false)}
              className="h-11 w-full max-w-sm min-w-0 rounded-sm border border-neutral-300 bg-white px-3 font-sans text-sm tracking-normal text-neutral-950 normal-case"
            >
              {allTimeZones(timeZone).map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <>
            <span>
              {t.timesShownIn} <span className="text-neutral-950">{timeZoneLabel(timeZone, lang)}</span>
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setEditingTz(true)}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-sm text-accent-text uppercase underline underline-offset-4 hover:text-accent-hover ${ring}`}
            >
              {t.changeTimezone}
            </button>
          </>
        )}
      </div>

      {notice ? (
        <p role="alert" className="mt-3 border-s-2 border-accent bg-accent-soft px-4 py-3 text-sm font-medium text-neutral-950">
          {notice}
        </p>
      ) : null}

      <div className="mt-4">
        {state.status === "loading" || !timeZone ? (
          <div role="status" aria-label={t.loading} className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-10">
            <div className="animate-pulse motion-reduce:animate-none">
              <div className="h-11 w-40 bg-neutral-200" />
              <div className="mt-3 grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="aspect-square bg-neutral-200/70" />
                ))}
              </div>
            </div>
            <div className="animate-pulse motion-reduce:animate-none">
              <div className="h-5 w-44 bg-neutral-200" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="h-11 bg-neutral-200/70" />
                ))}
              </div>
            </div>
          </div>
        ) : state.status === "error" ? (
          <div className="py-10">
            <p className="text-base font-medium">{t.loadError}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onRetry}
                className={`inline-flex min-h-11 items-center rounded-none border border-neutral-300 bg-white px-5 font-mono text-xs font-medium tracking-wide uppercase transition-colors hover:bg-neutral-200 ${ring}`}
              >
                {t.retry}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center rounded-none bg-neutral-950 px-5 font-mono text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-neutral-800 ${ring}`}
              >
                {t.whatsappFallback}
              </a>
            </div>
          </div>
        ) : days.length === 0 ? (
          <div className="py-10">
            <p className="text-base">{t.noSlots}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex min-h-11 items-center rounded-none bg-neutral-950 px-5 font-mono text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-neutral-800 ${ring}`}
            >
              {t.whatsappFallback}
            </a>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-10">
            {/* Month calendar */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium tracking-tight capitalize">{monthTitle}</p>
                <div className="flex gap-1">
                  <button type="button" disabled={!canPrev} onClick={() => setShownMonth(addMonths(month, -1))} aria-label={t.prevMonth} className={arrow}>
                    <ChevronLeft className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                  </button>
                  <button type="button" disabled={!canNext} onClick={() => setShownMonth(addMonths(month, 1))} aria-label={t.nextMonth} className={arrow}>
                    <ChevronRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-1 text-center" role="grid" aria-label={monthTitle}>
                {weekdays.map((w) => (
                  <span key={w} className="pb-1 font-mono text-[0.625rem] tracking-wide text-neutral-500 uppercase" role="columnheader">
                    {w}
                  </span>
                ))}
                {cells.map((key, i) => {
                  if (!key) return <span key={`empty-${i}`} aria-hidden="true" />
                  const free = byDay.has(key)
                  const selected = key === selectedDay
                  return (
                    <button
                      key={key}
                      type="button"
                      role="gridcell"
                      disabled={!free}
                      aria-selected={selected}
                      aria-label={formatDay(key, lang)}
                      onClick={() => setPickedDay(key)}
                      className={cn(
                        "flex aspect-square w-full items-center justify-center rounded-none text-sm tabular-nums transition-colors",
                        ring,
                        free ? "cursor-pointer font-medium" : "cursor-not-allowed text-neutral-300",
                        free && !selected && "bg-accent-soft text-accent-text hover:bg-accent/15",
                        selected && "bg-accent text-white",
                        key === today && !selected && "ring-1 ring-neutral-400"
                      )}
                    >
                      {keyToDate(key).getUTCDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Free times of the selected day */}
            <div>
              <p className="text-base font-medium tracking-tight">
                {selectedDay ? fmt(t.timesOn, { date: formatDay(selectedDay, lang) }) : t.pickDay}
              </p>
              <p className="mt-1 font-mono text-[0.6875rem] tracking-wide text-neutral-500 uppercase">{t.duration}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {times.map((slot) => (
                  <li key={slot}>
                    <button
                      type="button"
                      onClick={() => onPick(slot)}
                      className={`min-h-11 w-full cursor-pointer rounded-none border border-neutral-300 bg-white text-sm font-medium tabular-nums transition-colors hover:border-accent hover:text-accent-hover ${ring}`}
                    >
                      {formatTime(slot, timeZone, lang)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
