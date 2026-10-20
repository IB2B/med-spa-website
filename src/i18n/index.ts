import type { Locale } from "@/i18n/config"
import { chrome } from "@/i18n/dictionaries/chrome"
import { common } from "@/i18n/dictionaries/common"
import { hero } from "@/i18n/dictionaries/hero"
import { booking } from "@/i18n/dictionaries/booking"
import { faq } from "@/i18n/dictionaries/faq"
import { footer } from "@/i18n/dictionaries/footer"
import { painPoints } from "@/i18n/dictionaries/pain-points"
import { technology } from "@/i18n/dictionaries/technology"

// All landing page text for one language. Each section file holds all four languages;
// only the requested one is passed to components, so the browser never loads the others.
// Server-side only: call it from pages and layouts, then pass each section its slice as `t`.
export function getDictionary(locale: Locale) {
  return {
    common: common[locale],
    chrome: chrome[locale],
    hero: hero[locale],
    painPoints: painPoints[locale],
    technology: technology[locale],
    faq: faq[locale],
    booking: booking[locale],
    footer: footer[locale],
  }
}

export type Dictionary = ReturnType<typeof getDictionary>
