import { NextResponse, type NextRequest } from "next/server"

import { defaultLocale } from "@/i18n/config"

// The site is Italian only, served at the root: / and /book show the /it pages without "/it" in the
// address. /it/... redirects to the unprefixed address so each page has one URL. Other language
// prefixes (/en, /fr, /ar) are not published and end up on the 404 page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const prefix = `/${defaultLocale}`

  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(prefix.length) || "/"
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = `${prefix}${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Pages only: skip the API, Next.js internals, Vercel BotID's own routes (added by withBotId in
  // next.config.ts) and any file with an extension (images, icons…).
  matcher: ["/((?!api|_next|149e9513-01fa-4fb0-aad4-566afd725d1b|.*\\..*).*)"],
}
