import type { VercelRequest } from "@vercel/node";

/**
 * Best-effort in-memory rate limiter.
 *
 * Serverless instances are recycled and requests can land on different
 * instances, so this is a speed bump rather than a guarantee — it stops a
 * single client hammering one warm instance, which covers casual abuse.
 * If the chat endpoint ever draws real abuse, move this to a shared store
 * (Upstash Redis / Vercel KV) so limits hold across instances.
 */
const hits = new Map<string, number[]>();

export function getClientKey(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (ip || req.socket?.remoteAddress || "unknown").trim();
}

/** Returns true when the caller is over budget. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return false;
}
