import type { Locale } from "@/i18n/config"

// Page title and description for search engines and link previews.
// TODO(ib2b): placeholders until the user sends the real title and description.
const en = {
  meta: {
    title: "Med Spa | Intelligent B2B",
    description: "Med spa landing page.",
  },
}

export type CommonDict = typeof en

const it: CommonDict = {
  meta: {
    title: "Med Spa | Intelligent B2B",
    description: "Landing page per centri di medicina estetica.",
  },
}

const fr: CommonDict = {
  meta: {
    title: "Med Spa | Intelligent B2B",
    description: "Page d'accueil pour centres de médecine esthétique.",
  },
}

const ar: CommonDict = {
  meta: {
    title: "Med Spa | Intelligent B2B",
    description: "صفحة هبوط لمراكز التجميل الطبي.",
  },
}

export const common: Record<Locale, CommonDict> = { en, it, fr, ar }
