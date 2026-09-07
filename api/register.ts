import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRecord, isAirtableConfigured, TABLES } from "./_lib/airtable.js";
import { badRequest, guardMethod, readJsonBody, serverError } from "./_lib/http.js";
import { LIMITS, cleanString, isValidPhone, safeTimestamp } from "./_lib/validate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "POST")) return;

  const body = readJsonBody(req);

  const name = cleanString(body.name, LIMITS.name);
  const whatsapp = cleanString(body.whatsapp, LIMITS.phone);
  const program = cleanString(body.program, LIMITS.shortText);
  const location = cleanString(body.location, 40);
  const locationName = cleanString(body.locationName, LIMITS.shortText);

  if (!name) return badRequest(res, "Name is required");
  if (!whatsapp) return badRequest(res, "WhatsApp number is required");
  if (!isValidPhone(whatsapp)) return badRequest(res, "WhatsApp number looks invalid");
  if (!program) return badRequest(res, "Program is required");

  if (!isAirtableConfigured()) {
    // Fail loudly rather than pretending the submission was saved.
    return serverError(res, "Storage is not configured");
  }

  try {
    const record = await createRecord(TABLES.registrations, {
      Name: name,
      WhatsApp: whatsapp,
      Program: program,
      Location: locationName || location,
      Status: "Pending",
      "Submitted At": safeTimestamp(body.timestamp),
    });

    return res.status(200).json({ success: true, id: record.id });
  } catch (error) {
    console.error("Registration save failed:", error);
    return serverError(res, "Could not save registration");
  }
}
