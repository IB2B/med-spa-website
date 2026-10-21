import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic, Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { siteName, siteUrl } from "@/content/site";
import { defaultLocale, dirOf, isLocale, localizeHref, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

// Body text, labels, notes and buttons.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

// Serif for the hero intro text (font-serif).
const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

// Inter and Source Serif have no Arabic letters; Arabic pages switch to IBM Plex Sans Arabic (see globals.css).
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Only the Italian pages are published (served at / by src/proxy.ts); any other first segment is a 404.
// The other languages' text stays in the dictionaries for later.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: defaultLocale }];
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = getDictionary(lang).common.meta;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: localizeHref(lang, "/"),
    },
    openGraph: {
      type: "website",
      url: localizeHref(lang, "/"),
      siteName,
      locale: ogLocale[lang],
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      // Keeps page-to-page navigation instant while in-page anchors scroll smoothly (globals.css).
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable} ${plexArabic.variable} h-full antialiased`}
    >
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) inject attributes on <body>. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        {/* Vercel Web Analytics: page views only, no cookies. */}
        <Analytics />
      </body>
    </html>
  );
}
