/**
 * Minimal Airtable REST client.
 *
 * Uses the REST API directly rather than the `airtable` npm package to keep the
 * serverless bundle small and avoid an extra dependency.
 *
 * Required env vars:
 *   AIRTABLE_TOKEN    - personal access token with data.records:write on the base
 *   AIRTABLE_BASE_ID  - e.g. appXXXXXXXXXXXXXX
 *
 * Optional table-name overrides (defaults shown):
 *   AIRTABLE_TABLE_REGISTRATIONS  = "Registrations"
 *   AIRTABLE_TABLE_GUIDANCE       = "Guidance Requests"
 *   AIRTABLE_TABLE_NEWSLETTER     = "Newsletter"
 */

const AIRTABLE_API = "https://api.airtable.com/v0";

export const TABLES = {
  registrations: process.env.AIRTABLE_TABLE_REGISTRATIONS || "Registrations",
  guidance: process.env.AIRTABLE_TABLE_GUIDANCE || "Guidance Requests",
  newsletter: process.env.AIRTABLE_TABLE_NEWSLETTER || "Newsletter",
  payments: process.env.AIRTABLE_TABLE_PAYMENTS || "Payments",
};

export class AirtableNotConfiguredError extends Error {
  constructor() {
    super("Airtable is not configured");
    this.name = "AirtableNotConfiguredError";
  }
}

export function isAirtableConfigured(): boolean {
  return Boolean(process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE_ID);
}

/**
 * Creates a single record. `typecast` lets Airtable coerce strings into
 * single-select / multi-select options so the table schema stays forgiving.
 */
export async function createRecord(
  table: string,
  fields: Record<string, unknown>
): Promise<{ id: string }> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) throw new AirtableNotConfiguredError();

  const response = await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    // Surfaced in Vercel logs only — never returned to the browser.
    throw new Error(
      `Airtable responded ${response.status} for table "${table}": ${detail.slice(0, 500)}`
    );
  }

  const data = (await response.json()) as { records: Array<{ id: string }> };
  return { id: data.records?.[0]?.id ?? "" };
}
