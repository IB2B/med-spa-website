import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";

// Sections are added here in the reference order as their content arrives. Each one gets only its
// own text (`t`) for this language, plus `lang` for links and formatting.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <main id="main" tabIndex={-1} className="flex-1 outline-none" />;
}
