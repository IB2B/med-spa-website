// Languages of the landing page. English is the fallback when the browser asks for none of these.
export const locales = ["en", "it", "fr", "ar"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Arabic reads right to left; everything else left to right. */
export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr"
}

/** Names shown in the language switcher, each in its own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  fr: "Français",
  ar: "العربية",
}

/** Short labels for compact switchers. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  it: "IT",
  fr: "FR",
  ar: "AR",
}

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  it: "it_IT",
  fr: "fr_FR",
  ar: "ar_AR",
}

/** Cookie that remembers the visitor's choice from the language switcher. */
export const LOCALE_COOKIE = "medspa-locale"

/** "/privacy" → "/it/privacy". Leaves anchors (#pricing) and external URLs alone. */
export function localizeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href
  return href === "/" ? `/${locale}` : `/${locale}${href}`
}

/** Replaces {name} placeholders: fmt("{n} days", { n: 14 }) → "14 days". */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}
