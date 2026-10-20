import type { Locale } from "@/i18n/config"

// "Discover Torch" bento between "What you get" and the testimonials. `icon` picks the line icon
// in the component (calendar, missed-call, inbox, reminders, deposits, patients, reviews, promos, stats).
const en = {
  eyebrow: "The technology",
  eyebrowEnd: "All in one system",
  title: { strong: "Discover", soft: "Torch™" }, // PLACEHOLDER: confirm the system name
  subline: "Everything your clinic needs to fill the calendar with high-ticket treatments, in one easy system.",
  closeUp: "Close-up",
  pipeline: {
    title: "Patient pipeline at a glance",
    body: "See who booked, who showed up and who bought, in one view.",
    columns: ["New lead", "Booked", "Treatment paid"],
  },
  assistant: {
    title: "Your 24/7 virtual assistant",
    body: "Works day and night, so no patient waits for a reply.",
    steps: ["New lead", "SMS sent", "Booked"],
  },
  features: [
    { icon: "calendar", title: "Smart calendar", body: "No double bookings." },
    { icon: "missed-call", title: "Missed-call text back", body: "Auto SMS when you can't pick up." },
    { icon: "inbox", title: "SMS & WhatsApp inbox", body: "Reply to patients from one screen." },
    { icon: "reminders", title: "Automatic reminders", body: "Cut last-minute no-shows." },
    { icon: "deposits", title: "Deposits online", body: "Patients pay upfront to secure the slot." },
    { icon: "patients", title: "Patient database", body: "History, treatments and birthdays in one place." },
    { icon: "reviews", title: "5-star reviews", body: "Asks for a Google review after each visit." },
    { icon: "promos", title: "One-click promotions", body: "Black Friday or Christmas offers in one click." },
    { icon: "stats", title: "Clear stats", body: "See how much money each campaign brings in." },
  ],
  cta: { label: "See it live on your clinic", href: "/book" },
}

export type TechnologyDict = typeof en
export type FeatureIcon = TechnologyDict["features"][number]["icon"]

const it: TechnologyDict = {
  eyebrow: "La tecnologia",
  eyebrowEnd: "Tutto in un unico sistema",
  title: { strong: "Scopri", soft: "Torch™" },
  subline: "Tutto ciò che serve alla tua clinica per riempire l'agenda di trattamenti di fascia alta, in un unico sistema semplice.",
  closeUp: "Da vicino",
  pipeline: {
    title: "La pipeline dei pazienti a colpo d'occhio",
    body: "Vedi chi ha prenotato, chi si è presentato e chi ha acquistato, in un'unica schermata.",
    columns: ["Nuovo lead", "Prenotato", "Trattamento pagato"],
  },
  assistant: {
    title: "Il tuo assistente virtuale 24/7",
    body: "Lavora giorno e notte, così nessun paziente aspetta una risposta.",
    steps: ["Nuovo lead", "SMS inviato", "Prenotato"],
  },
  features: [
    { icon: "calendar", title: "Agenda intelligente", body: "Niente doppie prenotazioni." },
    { icon: "missed-call", title: "SMS dopo chiamata persa", body: "SMS automatico quando non puoi rispondere." },
    { icon: "inbox", title: "Inbox SMS e WhatsApp", body: "Rispondi ai pazienti da un'unica schermata." },
    { icon: "reminders", title: "Promemoria automatici", body: "Riduci le disdette dell'ultimo minuto." },
    { icon: "deposits", title: "Acconti online", body: "I pazienti pagano in anticipo per bloccare lo slot." },
    { icon: "patients", title: "Database pazienti", body: "Storico, trattamenti e compleanni in un unico posto." },
    { icon: "reviews", title: "Recensioni a 5 stelle", body: "Chiede una recensione Google dopo ogni visita." },
    { icon: "promos", title: "Promozioni in un clic", body: "Offerte di Black Friday o Natale in un clic." },
    { icon: "stats", title: "Statistiche chiare", body: "Vedi quanto incassa ogni campagna." },
  ],
  cta: { label: "Guardalo dal vivo sulla tua clinica", href: "/book" },
}

// French and Arabic fall back to English until they are translated.
export const technology: Record<Locale, TechnologyDict> = { en, it, fr: en, ar: en }
