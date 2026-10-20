// Shared by the newsletter form (browser) and /api/newsletter (server).
// Practical check, not the full RFC: one @, a dot in the domain, no spaces, sane length.
export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}
