import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Rejects any request that isn't the expected method.
 * Returns true when the request has already been handled (caller should return).
 */
export function guardMethod(
  req: VercelRequest,
  res: VercelResponse,
  method: "POST" | "GET"
): boolean {
  if (req.method === method) return false;
  res.setHeader("Allow", method);
  res.status(405).json({ success: false, error: "Method not allowed" });
  return true;
}

export function badRequest(res: VercelResponse, error: string) {
  res.status(400).json({ success: false, error });
}

export function serverError(res: VercelResponse, error: string) {
  res.status(500).json({ success: false, error });
}

/**
 * Body can arrive parsed (Vercel does this for JSON content-type) or as a raw
 * string depending on how the request was sent. Normalise both.
 */
export function readJsonBody(req: VercelRequest): Record<string, unknown> {
  const body = req.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof body === "object") return body as Record<string, unknown>;
  return {};
}
