import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRecord, isAirtableConfigured, TABLES } from "../_lib/airtable.js";

/**
 * Paystack webhook receiver.
 *
 * Paystack signs the RAW request body with HMAC SHA512 using your secret key,
 * so the signature must be checked against the exact bytes received — not a
 * re-serialised object. We disable Vercel's body parser and read the stream,
 * falling back to a re-stringify only if the body was already consumed.
 *
 * NOTE: verify this end-to-end with Paystack's dashboard webhook tester before
 * relying on it in production.
 */
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req: VercelRequest): Promise<string> {
  // If something upstream already parsed the body, the stream is drained.
  if (req.body !== undefined && req.body !== null && req.readableEnded) {
    return typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }

  if (chunks.length === 0 && req.body) {
    return typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Paystack webhook hit but PAYSTACK_SECRET_KEY is unset");
    return res.status(500).json({ success: false });
  }

  let rawBody: string;
  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    console.error("Could not read webhook body:", error);
    return res.status(400).json({ success: false });
  }

  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const received = req.headers["x-paystack-signature"];
  const signature = Array.isArray(received) ? received[0] : received;

  // Constant-time compare; length mismatch would make timingSafeEqual throw.
  const valid =
    typeof signature === "string" &&
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    console.warn("Rejected Paystack webhook with bad signature");
    return res.status(401).json({ success: false });
  }

  let event: { event?: string; data?: Record<string, any> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ success: false });
  }

  // Acknowledge fast — Paystack retries on non-2xx, and processing failures
  // shouldn't cause duplicate deliveries.
  if (event.event === "charge.success" && isAirtableConfigured()) {
    try {
      const data = event.data || {};
      await createRecord(TABLES.payments, {
        Reference: String(data.reference || ""),
        Email: String(data.customer?.email || ""),
        // Paystack reports in kobo.
        "Amount (NGN)": typeof data.amount === "number" ? data.amount / 100 : 0,
        Course: String(data.metadata?.courseTitle || ""),
        Name: String(data.metadata?.customerName || ""),
        Status: String(data.status || ""),
        "Paid At": String(data.paid_at || new Date().toISOString()),
      });
    } catch (error) {
      // Logged, not surfaced — Paystack only needs the 200.
      console.error("Could not record Paystack payment:", error);
    }
  }

  return res.status(200).json({ success: true });
}
