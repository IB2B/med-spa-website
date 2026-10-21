"use client"

import { useId, useState } from "react"
import { Plus } from "lucide-react"

import { CtaPair } from "@/components/landing/agency-hero"
import { SectionHeader } from "@/components/landing/section-header"
import { localizeHref, type Locale } from "@/i18n/config"
import type { FaqDict } from "@/i18n/dictionaries/faq"

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-inset"

// FAQ: sticky title + button on the start side, accordion on the end side (one item open at a
// time; the answer opens with a height transition and the + turns into ×). Then the full-width
// black "Ready to fill your calendar?" band (#contact). Its button, like every "Book free call",
// opens the booking page (/[lang]/book).
export function FaqSection({ t, lang }: { t: FaqDict; lang: Locale }) {
  const book = localizeHref(lang, t.cta.href)
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <>
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 bg-white py-16 text-neutral-950 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader label={t.eyebrow} tag={t.eyebrowEnd} />

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-10">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <h2
                id="faq-title"
                translate="no"
                className="text-5xl leading-[0.92] font-medium tracking-tighter uppercase sm:text-6xl"
              >
                {`${t.title.strong} `}
                <span className="text-neutral-400">{t.title.soft}</span>
              </h2>
              <p className="mt-6 max-w-sm font-sans text-xs leading-relaxed text-neutral-700 uppercase">{t.note}</p>
              <div className="mt-8">
                <CtaPair label={t.cta.label} href={book} />
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {t.items.map((item, i) => {
                const isOpen = open === i
                const buttonId = `${baseId}-q${i}`
                const panelId = `${baseId}-a${i}`
                return (
                  <li key={item.q} className="rounded-xl bg-neutral-100">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className={`flex min-h-16 w-full items-center justify-between gap-6 rounded-xl px-5 py-4 text-start text-[1.0625rem] leading-snug font-medium tracking-tight sm:px-7 ${ring}`}
                      >
                        {item.q}
                        <span
                          aria-hidden="true"
                          className={`grid size-7 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300 motion-reduce:transition-none ${
                            isOpen ? "rotate-45 bg-accent text-white" : "text-accent-text"
                          }`}
                        >
                          <Plus className="size-4" strokeWidth={2.5} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 font-sans text-xs leading-relaxed text-neutral-700 uppercase sm:px-7">{item.a}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-6 overflow-hidden bg-neutral-950 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader label={t.band.eyebrow} tag={t.band.eyebrowEnd} tone="dark" />

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div>
              <h2
                id="contact-title"
                translate="no"
                className="text-5xl leading-[0.92] font-medium tracking-tighter text-balance uppercase sm:text-6xl lg:text-7xl"
              >
                {t.band.title.map((part, i) => (
                  <span key={part.text}>
                    {i > 0 ? " " : null}
                    {part.soft ? <span className="text-neutral-500">{part.text}</span> : part.text}
                  </span>
                ))}
              </h2>

              <ol className="mt-10 border-t border-neutral-800">
                {t.band.steps.map((step, i) => (
                  <li key={step} className="flex gap-4 border-b border-neutral-800 py-4">
                    {/* Soft tint, not --accent: plum on black is under 4.5:1 for small text. */}
                    <span aria-hidden="true" className="font-sans text-sm text-accent-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-snug text-neutral-300">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8">
                <CtaPair tone="light" label={t.cta.label} href={book} />
                <p className="mt-3 font-sans text-[0.6875rem] tracking-wide text-neutral-400 uppercase">{t.band.note}</p>
              </div>
            </div>

            <CalendarFilling labels={t.band.calendar} lang={lang} />
          </div>
        </div>
      </section>
    </>
  )
}

// Which cells of the 5-day × 6-slot week get booked, in the order they fill: [day, row].
const BOOKED: [number, number][] = [
  [0, 1], [2, 0], [1, 3], [3, 2], [4, 4], [0, 4], [2, 5], [1, 1],
  [3, 0], [4, 1], [0, 2], [2, 3], [3, 5], [4, 3],
]
const HOURS = [9, 10, 11, 14, 15, 16]

// Decorative week calendar whose slots fill accent one by one, then empty and start again
// (shown already full with reduced motion). Weekdays and times follow the page language.
function CalendarFilling({ labels, lang }: { labels: FaqDict["band"]["calendar"]; lang: Locale }) {
  const weekday = new Intl.DateTimeFormat(lang, { timeZone: "UTC", weekday: "short" })
  const time = new Intl.DateTimeFormat(lang, { timeZone: "UTC", hour: "numeric", minute: "2-digit" })
  const days = Array.from({ length: 5 }, (_, i) => weekday.format(new Date(Date.UTC(2024, 0, 1 + i, 12))))
  const order = new Map(BOOKED.map(([d, r], i) => [`${d}-${r}`, i]))

  return (
    <div aria-hidden="true" className="border border-neutral-800 bg-neutral-900 p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-lg font-medium tracking-tight">{labels.title}</p>
        <p className="font-sans text-[0.6875rem] tracking-wide text-neutral-500 uppercase">{labels.tag}</p>
      </div>

      <div className="mt-6 grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1.5 sm:gap-2">
        <span />
        {days.map((d) => (
          <span key={d} className="pb-1 text-center font-sans text-[0.625rem] tracking-wide text-neutral-500 uppercase">
            {d}
          </span>
        ))}
        {HOURS.map((h, row) => (
          <div key={h} className="contents">
            <span className="pe-2 text-end font-sans text-[0.625rem] leading-8 text-neutral-500 tabular-nums sm:leading-9">
              {time.format(new Date(Date.UTC(2024, 0, 1, h)))}
            </span>
            {days.map((d, day) => {
              const i = order.get(`${day}-${row}`)
              return (
                <span
                  key={d}
                  className={
                    i === undefined
                      ? "h-8 rounded-sm bg-neutral-800 sm:h-9"
                      : "h-8 rounded-sm bg-neutral-800 animate-slot-fill motion-reduce:animate-none motion-reduce:bg-accent sm:h-9"
                  }
                  style={i === undefined ? undefined : { animationDelay: `${i * 0.45}s` }}
                />
              )
            })}
          </div>
        ))}
      </div>

      <p className="mt-5 flex items-center gap-2 font-sans text-[0.6875rem] tracking-wide text-neutral-400 uppercase">
        <span className="size-2.5 rounded-sm bg-accent" />
        {labels.legend}
      </p>
    </div>
  )
}
