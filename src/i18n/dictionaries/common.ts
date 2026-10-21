import type { Locale } from "@/i18n/config"

// Page title and description for search engines and link previews.
const en = {
  meta: {
    title: "IntelligentB2B | Booked patients for med spas",
    description:
      "We fill your med spa calendar with patients ready to pay for Botox, fillers, laser hair removal and body contouring. Get your free clinic growth analysis.",
  },
}

export type CommonDict = typeof en

const it: CommonDict = {
  meta: {
    title: "IntelligentB2B | Pazienti prenotati per centri di medicina estetica",
    description:
      "Riempiamo l'agenda del tuo centro di medicina estetica con pazienti pronti a pagare per botox, filler, epilazione laser e rimodellamento corporeo. Richiedi la tua analisi gratuita.",
  },
}

const fr: CommonDict = {
  meta: {
    title: "Torch | Pour les cliniques de médecine esthétique",
    description:
      "Chaque patient qui vous écrit devient un rendez-vous dans votre agenda. Torch répond sur WhatsApp en quelques secondes et fixe la consultation.",
  },
}

const ar: CommonDict = {
  meta: {
    title: "Torch | لعيادات الطب التجميلي",
    description: "كل مريض يراسلك يصبح موعدًا في جدولك. يرد Torch على واتساب خلال ثوانٍ ويحجز الاستشارة.",
  },
}

export const common: Record<Locale, CommonDict> = { en, it, fr, ar }
