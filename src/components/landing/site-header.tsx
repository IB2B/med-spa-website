import { localizeHref, type Locale } from "@/i18n/config"
import type { ChromeDict } from "@/i18n/dictionaries/chrome"

const focusRing = "rounded-md outline-none focus-visible:ring-3 focus-visible:ring-brand/40"

// Minimal top bar: the logo and one small "Log in" link, nothing else.
export function SiteHeader({ t, lang }: { t: ChromeDict; lang: Locale }) {
  return (
    <header className="py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* TODO(ib2b): replace the text placeholder with the Torch logo in public/brand/ */}
        <a href={localizeHref(lang, "/")} aria-label={t.header.homeLabel} className={`font-heading text-2xl font-medium ${focusRing}`}>
          Torch
        </a>
        {/* TODO(ib2b): link to the real login page */}
        <a
          href="#"
          className={`px-1 py-2 text-[0.9375rem] font-medium text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}
        >
          {t.header.login}
        </a>
      </div>
    </header>
  )
}
