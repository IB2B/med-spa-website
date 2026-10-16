import { NextResponse, type NextRequest } from "next/server"

import { LOCALE_COOKIE, defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"

// Picks a language for addresses without one (/ → /it, /privacy → /it/privacy):
// 1. the visitor's earlier choice from the language switcher (cookie),
// 2. otherwise the best match from the browser's Accept-Language header,
// 3. otherwise English.
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value
  if (saved && isLocale(saved)) return saved

  const header = request.headers.get("accept-language") ?? ""
  const wanted = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  return wanted.find((w) => isLocale(w.lang))?.lang as Locale | undefined ?? defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return

  const url = request.nextUrl.clone()
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Pages only: skip the API, Next.js internals, Vercel BotID's own routes (added by withBotId in
  // next.config.ts) and any file with an extension (images, icons…).
  matcher: ["/((?!api|_next|149e9513-01fa-4fb0-aad4-566afd725d1b|.*\\..*).*)"],
}
