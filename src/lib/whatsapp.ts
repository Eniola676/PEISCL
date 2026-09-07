/** Customer support WhatsApp number in international format (no +, no spaces). */
export const SUPPORT_WHATSAPP = "2348097545740";

/** Builds a wa.me link that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

interface RegistrationSummary {
  name: string;
  whatsapp: string;
  program: string;
  locationName: string;
}

export function registrationMessage({
  name,
  whatsapp,
  program,
  locationName,
}: RegistrationSummary): string {
  return [
    "*New course registration*",
    "",
    `Name: ${name}`,
    `WhatsApp: ${whatsapp}`,
    `Course: ${program}`,
    `Location: ${locationName}`,
  ].join("\n");
}

interface GuidanceSummary {
  name: string;
  whatsapp: string;
  educationLevel: string;
  fieldOfStudy: string;
  computerLiteracy: string;
  skills: string[];
  interests: string[];
  goal: string;
  notes: string;
}

export function guidanceMessage({
  name,
  whatsapp,
  educationLevel,
  fieldOfStudy,
  computerLiteracy,
  skills,
  interests,
  goal,
  notes,
}: GuidanceSummary): string {
  const lines = [
    "*New course guidance request*",
    "",
    `Name: ${name}`,
    `WhatsApp: ${whatsapp}`,
    `Education: ${educationLevel}`,
  ];

  if (fieldOfStudy) lines.push(`Field of study: ${fieldOfStudy}`);
  lines.push(`Computer literacy: ${computerLiteracy}`);
  if (skills.length) lines.push(`Skills: ${skills.join(", ")}`);
  lines.push(`Interests: ${interests.join(", ")}`);
  if (goal) lines.push(`Goal: ${goal}`);
  if (notes) lines.push(`Notes: ${notes}`);

  return lines.join("\n");
}
