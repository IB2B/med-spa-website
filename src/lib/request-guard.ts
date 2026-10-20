// Checks for the API routes behind the public forms (booking and newsletter).
//
// Our own pages call these routes with fetch and a JSON body. Another website could make its
// visitors' browsers post to them too: a "simple" request (e.g. text/plain) needs no CORS preflight,
// so it would go through and spread fake bookings over thousands of real IPs, past the rate limits.
// Browsers say where a request comes from (Sec-Fetch-Site, Origin), so those requests are rejected here.
// Scripts outside a browser can fake these headers; BotID and the rate limits deal with those.

/** False when a browser says the request was sent by another website. */
export function isSameSite(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site")
  // "none" = typed in the address bar or opened from a bookmark.
  if (site) return site === "same-origin" || site === "none"
  // Browsers without Fetch Metadata still send Origin on cross-site POSTs.
  const origin = request.headers.get("origin")
  return !origin || origin === new URL(request.url).origin
}

/** True when the body is sent as JSON. A cross-site JSON post needs a CORS preflight, which our API never allows. */
export function isJson(request: Request): boolean {
  return /^application\/json\b/i.test(request.headers.get("content-type") ?? "")
}
