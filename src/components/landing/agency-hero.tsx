/*
 * Headline variants for A/B testing (swap into `copy.headline` below; _grey_ parts get `soft: true`):
 *
 * A. We fill your _med spa calendar_ with patients _ready to pay_ for premium treatments.
 * B. _Booked consultations_, not likes: patients who come in for _Botox, fillers and laser_.
 * C. Every month, _new patients in your chair_ for your _highest-value treatments_.
 */

import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { HeroVideo } from "@/components/landing/hero-video"
import { Keyword } from "@/components/landing/keyword"
import { localizeHref, type Locale } from "@/i18n/config"

// ─── Edit everything here ───────────────────────────────────────────────────────────────────────
// Text in [brackets] and anything marked PLACEHOLDER is not real yet: replace it before going live.
// One block per language (`en`, `it`); French and Arabic fall back to English.
const en = {
  logo: { src: "/brand/intelligentb2b-logo-light.png", alt: "IntelligentB2B" },
  headline: [
    { text: "We fill your " },
    { text: "med spa calendar", soft: true },
    { text: " with patients " },
    { text: "ready to pay", soft: true },
    { text: " for premium treatments" },
  ],
  subheadline:
    "We run ads for your Botox, filler, laser hair removal and body contouring treatments, then pre-screen every patient for budget, so your front desk only talks to people ready to book.",
  eyebrow: "For med spas",
  eyebrowEnd: "Ads + patient pre-screening",
  nav: [
    { label: "Results", href: "#results" },
    { label: "Technology", href: "#technology" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Book free call", short: "Book free call", href: "/book" }, // `short`: the small top-bar button
  video: {
    // Put the file in /public (e.g. /public/hero/clinic.mp4) and set src to "/hero/clinic.mp4", or use a full URL.
    src: "https://estetica.intelligentb2b.com/__l5e/assets-v1/e6ffca4d-17cb-4ea7-b601-b24b65df1131/metodo-centri-estetici.mp4" as string | null,
    poster: null as string | null, // optional still image shown before the video loads
    label: "Video: a day at a fully booked med spa",
    placeholder: "Video slot (16:9)",
    // Player controls (also read by screen readers).
    ui: {
      start: "Play video",
      play: "Play",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit fullscreen",
      seek: "Seek",
      of: "of",
    },
  },
}

const it: typeof en = {
  logo: en.logo,
  headline: [
    { text: "Riempiamo " },
    { text: "l'agenda della tua clinica", soft: true },
    { text: " di pazienti " },
    { text: "pronti a pagare", soft: true },
    { text: " per trattamenti premium" },
  ],
  subheadline:
    "Gestiamo le pubblicità per i tuoi trattamenti di botox, filler, epilazione laser e rimodellamento corporeo, poi pre-qualifichiamo ogni paziente sul budget, così la tua reception parla solo con chi è pronto a prenotare.",
  eyebrow: "Per cliniche estetiche",
  eyebrowEnd: "Pubblicità + pre-qualifica dei pazienti",
  nav: [
    { label: "Risultati", href: "#results" },
    { label: "Tecnologia", href: "#technology" },
    { label: "FAQ", href: "#faq" },
    { label: "Contatti", href: "#contact" },
  ],
  cta: { label: "Prenota una call gratuita", short: "Prenota la call", href: "/book" },
  video: {
    ...en.video,
    label: "Video: una giornata in una clinica estetica con l'agenda piena",
    placeholder: "Spazio video (16:9)",
    ui: {
      start: "Guarda il video",
      play: "Riproduci",
      pause: "Pausa",
      mute: "Disattiva audio",
      unmute: "Attiva audio",
      fullscreen: "Schermo intero",
      exitFullscreen: "Esci da schermo intero",
      seek: "Avanzamento",
      of: "di",
    },
  },
}

const copies: Record<Locale, typeof en> = { en, it, fr: en, ar: en }
// ────────────────────────────────────────────────────────────────────────────────────────────────

const enter = "animate-fade-up motion-reduce:animate-none"
const delay = (ms: number) => ({ animationDelay: `${ms}ms` })
const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"

// Black pill button with the accent arrow circle inside, shared by every section. `tone="light"` is
// the white version for dark bands. Label and link default to the hero's.
export function CtaPair({
  size = "md",
  tone = "dark",
  label = en.cta.label,
  href = en.cta.href,
}: {
  size?: "sm" | "md"
  tone?: "dark" | "light"
  label?: string
  href?: string
}) {
  const h = size === "sm" ? "min-h-10" : "min-h-11"
  const dot = size === "sm" ? "size-8" : "size-9"
  const main =
    tone === "light"
      ? "bg-white text-neutral-950 hover:bg-neutral-200"
      : "bg-neutral-950 text-white hover:bg-neutral-800"
  return (
    <a
      href={href}
      className={`group flex w-fit ${h} items-center gap-3 rounded-full py-1 ps-5 pe-1 font-sans text-xs font-medium tracking-wide uppercase transition-colors ${ring} ${main}`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`grid ${dot} shrink-0 place-items-center rounded-full bg-accent text-white transition-colors group-hover:bg-accent-hover`}
      >
        <ArrowRight className="size-4 rtl:rotate-180" />
      </span>
    </a>
  )
}

// Styled after the user's reference (same as the testimonials): white, uppercase headline with grey
// highlights, uppercase small text, accent accents. Top bar: logo, two links, the CTA pair.
export function AgencyHero({ lang }: { lang: Locale }) {
  const copy = copies[lang]
  const book = localizeHref(lang, copy.cta.href)
  return (
    <section aria-labelledby="hero-title" className="bg-white text-neutral-950">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {/* intelligentb2b.com logo for light pages: their outline mascot (favicon) + wordmark with "intelligent" in dark */}
          <Image
            src={copy.logo.src}
            alt={copy.logo.alt}
            width={896}
            height={200}
            priority
            className="h-8 w-auto sm:h-9"
          />
          <nav aria-label="Main" className="hidden items-center gap-8 font-sans text-xs tracking-wide text-neutral-600 uppercase md:flex">
            {copy.nav.map((link) => (
              <a key={link.href} href={link.href} className={`rounded-sm transition-colors hover:text-neutral-950 ${ring}`}>
                {link.label}
              </a>
            ))}
          </nav>
          <CtaPair size="sm" label={copy.cta.short} href={book} />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 lg:pt-14 lg:pb-24">
        <div className="flex items-center justify-between gap-4 font-sans text-xs tracking-wide text-neutral-600 uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
            {copy.eyebrow}
          </span>
          <span className="hidden sm:inline">{copy.eyebrowEnd}</span>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
          <h1
            id="hero-title"
            translate="no"
            className={`text-[2.75rem] leading-[0.92] font-medium tracking-tighter text-balance uppercase sm:text-6xl lg:text-[4.25rem] ${enter}`}
          >
            {copy.headline.map((part, i) =>
              part.soft ? (
                <Keyword key={part.text} delay={400 + (i === 1 ? 0 : 1400)}>
                  {part.text}
                </Keyword>
              ) : (
                part.text
              )
            )}
          </h1>

          <div className={enter} style={delay(150)}>
            <p className="max-w-sm font-sans text-xs leading-relaxed text-neutral-700 uppercase">{copy.subheadline}</p>
            <div className="mt-6">
              <CtaPair label={copy.cta.label} href={book} />
            </div>
          </div>
        </div>

        {/* Video */}
        <div
          className={`relative mt-14 aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 sm:aspect-video lg:mt-20 ${enter}`}
          style={delay(300)}
        >
          {copy.video.src ? (
            <HeroVideo src={copy.video.src} poster={copy.video.poster ?? undefined} label={copy.video.label} ui={copy.video.ui} />
          ) : (
            <div className="absolute inset-4 grid place-items-center border border-dashed border-neutral-300 font-sans text-xs tracking-wide text-neutral-500 uppercase">
              {copy.video.placeholder}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
