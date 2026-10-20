import type { Locale } from "@/i18n/config"

// Site footer. Company details and legal links come from intelligentb2b.com. Text in [brackets] is
// not real yet.
const en = {
  navLabel: "Footer",
  logoAlt: "IntelligentB2B",
  nav: [
    { label: "Results", href: "#results" },
    { label: "Technology", href: "#technology" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  contact: {
    title: "Contact",
    email: "support@intelligentb2b.com",
    whatsapp: "+39 339 562 2204", // the phone number listed on intelligentb2b.com
  },
  company: {
    title: "Company",
    lines: ["Intelligent B2B Group SRL", "VAT RO51222966", "Aleea Avrig 3, Sector 2, 021851 Bucharest, Romania"],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "https://intelligentb2b.com/informativa-sulla-privacy" },
      { label: "Cookie policy", href: "https://intelligentb2b.com/cookie-policy-eu/" },
    ],
  },
  rights: "© {year} IntelligentB2B. All rights reserved.",
  tagline: "Ads + patient pre-screening for med spas",
}

export type FooterDict = typeof en

const it: FooterDict = {
  navLabel: "Footer",
  logoAlt: "IntelligentB2B",
  nav: [
    { label: "Risultati", href: "#results" },
    { label: "Tecnologia", href: "#technology" },
    { label: "FAQ", href: "#faq" },
    { label: "Contatti", href: "#contact" },
  ],
  contact: {
    title: "Contatti",
    email: "support@intelligentb2b.com",
    whatsapp: "+39 339 562 2204",
  },
  company: {
    title: "Azienda",
    lines: ["Intelligent B2B Group SRL", "P. IVA RO51222966", "Aleea Avrig 3, Settore 2, 021851 Bucarest, Romania"],
  },
  legal: {
    title: "Note legali",
    links: [
      { label: "Privacy policy", href: "https://intelligentb2b.com/informativa-sulla-privacy" },
      { label: "Cookie policy", href: "https://intelligentb2b.com/cookie-policy-eu/" },
    ],
  },
  rights: "© {year} IntelligentB2B. Tutti i diritti riservati.",
  tagline: "Pubblicità + pre-qualifica dei pazienti per cliniche estetiche",
}

// French and Arabic fall back to English until they are translated.
export const footer: Record<Locale, FooterDict> = { en, it, fr: en, ar: en }
