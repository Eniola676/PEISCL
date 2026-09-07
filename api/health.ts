import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAirtableConfigured, TABLES } from "./_lib/airtable.js";
import { guardMethod } from "./_lib/http.js";

/**
 * Configuration health check.
 *
 * Reports only booleans and table names — never secret values — so it's safe
 * to hit from a browser while setting the site up.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "GET")) return;

  const airtable = isAirtableConfigured();
  const chat = Boolean(process.env.ANTHROPIC_API_KEY);
  const paystackKey = Boolean(process.env.PAYSTACK_SECRET_KEY);
  const paystackEnabled = process.env.PAYSTACK_ENABLED === "true";

  res.status(200).json({
    ok: airtable,
    checks: {
      forms: {
        configured: airtable,
        detail: airtable
          ? "Airtable credentials present — form submissions will be saved."
          : "MISSING AIRTABLE_TOKEN and/or AIRTABLE_BASE_ID — all form submissions will fail.",
        tables: TABLES,
      },
      chat: {
        configured: chat,
        detail: chat
          ? "ANTHROPIC_API_KEY present — the chat assistant is live."
          : "No ANTHROPIC_API_KEY — the chat widget will say it's unavailable.",
      },
      payments: {
        configured: paystackEnabled && paystackKey,
        detail: !paystackEnabled
          ? "Paystack is OFF (PAYSTACK_ENABLED is not 'true'). This is the safe default until course prices are set."
          : paystackKey
            ? "Paystack is ON. Confirm COURSE_PRICES_NGN is filled in before taking payments."
            : "PAYSTACK_ENABLED is 'true' but PAYSTACK_SECRET_KEY is missing — checkout will fail.",
      },
    },
  });
}
