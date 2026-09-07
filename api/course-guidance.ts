import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRecord, isAirtableConfigured, TABLES } from "./_lib/airtable.js";
import { badRequest, guardMethod, readJsonBody, serverError } from "./_lib/http.js";
import {
  LIMITS,
  cleanString,
  cleanStringList,
  isValidPhone,
  safeTimestamp,
} from "./_lib/validate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "POST")) return;

  const body = readJsonBody(req);

  const name = cleanString(body.name, LIMITS.name);
  const whatsapp = cleanString(body.whatsapp, LIMITS.phone);
  const educationLevel = cleanString(body.educationLevel, LIMITS.shortText);
  const fieldOfStudy = cleanString(body.fieldOfStudy, LIMITS.shortText);
  const computerLiteracy = cleanString(body.computerLiteracy, LIMITS.shortText);
  const goal = cleanString(body.goal, LIMITS.shortText);
  const notes = cleanString(body.notes, LIMITS.longText);
  const skills = cleanStringList(body.skills);
  const interests = cleanStringList(body.interests);

  if (!name) return badRequest(res, "Name is required");
  if (!whatsapp) return badRequest(res, "WhatsApp number is required");
  if (!isValidPhone(whatsapp)) return badRequest(res, "WhatsApp number looks invalid");
  if (!educationLevel) return badRequest(res, "Education level is required");
  if (!computerLiteracy) return badRequest(res, "Computer literacy is required");
  if (interests.length === 0) return badRequest(res, "At least one interest is required");

  if (!isAirtableConfigured()) {
    return serverError(res, "Storage is not configured");
  }

  try {
    const record = await createRecord(TABLES.guidance, {
      Name: name,
      WhatsApp: whatsapp,
      "Education Level": educationLevel,
      "Field of Study": fieldOfStudy,
      "Computer Literacy": computerLiteracy,
      Skills: skills.join(", "),
      Interests: interests.join(", "),
      Goal: goal,
      Notes: notes,
      Status: "Pending",
      "Submitted At": safeTimestamp(body.timestamp),
    });

    return res.status(200).json({ success: true, id: record.id });
  } catch (error) {
    console.error("Guidance request save failed:", error);
    return serverError(res, "Could not save your request");
  }
}
