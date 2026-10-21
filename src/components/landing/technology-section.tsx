"use client"

import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  ChartColumn,
  CreditCard,
  Megaphone,
  MessagesSquare,
  PhoneMissed,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react"

import { fadeUp, SectionHeader, useInView } from "@/components/landing/section-header"
import { localizeHref, type Locale } from "@/i18n/config"
import type { TechnologyDict } from "@/i18n/dictionaries/technology"

const icons: Record<string, LucideIcon> = {
  calendar: CalendarCheck,
  "missed-call": PhoneMissed,
  inbox: MessagesSquare,
  reminders: BellRing,
  deposits: CreditCard,
  patients: Users,
  reviews: Star,
  promos: Megaphone,
  stats: ChartColumn,
}

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
const delay = (i: number) => ({ animationDelay: `${i * 70}ms` })

// "Discover Torch" bento. Grid with no empty cells at any width:
// - desktop, 4 cols: two 2×2 close-ups fill rows 1–2; 9 small cards + the CTA spanning 3 fill rows 3–5.
// - tablet, 2 cols: close-ups span both columns; 9 small cards + the CTA (1 cell) make 5 full rows.
// - mobile, 1 col: everything stacks, close-ups first.
// Cards fade up one by one on scroll; small cards lift on hover and their icon turns accent.
export function TechnologySection({ t, lang }: { t: TechnologyDict; lang: Locale }) {
  const [grid, inView] = useInView<HTMLUListElement>(0.05)

  return (
    <section id="technology" aria-labelledby="technology-title" className="scroll-mt-6 bg-white py-16 text-neutral-950 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader label={t.eyebrow} tag={t.eyebrowEnd} />

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <h2
            id="technology-title"
            translate="no"
            className="text-5xl leading-[0.92] font-medium tracking-tighter uppercase sm:text-6xl"
          >
            {`${t.title.strong} `}
            <span className="text-neutral-400">{t.title.soft}</span>
          </h2>
          <p className="max-w-sm font-sans text-xs leading-relaxed text-neutral-700 uppercase">{t.subline}</p>
        </div>

        <ul ref={grid} className="mt-10 grid gap-2 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {/* Close-up A: pipeline */}
          <li className={`sm:col-span-2 lg:row-span-2 ${fadeUp(inView)}`} style={delay(0)}>
            <div className="flex h-full flex-col bg-neutral-100 p-6 sm:p-8">
              <p className="font-sans text-xs tracking-wide text-accent-text uppercase">{t.closeUp}</p>
              <h3 className="mt-4 text-2xl leading-tight font-medium tracking-tight">{t.pipeline.title}</h3>
              <p className="mt-3 max-w-sm font-sans text-xs leading-relaxed text-neutral-700 uppercase">{t.pipeline.body}</p>

              <div aria-hidden="true" className="mt-auto pt-8">
                <div className="grid grid-cols-3 gap-2">
                  {t.pipeline.columns.map((label) => (
                    <p key={label} className="truncate font-sans text-[0.625rem] tracking-wide text-neutral-500 uppercase">
                      {label}
                    </p>
                  ))}
                </div>
                <div className="relative mt-2 grid grid-cols-3 gap-2">
                  {t.pipeline.columns.map((label) => (
                    <div key={label} className="flex flex-col gap-1.5 bg-white p-1.5">
                      {[0, 1, 2].map((bar) => (
                        <div key={bar} className="h-7 bg-neutral-200/70" />
                      ))}
                    </div>
                  ))}
                  {/* The patient card moving across: one column wide, sitting on the first bar. */}
                  <div className="pointer-events-none absolute top-1.5 left-0 w-[calc((100%-1rem)/3)] px-1.5 animate-pipeline motion-reduce:animate-none">
                    <div className="flex h-7 items-center gap-1.5 bg-accent px-2">
                      <span className="size-1.5 rounded-full bg-white" />
                      <span className="h-1 flex-1 rounded-full bg-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Close-up B: assistant */}
          <li className={`sm:col-span-2 lg:row-span-2 ${fadeUp(inView)}`} style={delay(1)}>
            <div className="flex h-full flex-col bg-neutral-100 p-6 sm:p-8">
              <p className="font-sans text-xs tracking-wide text-accent-text uppercase">{t.closeUp}</p>
              <h3 className="mt-4 text-2xl leading-tight font-medium tracking-tight">{t.assistant.title}</h3>
              <p className="mt-3 max-w-sm font-sans text-xs leading-relaxed text-neutral-700 uppercase">{t.assistant.body}</p>

              <div aria-hidden="true" className="mt-auto flex items-center pt-8">
                {t.assistant.steps.map((step, i) => (
                  <div key={step} className="flex flex-1 items-center last:flex-none">
                    <span
                      className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-2 font-sans text-[0.625rem] tracking-wide whitespace-nowrap text-neutral-500 uppercase animate-pill-light motion-reduce:animate-none sm:px-4 sm:text-xs"
                      style={{ animationDelay: `${i}s` }}
                    >
                      {step}
                    </span>
                    {i < t.assistant.steps.length - 1 ? <span className="h-px min-w-3 flex-1 bg-neutral-300" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </li>

          {/* Small feature cards */}
          {t.features.map((feature, i) => {
            const Icon = icons[feature.icon] ?? Star
            return (
              <li key={feature.title} className={fadeUp(inView)} style={delay(i + 2)}>
                <div className="group flex h-full min-h-44 flex-col bg-neutral-100 p-6 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <Icon aria-hidden="true" className="size-5 text-neutral-500 transition-colors duration-200 group-hover:text-accent" strokeWidth={1.75} />
                  <h3 className="mt-auto pt-6 text-[1.0625rem] leading-tight font-medium tracking-tight">{feature.title}</h3>
                  <p className="mt-2 font-sans text-[0.6875rem] leading-relaxed text-neutral-600 uppercase">{feature.body}</p>
                </div>
              </li>
            )
          })}

          {/* Filler CTA: closes the grid into a rectangle (1 cell on tablet, 3 on desktop). */}
          <li className={`lg:col-span-3 ${fadeUp(inView)}`} style={delay(t.features.length + 2)}>
            <a
              href={localizeHref(lang, t.cta.href)}
              className={`group flex h-full min-h-44 items-end justify-between gap-6 bg-neutral-950 p-6 text-white transition-colors hover:bg-neutral-800 ${ring}`}
            >
              <span className="max-w-[16rem] text-2xl leading-tight font-medium tracking-tight">{t.cta.label}</span>
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-accent transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                <ArrowRight className="size-4 rtl:rotate-180" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
