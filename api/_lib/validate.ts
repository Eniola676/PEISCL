/**
 * Small validation helpers. Everything that reaches Airtable goes through here
 * so we never forward raw, unbounded user input into storage.
 */

export const LIMITS = {
  name: 120,
  phone: 25,
  email: 254,
  shortText: 200,
  longText: 2000,
  listItem: 120,
  listLength: 25,
} as const;

/** Trims, collapses whitespace and hard-caps length. Returns "" for non-strings. */
export function cleanString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

/** Cleans an array of strings, dropping empties and capping both item size and count. */
export function cleanStringList(value: unknown, maxItems = LIMITS.listLength): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanString(item, LIMITS.listItem))
    .filter(Boolean)
    .slice(0, maxItems);
}

/**
 * Permissive phone check — Nigerian numbers may arrive as 08097545740 or
 * +2348097545740. We only reject input that clearly isn't a phone number.
 */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Returns an ISO timestamp, preferring a valid client-supplied one. */
export function safeTimestamp(value: unknown): string {
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}
