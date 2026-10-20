import type { Locale } from "@/i18n/config"

// Hero: sells the result (a full calendar), never the software. Italian health advertising rules
// apply (L. 145/2018, comma 525): no discounts, no before/after, no promised results, no exclamation marks.
const en = {
  eyebrow: "For aesthetic medicine clinics",
  title: "Every patient who messages you becomes an appointment in your calendar.",
  lead: "Torch replies on WhatsApp within seconds, even at 10 pm, books the consultation and gets back in touch with patients when it's time for their next treatment. You focus on your patients, your calendar fills itself.",
  cta: "Check if your city is available",
  ctaNote: "We work with one clinic per city. Free 20-minute review.",
  secondary: "See how it works",
  proof: [
    "Replies in under 60 seconds",
    "Patients contacted at the right time",
    "Messages that follow medical board rules",
  ],
  chat: {
    label: "Example WhatsApp conversation between a patient and the clinic",
    contact: "Giulia",
    online: "online",
    typing: "typing…",
    today: "Today",
    composer: "Message",
    patient: "Patient",
    clinic: "Clinic",
    messages: [
      { from: "patient", time: "21:47", text: "Good evening, I'd like some information about a lip treatment. Are you open on Saturday?" },
      { from: "clinic", time: "21:47", text: "Good evening Giulia, of course. Dr Rossi has a free consultation slot on Saturday at 10:30 or 12:00. Which would you prefer?" },
      { from: "patient", time: "21:48", text: "10:30 is perfect" },
      { from: "clinic", time: "21:48", text: "Done ✓ I've sent you the confirmation and directions. See you on Saturday." },
    ] as { from: "patient" | "clinic"; time: string; text: string }[],
    bookedTitle: "Consultation booked",
    bookedWhen: "Saturday 10:30",
  },
}

export type HeroDict = typeof en

const it: HeroDict = {
  eyebrow: "Per cliniche di medicina estetica",
  title: "Ogni paziente che ti scrive diventa un appuntamento in agenda.",
  lead: "Torch risponde su WhatsApp in pochi secondi, anche alle 22, fissa la consulenza e richiama i pazienti quando è il momento del prossimo trattamento. Tu pensi ai pazienti, l'agenda si riempie da sola.",
  cta: "Verifica se la tua città è disponibile",
  ctaNote: "Lavoriamo con una sola clinica per città. Analisi gratuita di 20 minuti.",
  secondary: "Guarda come funziona",
  proof: [
    "Risposta in meno di 60 secondi",
    "Pazienti richiamati al momento giusto",
    "Comunicazioni nel rispetto delle regole dell'Ordine",
  ],
  chat: {
    label: "Esempio di conversazione WhatsApp tra una paziente e la clinica",
    contact: "Giulia",
    online: "online",
    typing: "sta scrivendo…",
    today: "Oggi",
    composer: "Messaggio",
    patient: "Paziente",
    clinic: "Clinica",
    messages: [
      { from: "patient", time: "21:47", text: "Buonasera, vorrei informazioni per un trattamento alle labbra, siete aperti sabato?" },
      { from: "clinic", time: "21:47", text: "Buonasera Giulia, certo. La dottoressa Rossi ha una consulenza libera sabato alle 10:30 o alle 12:00. Quale preferisce?" },
      { from: "patient", time: "21:48", text: "10:30 perfetto" },
      { from: "clinic", time: "21:48", text: "Fatto ✓ Le ho inviato conferma e indicazioni. A sabato." },
    ],
    bookedTitle: "Consulenza prenotata",
    bookedWhen: "Sabato 10:30",
  },
}

const fr: HeroDict = {
  eyebrow: "Pour les cliniques de médecine esthétique",
  title: "Chaque patient qui vous écrit devient un rendez-vous dans votre agenda.",
  lead: "Torch répond sur WhatsApp en quelques secondes, même à 22 h, fixe la consultation et recontacte les patients au moment de leur prochain soin. Vous vous occupez de vos patients, votre agenda se remplit tout seul.",
  cta: "Vérifiez si votre ville est disponible",
  ctaNote: "Nous travaillons avec une seule clinique par ville. Analyse gratuite de 20 minutes.",
  secondary: "Voir comment ça marche",
  proof: [
    "Réponse en moins de 60 secondes",
    "Patients recontactés au bon moment",
    "Messages conformes aux règles de l'Ordre",
  ],
  chat: {
    label: "Exemple de conversation WhatsApp entre une patiente et la clinique",
    contact: "Giulia",
    online: "en ligne",
    typing: "écrit…",
    today: "Aujourd'hui",
    composer: "Message",
    patient: "Patiente",
    clinic: "Clinique",
    messages: [
      { from: "patient", time: "21:47", text: "Bonsoir, je voudrais des informations sur un soin des lèvres. Êtes-vous ouverts samedi ?" },
      { from: "clinic", time: "21:47", text: "Bonsoir Giulia, bien sûr. La docteure Rossi a une consultation libre samedi à 10 h 30 ou à 12 h. Que préférez-vous ?" },
      { from: "patient", time: "21:48", text: "10 h 30, parfait" },
      { from: "clinic", time: "21:48", text: "C'est fait ✓ Je vous ai envoyé la confirmation et les indications. À samedi." },
    ],
    bookedTitle: "Consultation réservée",
    bookedWhen: "Samedi 10 h 30",
  },
}

const ar: HeroDict = {
  eyebrow: "لعيادات الطب التجميلي",
  title: "كل مريض يراسلك يصبح موعدًا في جدولك.",
  lead: "يرد Torch على واتساب خلال ثوانٍ، حتى في العاشرة مساءً، ويحجز الاستشارة، ويتواصل مع المرضى عندما يحين موعد علاجهم التالي. أنت تهتم بمرضاك، وجدولك يمتلئ من تلقاء نفسه.",
  cta: "تحقق مما إذا كانت مدينتك متاحة",
  ctaNote: "نعمل مع عيادة واحدة فقط في كل مدينة. تحليل مجاني لمدة 20 دقيقة.",
  secondary: "شاهد كيف يعمل",
  proof: [
    "رد في أقل من 60 ثانية",
    "التواصل مع المرضى في الوقت المناسب",
    "رسائل تلتزم بقواعد نقابة الأطباء",
  ],
  chat: {
    label: "مثال على محادثة واتساب بين مريضة والعيادة",
    contact: "جوليا",
    online: "متصلة",
    typing: "تكتب…",
    today: "اليوم",
    composer: "رسالة",
    patient: "المريضة",
    clinic: "العيادة",
    messages: [
      { from: "patient", time: "21:47", text: "مساء الخير، أود معلومات عن علاج للشفاه. هل أنتم مفتوحون يوم السبت؟" },
      { from: "clinic", time: "21:47", text: "مساء الخير جوليا، بالتأكيد. لدى الدكتورة روسي موعد استشارة متاح يوم السبت في 10:30 أو 12:00. أيهما تفضلين؟" },
      { from: "patient", time: "21:48", text: "10:30 ممتاز" },
      { from: "clinic", time: "21:48", text: "تم ✓ أرسلت لك التأكيد والتعليمات. نراك يوم السبت." },
    ],
    bookedTitle: "تم حجز الاستشارة",
    bookedWhen: "السبت 10:30",
  },
}

export const hero: Record<Locale, HeroDict> = { en, it, fr, ar }
