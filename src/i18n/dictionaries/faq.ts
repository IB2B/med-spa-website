import type { Locale } from "@/i18n/config"

// FAQ (with FAQPage JSON-LD built from `items`) and the black "Ready to fill your calendar?" band.
// Text in [brackets] is not real yet: fill it before launch.
const en = {
  eyebrow: "FAQ",
  eyebrowEnd: "Straight answers",
  title: { strong: "Questions", soft: "before you book" },
  note: "Still unsure? Ask us on the call.",
  items: [
    {
      q: "How fast will I see booked patients?",
      a: "Most clinics see their first booked consultations within [X] days of launch.",
    },
    {
      q: "Do you work with clinics in my city?",
      a: "We work with [one clinic per area / limited clinics per city], so you never compete with another client.",
    },
    {
      q: "What does it cost?",
      a: "We share the exact price on the free call, after the clinic analysis, because it depends on your treatments and goals. There are no hidden fees.",
    },
    {
      q: "Is there a long contract?",
      a: "[Answer: e.g. no long-term contract, cancel with 30 days' notice].",
    },
    {
      q: "What if the patients don't show up?",
      a: "Automatic reminders and online deposits cut no-shows, and every lead is pre-screened for budget before reaching you.",
    },
    {
      q: "Do I need to do social media or film content?",
      a: "No. We handle the ads. You focus on treatments.",
    },
    {
      q: "Do I have to change my booking software?",
      a: "[Answer: e.g. no, the system works alongside it / or we migrate everything for you].",
    },
    {
      q: "What happens on the free call?",
      a: "We analyze your clinic, your current numbers and your best treatments, and show you how many patients you could realistically add. No pressure.",
    },
  ],
  band: {
    title: [{ text: "Ready to fill" }, { text: "your calendar?", soft: true }],
    note: "Free clinic analysis. First 10 clinics only.",
    eyebrow: "The free call",
    eyebrowEnd: "30 minutes",
    steps: [
      "We look at your clinic, your numbers and your best treatments.",
      "You see how many patients you could realistically add.",
      "You leave with a plan. No pressure to sign.",
    ],
    calendar: { title: "Your calendar", tag: "Next week", legend: "Booked consultation" },
  },
  // Every "Book free call" button opens the booking page (/[lang]/book).
  cta: { label: "Book free call", href: "/book" },
}

export type FaqDict = typeof en

const it: FaqDict = {
  eyebrow: "FAQ",
  eyebrowEnd: "Risposte dirette",
  title: { strong: "Domande", soft: "prima di prenotare" },
  note: "Ancora dubbi? Chiedicelo durante la call.",
  items: [
    {
      q: "Quanto velocemente vedrò pazienti prenotati?",
      a: "La maggior parte delle cliniche vede le prime consulenze prenotate entro [X] giorni dal lancio.",
    },
    {
      q: "Lavorate con cliniche nella mia città?",
      a: "Lavoriamo con [una clinica per zona / poche cliniche per città], così non sei mai in concorrenza con un altro nostro cliente.",
    },
    {
      q: "Quanto costa?",
      a: "Ti diciamo il prezzo esatto durante la call gratuita, dopo l'analisi della clinica, perché dipende dai tuoi trattamenti e dai tuoi obiettivi. Nessun costo nascosto.",
    },
    {
      q: "C'è un contratto lungo?",
      a: "[Risposta: es. nessun contratto a lungo termine, disdetta con 30 giorni di preavviso].",
    },
    {
      q: "E se i pazienti non si presentano?",
      a: "Promemoria automatici e acconti online riducono le disdette, e ogni lead viene pre-qualificato sul budget prima di arrivare a te.",
    },
    {
      q: "Devo occuparmi dei social o girare contenuti?",
      a: "No. Alle pubblicità pensiamo noi. Tu pensa ai trattamenti.",
    },
    {
      q: "Devo cambiare il mio gestionale delle prenotazioni?",
      a: "[Risposta: es. no, il sistema lavora insieme al tuo / oppure migriamo tutto noi].",
    },
    {
      q: "Cosa succede durante la call gratuita?",
      a: "Analizziamo la tua clinica, i tuoi numeri attuali e i tuoi trattamenti migliori, e ti mostriamo quanti pazienti potresti realisticamente aggiungere. Nessuna pressione.",
    },
  ],
  band: {
    title: [{ text: "Vuoi riempire" }, { text: "la tua agenda?", soft: true }],
    note: "Analisi gratuita della clinica. Solo per le prime 10 cliniche.",
    eyebrow: "La call gratuita",
    eyebrowEnd: "30 minuti",
    steps: [
      "Analizziamo la tua clinica, i tuoi numeri e i tuoi trattamenti migliori.",
      "Vedi quanti pazienti potresti realisticamente aggiungere.",
      "Esci con un piano. Nessuna pressione a firmare.",
    ],
    calendar: { title: "La tua agenda", tag: "Settimana prossima", legend: "Consulenza prenotata" },
  },
  cta: { label: "Prenota una call gratuita", href: "/book" },
}

// French and Arabic fall back to English until they are translated.
export const faq: Record<Locale, FaqDict> = { en, it, fr: en, ar: en }
