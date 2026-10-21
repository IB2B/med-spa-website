"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, X } from "lucide-react"

import type { PainPointsDict } from "@/i18n/dictionaries/pain-points"

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"

// "Sound familiar?": same look as the testimonials (header row with the accent diamond, black/grey
// uppercase title, small uppercase text, light grey cards). Five questions in one centred column; the cards
// fade up one by one when the list scrolls into view (shown at once with reduced motion). On hover
// a card lifts and its ✕ fills accent. The pill button jumps to "What you get".
export function PainPoints({ t }: { t: PainPointsDict }) {
  const list = useRef<HTMLUListElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = list.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section aria-labelledby="pain-points-title" className="bg-white py-16 text-neutral-950 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-5 font-sans text-xs tracking-wide text-neutral-600 uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
            {t.eyebrow}
          </span>
          <span>{t.eyebrowEnd}</span>
        </div>

        <div className="mx-auto mt-12 max-w-[50rem] lg:mt-16">
          <h2
            id="pain-points-title"
            translate="no"
            className="text-center text-[2.5rem] leading-[0.92] font-medium tracking-tighter text-balance uppercase sm:text-6xl"
          >
            {t.title.map((part, i) => (
              <span key={part.text}>
                {i > 0 ? " " : null}
                {part.soft ? <span className="text-neutral-400">{part.text}</span> : part.text}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-center font-sans text-xs leading-relaxed text-neutral-700 uppercase">
            {t.subline}
          </p>

          <ul ref={list} className="mt-10 flex flex-col gap-2 lg:mt-14">
            {t.items.map((item, i) => (
              <li
                key={item}
                className={
                  shown
                    ? "animate-fade-up motion-reduce:animate-none"
                    : "opacity-0 motion-reduce:opacity-100"
                }
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="group relative flex flex-col gap-3 rounded-xl bg-neutral-100 p-5 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-row sm:items-center sm:gap-6 sm:px-7 sm:py-6">
                  <span aria-hidden="true" className="font-sans text-sm font-medium text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pe-10 text-[1.0625rem] leading-snug font-medium tracking-tight sm:flex-1 sm:pe-0">{item}</p>
                  <span
                    aria-hidden="true"
                    className="absolute end-4 top-4 grid size-7 shrink-0 place-items-center rounded-full text-accent-text transition-colors duration-200 group-hover:bg-accent group-hover:text-white sm:static"
                  >
                    <X className="size-4" strokeWidth={2.5} />
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <a
              href={t.cta.href}
              className={`inline-flex min-h-12 items-center gap-4 rounded-full bg-neutral-950 py-1.5 ps-6 pe-1.5 font-sans text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-neutral-800 ${ring}`}
            >
              {t.cta.label}
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-accent">
                <ArrowRight className="size-4 rtl:rotate-180" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
