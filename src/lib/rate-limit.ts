// Small in-memory rate limiter (sliding window per key, e.g. per IP).
// It lives in the server instance's memory: on Vercel each instance counts on its own and the count
// resets on a cold start. That is enough to stop casual spam on a booking form; for strict limits
// across instances, move the counter to a shared store (e.g. Upstash Redis).

const hits = new Map<string, number[]>()

/** Records one hit for `key` and returns false once it has more than `limit` hits in `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)

  // Keep the map from growing forever on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k)
  }
  return true
}

/** Best-effort client IP from the proxy headers Vercel and most hosts set. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}
