"use client"

import { useEffect, useState } from "react"
import { BatteryFull, Check, CheckCheck, ChevronLeft, Mic, Signal } from "lucide-react"

import type { HeroDict } from "@/i18n/dictionaries/hero"

type ChatDict = HeroDict["chat"]
type Sender = ChatDict["messages"][number]["from"]

const bubble = "relative max-w-[82%] rounded-[10px] shadow-xs animate-pop motion-reduce:animate-none"
const side: Record<Sender, string> = {
  patient: "self-start rounded-ss-[3px] bg-wa-in",
  clinic: "self-end rounded-se-[3px] bg-wa-out",
}

// A WhatsApp conversation in a phone, built in HTML/CSS. It plays once on load: each reply is
// preceded by typing dots, then the "booked" card appears. With reduced motion it shows at once.
export function HeroChat({ t }: { t: ChatDict }) {
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState<Sender | null>(null)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(0, () => {
        setShown(t.messages.length)
        setBooked(true)
      })
    } else {
      let time = 500
      t.messages.forEach((message, i) => {
        if (i > 0) {
          at(time, () => setTyping(message.from))
          time += message.from === "patient" ? 1100 : 1500
          at(time, () => setTyping(null))
        }
        at(time, () => setShown(i + 1))
        time += 700
      })
      at(time + 300, () => setBooked(true))
    }

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [t.messages])

  return (
    <div className="relative flex justify-center pt-2 pb-10 lg:p-0">
      <figure
        aria-label={t.label}
        className="relative m-0 w-[min(320px,86vw)] rounded-[44px] bg-device p-2.5 shadow-2xl shadow-foreground/30"
      >
        <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[35px] bg-wa-chat sm:h-[600px]">
          <div aria-hidden className="absolute top-2.5 left-1/2 z-10 h-[26px] w-24 -translate-x-1/2 rounded-full bg-device" />
          <div aria-hidden className="flex h-11 items-center justify-between bg-wa-header px-6 pt-3 text-[0.8125rem] font-semibold">
            <span>21:48</span>
            <span className="flex items-center gap-1">
              <Signal className="size-3.5" strokeWidth={2.5} />
              <BatteryFull className="size-4" />
            </span>
          </div>

          <div className="flex items-center gap-2.5 border-b bg-wa-header px-3.5 pt-2 pb-2.5">
            <ChevronLeft aria-hidden className="size-[18px] shrink-0 text-wa-meta rtl:rotate-180" />
            <div aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint text-[0.9375rem] font-semibold text-brand">
              {t.contact.charAt(0)}
            </div>
            <div>
              <div className="text-[0.9375rem] leading-tight font-semibold">{t.contact}</div>
              <div className="text-xs leading-snug text-wa-meta">{typing === "patient" ? t.typing : t.online}</div>
            </div>
          </div>

          <div role="log" className="flex flex-1 flex-col gap-1.5 overflow-hidden px-3 py-3.5 text-sm leading-snug">
            <div className="mb-1.5 self-center rounded-lg bg-wa-in/75 px-2.5 py-1 text-[0.6875rem] font-medium text-wa-meta">
              {t.today}
            </div>

            {t.messages.slice(0, shown).map((message) => (
              <div key={message.text} className={`${bubble} ${side[message.from]} pt-[7px] ps-2.5 pe-2 pb-1.5`}>
                <span className="sr-only">
                  {message.from === "patient" ? t.patient : t.clinic}, {message.time}:{" "}
                </span>
                {message.text}
                <span className="float-end ms-2.5 mt-1.5 -mb-[3px] inline-flex items-center gap-[3px] text-[0.6875rem] leading-none text-wa-meta">
                  {message.time}
                  {message.from === "clinic" ? <CheckCheck aria-hidden className="size-3.5 text-wa-read" /> : null}
                </span>
              </div>
            ))}

            {typing ? (
              <div aria-hidden className={`${bubble} ${side[typing]} inline-flex items-center gap-1 px-3 py-[11px]`}>
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="size-1.5 rounded-full bg-wa-meta/70 animate-typing-dot motion-reduce:animate-none"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div aria-hidden className="flex items-center gap-2 px-2.5 pt-2 pb-[18px]">
            <div className="flex h-[38px] flex-1 items-center rounded-full bg-wa-in px-3.5 text-[0.8125rem] text-wa-meta">
              {t.composer}
            </div>
            <div className="grid size-[38px] shrink-0 place-items-center rounded-full bg-wa-send text-brand-foreground">
              <Mic className="size-4" />
            </div>
          </div>
        </div>
      </figure>

      {booked ? (
        <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 animate-card-in items-center gap-3 rounded-xl border bg-card py-3 ps-3 pe-4 whitespace-nowrap shadow-xl shadow-foreground/10 motion-reduce:animate-none lg:start-auto lg:end-[calc(50%+120px)] lg:bottom-16 lg:translate-x-0">
          <div aria-hidden className="grid size-[34px] shrink-0 place-items-center rounded-full bg-success-tint text-success">
            <Check className="size-[18px]" strokeWidth={2.5} />
          </div>
          <div>
            <strong className="block text-sm leading-snug font-semibold">{t.bookedTitle}</strong>
            <span className="block text-[0.8125rem] leading-snug text-muted-foreground">{t.bookedWhen}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
