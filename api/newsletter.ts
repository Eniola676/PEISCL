import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRecord, isAirtableConfigured, TABLES } from "./_lib/airtable.js";
import { badRequest, guardMethod, readJsonBody, serverError } from "./_lib/http.js";
import { LIMITS, cleanString, isValidEmail, safeTimestamp } from "./_lib/validate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "POST")) return;

  const body = readJsonBody(req);
  const email = cleanString(body.email, LIMITS.email).toLowerCase();

  if (!email) return badRequest(res, "Email is required");
  if (!isValidEmail(email)) return badRequest(res, "That email looks invalid");

  if (!isAirtableConfigured()) {
    return serverError(res, "Storage is not configured");
  }

  try {
    const record = await createRecord(TABLES.newsletter, {
      Email: email,
      "Subscribed At": safeTimestamp(body.timestamp),
    });

    return res.status(200).json({ success: true, id: record.id });
  } catch (error) {
    console.error("Newsletter signup failed:", error);
    return serverError(res, "Could not save your subscription");
  }
}
