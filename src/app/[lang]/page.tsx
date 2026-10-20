import { notFound } from "next/navigation";

import { AgencyHero } from "@/components/landing/agency-hero";
import { ClientMessages } from "@/components/landing/client-messages";
import { FaqSection } from "@/components/landing/faq-section";
import { OfferSection } from "@/components/landing/offer-section";
import { PainPoints } from "@/components/landing/pain-points";
import { SiteFooter } from "@/components/landing/site-footer";
import { TechnologySection } from "@/components/landing/technology-section";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

// Order: hero → pain points → what you get → technology → testimonials → FAQ + black CTA band
// (#contact) → footer. Every "Book free call" opens /[lang]/book. Hero, "What you get" and testimonials still keep their (English) text in the
// component; the other sections read from the dictionaries.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  // FAQPage structured data, built from the same questions the accordion shows.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <main id="main" tabIndex={-1} className="flex-1 bg-white outline-none">
        <AgencyHero lang={lang} />
        <PainPoints t={t.painPoints} />
        <OfferSection lang={lang} />
        <TechnologySection t={t.technology} lang={lang} />
        <ClientMessages lang={lang} />
        <FaqSection t={t.faq} lang={lang} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
        />
      </main>
      <SiteFooter t={t.footer} />
    </>
  );
}
