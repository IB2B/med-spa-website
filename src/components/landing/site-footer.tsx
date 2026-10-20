import Image from "next/image"

import { whatsappUrl } from "@/content/site"
import { fmt } from "@/i18n/config"
import type { FooterDict } from "@/i18n/dictionaries/footer"

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
const link = `inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-neutral-950 ${ring}`

// Footer: logo + section links, then Contact / Company / Legal in mono caps, then the © line.
// Everything stacks on mobile; every link is at least 44px tall. On other pages (e.g. /book) pass
// `home` ("/en") so the section links (#faq…) go back to the home page.
export function SiteFooter({ t, home = "" }: { t: FooterDict; home?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white text-neutral-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Image src="/brand/intelligentb2b-logo-light.png" alt={t.logoAlt} width={896} height={200} className="h-8 w-auto self-start sm:self-auto" />
          <nav aria-label={t.navLabel}>
            <ul className="flex flex-wrap gap-x-6 font-mono text-xs tracking-wide text-neutral-600 uppercase">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href.startsWith("#") ? `${home}${item.href}` : item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 grid gap-8 font-mono text-xs leading-relaxed tracking-wide text-neutral-600 uppercase sm:grid-cols-3">
          <div>
            <p className="font-medium text-neutral-950">{t.contact.title}</p>
            <ul className="mt-2">
              {/* Shown once a real address replaces the [bracketed] placeholder in footer.ts. */}
              {t.contact.email.startsWith("[") ? null : (
                <li>
                  <a href={`mailto:${t.contact.email}`} className={`${link} normal-case`}>
                    {t.contact.email}
                  </a>
                </li>
              )}
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  {t.contact.whatsapp}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-neutral-950">{t.company.title}</p>
            <ul className="mt-2 space-y-2 pt-3 normal-case">
              {t.company.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-neutral-950">{t.legal.title}</p>
            <ul className="mt-2">
              {t.legal.links.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-neutral-200 py-6 font-mono text-[0.6875rem] tracking-wide text-neutral-500 uppercase sm:flex-row sm:justify-between">
          <p>{fmt(t.rights, { year })}</p>
          <p>{t.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
