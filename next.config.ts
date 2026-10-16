import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

// Security headers on every response (Vercel already adds Strict-Transport-Security).
// The CSP only has the rules that can't break the page: other sites can't frame it, no <base> or
// <object> tricks, forms only post here. A full script allowlist would need a fresh nonce per request,
// which turns off static pages; with 'unsafe-inline' instead it wouldn't stop injected scripts anyway.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Images come only from /public (the user's own photos), so no remote image hosts are allowed.
const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

// withBotId adds the routes Vercel BotID's invisible check loads from (protected routes are listed in
// src/instrumentation-client.ts, added with the booking page).
// Its own headers for those routes come after ours, so they win there.
export default withBotId(nextConfig);
