import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getBaseId,
  isAirtableConfigured,
  isBaseIdWellFormed,
  probeTable,
  TABLES,
} from "./_lib/airtable.js";
import { activeProvider } from "./_lib/chatProvider.js";
import { guardMethod } from "./_lib/http.js";

/**
 * Configuration health check.
 *
 * Plain GET reports only booleans — never secret values.
 *
 * GET /api/health?probe=1 additionally writes a test row to each table and
 * deletes it again, reporting exactly what Airtable rejected. Use this while
 * setting the site up; it's the fastest way to find a table or field-name
 * mismatch.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "GET")) return;

  const airtable = isAirtableConfigured();
  const provider = activeProvider();
  const chat = Boolean(provider);
  const paystackKey = Boolean(process.env.PAYSTACK_SECRET_KEY);
  const paystackEnabled = process.env.PAYSTACK_ENABLED === "true";

  const body: Record<string, unknown> = {
    ok: airtable,
    checks: {
      forms: {
        configured: airtable,
        detail: !airtable
          ? "MISSING AIRTABLE_TOKEN and/or AIRTABLE_BASE_ID — all form submissions will fail."
          : !isBaseIdWellFormed()
            ? `AIRTABLE_BASE_ID does not look like a base ID. It must be just the "app..." segment — not the full URL or the app/tbl/viw path.`
            : "Airtable credentials present. Add ?probe=1 to verify the tables and fields actually accept a write.",
        // Echoing the resolved base ID is safe (it's not a secret) and makes a
        // bad paste obvious at a glance.
        baseId: getBaseId() || null,
        baseIdWellFormed: isBaseIdWellFormed(),
        tables: TABLES,
      },
      chat: {
        configured: chat,
        provider,
        detail: chat
          ? `Chat is live via ${provider}.`
          : "No GEMINI_API_KEY or ANTHROPIC_API_KEY — the chat widget stays hidden.",
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
  };

  if (req.query.probe && airtable) {
    const now = new Date().toISOString();

    const [registrations, guidance, newsletter] = await Promise.all([
      probeTable(TABLES.registrations, {
        Name: "SETUP TEST — safe to delete",
        WhatsApp: "+2348000000000",
        Program: "Setup probe",
        Location: "Setup probe",
        Status: "Pending",
        "Submitted At": now,
      }),
      probeTable(TABLES.guidance, {
        Name: "SETUP TEST — safe to delete",
        WhatsApp: "+2348000000000",
        "Education Level": "Setup probe",
        "Field of Study": "Setup probe",
        "Computer Literacy": "Setup probe",
        Skills: "Setup probe",
        Interests: "Setup probe",
        Goal: "Setup probe",
        Notes: "Setup probe",
        Status: "Pending",
        "Submitted At": now,
      }),
      probeTable(TABLES.newsletter, {
        Email: "setup-probe@example.com",
        "Subscribed At": now,
      }),
    ]);

    body.probe = {
      passed: !registrations && !guidance && !newsletter,
      registrations: registrations ?? "OK",
      guidance: guidance ?? "OK",
      newsletter: newsletter ?? "OK",
      note: "Each check writes one test row then deletes it. Anything other than 'OK' is the exact reason Airtable rejected the write.",
    };
  }

  res.status(200).json(body);
}
