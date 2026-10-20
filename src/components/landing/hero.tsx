import { ArrowRight, CalendarCheck, Clock, ShieldCheck } from "lucide-react"

import { HeroChat } from "@/components/landing/hero-chat"
import { Button } from "@/components/ui/button"
import type { HeroDict } from "@/i18n/dictionaries/hero"

const proofIcons = [Clock, CalendarCheck, ShieldCheck]

// Copy on the start side, the WhatsApp phone on the end side (below the copy on mobile).
// The main button only scrolls to #prenota, where the booking form gets embedded later.
export function Hero({ t }: { t: HeroDict }) {
  return (
    <section aria-labelledby="hero-title" className="pt-3 pb-16 lg:pt-10 lg:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div>
          <p className="mb-3.5 text-sm font-medium text-brand">{t.eyebrow}</p>
          <h1
            id="hero-title"
            className="font-heading text-[2.15rem] leading-[1.1] font-normal text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06] lg:tracking-tight"
          >
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground lg:mt-6 lg:text-lg">
            {t.lead}
          </p>

          <div className="mt-6 lg:mt-9">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-7">
              <Button
                size="xl"
                nativeButton={false}
                render={<a href="#prenota" />}
                className="h-auto min-h-[54px] w-full py-3 text-center whitespace-normal shadow-lg focus-visible:ring-brand/40 sm:w-auto"
              >
                {t.cta}
                <ArrowRight data-icon="inline-end" className="rtl:rotate-180" />
              </Button>
              <a
                href="#come-funziona"
                className="self-center rounded-sm py-1.5 text-[0.9375rem] font-medium underline decoration-border decoration-[1.5px] underline-offset-[5px] transition-colors outline-none hover:decoration-brand focus-visible:ring-3 focus-visible:ring-brand/40"
              >
                {t.secondary}
              </a>
            </div>
            <p className="mt-3 text-center text-sm leading-normal text-muted-foreground sm:text-start">{t.ctaNote}</p>
          </div>

          <ul className="mt-8 grid gap-3.5 border-t pt-6 sm:grid-cols-3 sm:gap-5">
            {t.proof.map((item, i) => {
              const Icon = proofIcons[i]
              return (
                <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug">
                  <Icon aria-hidden className="mt-px size-5 shrink-0 text-brand" strokeWidth={1.75} />
                  {item}
                </li>
              )
            })}
          </ul>
        </div>

        <HeroChat t={t.chat} />
      </div>
    </section>
  )
}
