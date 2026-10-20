import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BookingWidget } from "@/components/booking/booking-widget";
import { SectionHeader } from "@/components/landing/section-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { isLocale, localizeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/book">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).booking.page.metaTitle };
}

const ring =
  "outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// /[lang]/book: the booking page every "Book free call" button opens. Same look as the landing page
// (header row, black/grey uppercase title, mono text); the 3-step widget sits on a light grey panel.
export default async function BookPage({ params }: PageProps<"/[lang]/book">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const page = t.booking.page;

  return (
    <>
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href={localizeHref(lang, "/")} className={`rounded-sm ${ring}`}>
            <Image
              src="/brand/intelligentb2b-logo-light.png"
              alt={t.footer.logoAlt}
              width={896}
              height={200}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </a>
          <a
            href={localizeHref(lang, "/")}
            className={`inline-flex min-h-11 items-center gap-2 rounded-sm font-mono text-xs tracking-wide text-neutral-600 uppercase transition-colors hover:text-neutral-950 ${ring}`}
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            {page.back}
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex-1 bg-white text-neutral-950 outline-none">
        <section aria-labelledby="book-title" className="py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader label={page.eyebrow} tag={page.eyebrowEnd} />

            <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
              <h1
                id="book-title"
                translate="no"
                className="text-5xl leading-[0.92] font-medium tracking-tighter uppercase sm:text-6xl"
              >
                {`${page.title.strong} `}
                <span className="text-neutral-400">{page.title.soft}</span>
              </h1>
              <p className="max-w-sm font-mono text-xs leading-relaxed text-neutral-700 uppercase">{page.intro}</p>
            </div>

            <div className="mt-10 border border-neutral-200 lg:mt-14">
              <BookingWidget t={t.booking} lang={lang} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter t={t.footer} home={localizeHref(lang, "/")} />
    </>
  );
}
