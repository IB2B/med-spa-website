import type { Locale } from "@/i18n/config"

// "Sound familiar?" section between the hero and "What you get". Title parts with `soft: true`
// show in grey; the cards are numbered 01–05 in order.
const en = {
  eyebrow: "Sound familiar?",
  eyebrowEnd: "The problem",
  title: [
    { text: "Your clinic loses patients" },
    { text: "ready to pay", soft: true },
    { text: "every single day" },
  ],
  subline: "If even one of these sounds familiar, you're leaving thousands on the table every month.",
  items: [
    "Someone asks about a €1,500 treatment. Does your front desk really call them back within 5 minutes?",
    "You pay for ads, patients book a consultation… and never show up?",
    "You miss calls for laser hair removal because the phone rings while you're with another patient?",
    "Every empty slot on a high-ticket treatment is a hole in this month's revenue?",
    "You're tired of thinking about social media between treatments?",
  ],
  cta: { label: "There's a better way. See what you get", href: "#what-you-get" },
}

export type PainPointsDict = typeof en

const it: PainPointsDict = {
  eyebrow: "Ti suona familiare?",
  eyebrowEnd: "Il problema",
  title: [
    { text: "La tua clinica perde pazienti" },
    { text: "pronti a pagare", soft: true },
    { text: "ogni singolo giorno" },
  ],
  subline: "Se anche solo una di queste ti suona familiare, stai lasciando migliaia di euro sul tavolo ogni mese.",
  items: [
    "Qualcuno chiede informazioni per un trattamento da €1.500. La tua reception lo richiama davvero entro 5 minuti?",
    "Paghi la pubblicità, i pazienti prenotano una consulenza… e poi non si presentano?",
    "Perdi chiamate per l'epilazione laser perché il telefono squilla mentre sei con un'altra paziente?",
    "Ogni slot vuoto su un trattamento di fascia alta è un buco nel fatturato di questo mese?",
    "Non ne puoi più di pensare ai social tra un trattamento e l'altro?",
  ],
  cta: { label: "C'è un modo migliore. Scopri cosa ottieni", href: "#what-you-get" },
}

const fr: PainPointsDict = {
  eyebrow: "Ça vous parle ?",
  eyebrowEnd: "Le problème",
  title: [
    { text: "Votre clinique perd des patients" },
    { text: "prêts à payer", soft: true },
    { text: "chaque jour" },
  ],
  subline: "Si une seule de ces situations vous parle, vous laissez des milliers d'euros sur la table chaque mois.",
  items: [
    "Quelqu'un demande un soin à 1 500 €. Votre accueil le rappelle-t-il vraiment en moins de 5 minutes ?",
    "Vous payez des pubs, des patients réservent une consultation… et ne viennent jamais ?",
    "Vous ratez des appels pour l'épilation laser parce que le téléphone sonne pendant que vous êtes avec un autre patient ?",
    "Chaque créneau vide sur un soin haut de gamme, c'est un trou dans le chiffre d'affaires du mois ?",
    "Vous en avez assez de penser aux réseaux sociaux entre deux soins ?",
  ],
  cta: { label: "Il existe une meilleure façon. Voyez ce que vous obtenez", href: "#what-you-get" },
}

const ar: PainPointsDict = {
  eyebrow: "هل يبدو هذا مألوفًا؟",
  eyebrowEnd: "المشكلة",
  title: [
    { text: "عيادتك تخسر مرضى" },
    { text: "مستعدين للدفع", soft: true },
    { text: "كل يوم" },
  ],
  subline: "إذا بدا لك موقف واحد فقط من هذه المواقف مألوفًا، فأنت تخسر آلاف اليوروهات كل شهر.",
  items: [
    "شخص يسأل عن علاج بقيمة 1,500 €. هل يتصل به موظف الاستقبال فعلًا خلال 5 دقائق؟",
    "تدفع ثمن الإعلانات، فيحجز المرضى استشارة… ثم لا يحضرون؟",
    "تفوتك مكالمات إزالة الشعر بالليزر لأن الهاتف يرن وأنت مع مريض آخر؟",
    "كل موعد فارغ لعلاج مرتفع السعر هو ثغرة في إيرادات هذا الشهر؟",
    "هل سئمت من التفكير في وسائل التواصل الاجتماعي بين علاج وآخر؟",
  ],
  cta: { label: "هناك طريقة أفضل. اكتشف ما ستحصل عليه", href: "#what-you-get" },
}

export const painPoints: Record<Locale, PainPointsDict> = { en, it, fr, ar }
