import type { Locale } from "@/i18n/config"
import { common } from "@/i18n/dictionaries/common"

// All landing page text for one language. Each section file holds all four languages;
// only the requested one is passed to components, so the browser never loads the others.
// Server-side only: call it from pages and layouts, then pass each section its slice as `t`.
export function getDictionary(locale: Locale) {
  return {
    common: common[locale],
  }
}

export type Dictionary = ReturnType<typeof getDictionary>
