import type { Locale } from "@/i18n/config"

// Header (and later the footer, cookie banner and language switcher).
const en = {
  header: {
    homeLabel: "Torch, back to the top",
    login: "Log in",
  },
}

export type ChromeDict = typeof en

const it: ChromeDict = {
  header: {
    homeLabel: "Torch, torna all'inizio",
    login: "Accedi",
  },
}

const fr: ChromeDict = {
  header: {
    homeLabel: "Torch, retour en haut",
    login: "Se connecter",
  },
}

const ar: ChromeDict = {
  header: {
    homeLabel: "Torch، العودة إلى الأعلى",
    login: "تسجيل الدخول",
  },
}

export const chrome: Record<Locale, ChromeDict> = { en, it, fr, ar }
