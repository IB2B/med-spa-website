import { CtaPair } from "@/components/landing/agency-hero"
import { localizeHref, type Locale } from "@/i18n/config"

// ─── Edit everything here ───────────────────────────────────────────────────────────────────────
// Anything marked PLACEHOLDER is not final yet: replace it before going live.
const copy = {
  eyebrow: "What you get",
  eyebrowEnd: "The offer",
  title: { strong: "What you get", soft: "every month" },
  subline: "No likes, no followers. Booked patients you can count.",
  items: [
    {
      title: "Booked consultations, not leads",
      body: "We deliver patients straight to your calendar. Your front desk confirms, they don't chase.",
      tag: "Booked, not chased",
    },
    {
      title: "Patients pre-screened for budget",
      body: "Every lead is qualified on budget and treatment before they reach you.",
      tag: "Only serious buyers",
    },
    {
      title: "Ads built for your treatments",
      body: "Campaigns for Botox, fillers, laser hair removal and body contouring. Never generic beauty ads.",
      tag: "Made for med spas", // PLACEHOLDER tag
    },
    {
      // PLACEHOLDER card: taken from the hero's old "What you get" list
      title: "One clear monthly report",
      body: "What each booked patient cost you, in one page.",
      tag: "Cost per patient",
    },
  ],
}
// ────────────────────────────────────────────────────────────────────────────────────────────────

// Same look as the testimonials: header row with the accent diamond, black/grey uppercase title,
// small uppercase text, light grey cards with an accent number and a result tag bottom right.
export function OfferSection({ lang }: { lang: Locale }) {
  return (
    <section id="what-you-get" aria-labelledby="offer-title" className="scroll-mt-6 bg-white py-16 text-neutral-950 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-t border-neutral-200 pt-5 font-sans text-xs tracking-wide text-neutral-600 uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
            {copy.eyebrow}
          </span>
          <span>{copy.eyebrowEnd}</span>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:items-center lg:gap-10">
          <div>
            <h2
              id="offer-title"
              translate="no"
              className="text-5xl leading-[0.92] font-medium tracking-tighter uppercase sm:text-6xl"
            >
              {`${copy.title.strong} `}
              <span className="text-neutral-400">{copy.title.soft}</span>
            </h2>
            <p className="mt-6 max-w-sm font-sans text-xs leading-relaxed text-neutral-700 uppercase">{copy.subline}</p>
            <div className="mt-8">
              <CtaPair href={localizeHref(lang, "/book")} />
            </div>
          </div>

          <ol className="grid gap-2 sm:grid-cols-2">
            {copy.items.map((item, i) => (
              <li key={item.title} className="flex min-h-[17rem] flex-col bg-neutral-100 p-6 sm:p-7">
                <span aria-hidden="true" className="font-sans text-sm font-medium text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl leading-tight font-medium tracking-tight">{item.title}</h3>
                <p className="mt-3 font-sans text-xs leading-relaxed text-neutral-700 uppercase">{item.body}</p>
                <p className="mt-auto self-end pt-6 font-sans text-[0.6875rem] tracking-wide text-neutral-500 uppercase">{item.tag}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
