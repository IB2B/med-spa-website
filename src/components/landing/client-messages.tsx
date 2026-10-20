"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Keyword } from "@/components/landing/keyword"

import { localizeHref, type Locale } from "@/i18n/config"

// ─── Edit everything here ───────────────────────────────────────────────────────────────────────
// Real messages from clients, word for word in Italian as they wrote them on WhatsApp.
// `result` is the small tag at the top of each card.
const copy = {
  title: { strong: "What", soft: "our clients", end: "say" },
  eyebrow: "Testimonials",
  eyebrowEnd: "Salons & clinics",
  intro: "Real WhatsApp messages from the salons and clinics we run ads for, word for word.",
  next: "Next testimonial",
  testimonials: [
    {
      name: "Chiara",
      clinic: "Chiara Aesthetic Center",
      result: "15 requests in 5 days",
      quote: "Mattia buonasera, ti aggiorno sulla campagna epilazione laser: settimana pazzesca, 15 richieste in 5 giorni e 6 pacchetti chiusi da €600 l'uno. Praticamente si sono ripagati da soli i primi due mesi di gestione 🙈🙌",
    },
    {
      name: "Federica",
      clinic: "Iris Beauty & Wellness",
      result: "7 new clients in one week",
      quote: "Ciao Mattia, ti scrivo perché sono super soddisfatta: la campagna sui trattamenti viso anti-age ha portato 7 nuove clienti questa settimana, di cui 4 hanno già acquistato il pacchetto da 5 sedute (€890 a pacchetto).",
    },
    {
      name: "Simona",
      clinic: "Studio Nails & Beauty",
      result: "€1,850 a month, recurring",
      quote: "Questo mese abbiamo chiuso 9 nuove clienti fisse solo dai lead della pubblicità, per un totale di circa €1.850 al mese ricorrenti tra trattamenti e abbonamenti mensili. Non mi aspettavo così tanto onestamente 😅",
    },
    {
      name: "Giulia",
      clinic: "Alessia Beauty Center",
      result: "First lead closed at €1,150",
      quote: "Oggi si è presentata la prima, che è uscita con un preventivo da €1100 che ha accettato e per il quale ha lasciato €200 di caparra + €50 di consulenza. Totale €1150 😂",
    },
    {
      name: "Francesca",
      clinic: "Beauty Top",
      result: "12 paid appointments in one week",
      quote: "Nell'ultima settimana soprattutto abbiamo avuto un incremento notevole di consulenze, l'ultima campagna sta andando da dio! 12 nuovi appuntamenti fissati e pagati.",
    },
  ],
  cta: {
    label: "Book free call",
    href: "/book",
    note: "Includes a free analysis of your clinic. First 10 clinics only.",
  },
}
// ────────────────────────────────────────────────────────────────────────────────────────────────

// Gradient "orb" avatar generated from the name: same name, same colours, no photo needed.
function orb(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  h = Math.round((h * 137.508) % 360)
  return {
    background: `radial-gradient(circle at 32% 28%, hsl(${h} 90% 94%) 0%, hsl(${h} 55% 68%) 38%, hsl(${(h + 35) % 360} 45% 38%) 78%, hsl(${(h + 50) % 360} 40% 22%) 100%)`,
  }
}

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

// Styled after the user's reference: white band, uppercase title, mono text, accent accents.
// Title, intro and button on the start side; quote cards on the end side in a scroll-snap row that
// moves on by one card every 5s (paused on hover/focus, off with reduced motion). The accent button steps it.
export function ClientMessages({ lang }: { lang: Locale }) {
  const track = useRef<HTMLUListElement>(null)
  const [paused, setPaused] = useState(false)

  const step = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const by = (card?.offsetWidth ?? el.clientWidth) + 16
    const rtl = getComputedStyle(el).direction === "rtl" ? -1 : 1
    const atEnd = Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 8
    const atStart = Math.abs(el.scrollLeft) < 8
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" })
    else if (dir === -1 && atStart) el.scrollTo({ left: rtl * el.scrollWidth, behavior: "smooth" })
    else el.scrollBy({ left: dir * rtl * by, behavior: "smooth" })
  }

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => step(1), 5000)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section id="results" aria-labelledby="client-messages-title" className="scroll-mt-6 bg-white py-16 text-neutral-950 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-t border-neutral-200 pt-5 font-mono text-xs tracking-wide text-neutral-600 uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
            {copy.eyebrow}
          </span>
          <span>{copy.eyebrowEnd}</span>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:items-center lg:gap-10">
          <div>
            <h2
              id="client-messages-title"
              translate="no"
              className="text-5xl leading-[0.92] font-medium tracking-tighter uppercase sm:text-6xl"
            >
              {`${copy.title.strong} `}
              <Keyword>{copy.title.soft}</Keyword>
              {` ${copy.title.end}`}
            </h2>
            <p className="mt-6 max-w-sm font-mono text-xs leading-relaxed text-neutral-700 uppercase">{copy.intro}</p>
            <div className="mt-8 flex items-center gap-1.5">
              <a
                href={localizeHref(lang, copy.cta.href)}
                className={`inline-flex min-h-11 items-center rounded-none bg-neutral-950 px-5 font-mono text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-neutral-800 ${ring}`}
              >
                {copy.cta.label}
              </a>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={copy.next}
                className={`grid size-11 place-items-center rounded-none bg-accent text-white transition-colors hover:bg-accent-hover ${ring}`}
              >
                <ArrowRight className="size-4 rtl:rotate-180" />
              </button>
            </div>
            <p className="mt-3 font-mono text-[0.6875rem] leading-relaxed text-neutral-500 uppercase">{copy.cta.note}</p>
          </div>

          <ul
            ref={track}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {copy.testimonials.map((t) => (
              <li
                key={t.name}
                className="flex min-h-[25rem] w-[85%] shrink-0 snap-start flex-col bg-neutral-100 p-6 sm:w-[calc(50%-0.25rem)] sm:p-7"
              >
                <span aria-hidden="true" className="text-6xl leading-[0.75] font-black text-accent-text">
                  &rdquo;
                </span>
                <blockquote lang="it" className="mt-5 font-mono text-xs leading-relaxed text-neutral-800 uppercase">
                  {t.quote}
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <span aria-hidden="true" className="size-10 shrink-0 rounded-full shadow-sm" style={orb(t.name)} />
                  <div>
                    <p className="text-[0.9375rem] font-medium">{t.name}</p>
                    <p className="font-mono text-[0.6875rem] text-neutral-500">{t.clinic}</p>
                  </div>
                </div>
                <p className="mt-auto self-end pt-6 text-sm font-semibold tracking-tight text-neutral-500">{t.result}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
