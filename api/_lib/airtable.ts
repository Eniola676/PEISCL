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

/**
 * Normalises whatever was pasted into AIRTABLE_BASE_ID.
 *
 * People commonly paste the whole Airtable URL or the full
 * `appXXX/tblYYY/viwZZZ` path instead of just the base ID, which produces a
 * confusing 404 at write time. Extract the `app...` segment and ignore the rest.
 */
export function getBaseId(): string {
  const raw = (process.env.AIRTABLE_BASE_ID || "").trim();
  const match = raw.match(/app[A-Za-z0-9]+/);
  return match ? match[0] : raw;
}

export function getToken(): string {
  return (process.env.AIRTABLE_TOKEN || "").trim();
}

export function isAirtableConfigured(): boolean {
  return Boolean(getToken() && getBaseId());
}

/** True when the configured base ID looks like a real Airtable base ID. */
export function isBaseIdWellFormed(): boolean {
  return /^app[A-Za-z0-9]+$/.test(getBaseId());
}

/**
 * Creates a single record. `typecast` lets Airtable coerce strings into
 * single-select / multi-select options so the table schema stays forgiving.
 */
export async function createRecord(
  table: string,
  fields: Record<string, unknown>
): Promise<{ id: string }> {
  const token = getToken();
  const baseId = getBaseId();

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

/** Deletes a record. Used by the setup probe to clean up its own test rows. */
export async function deleteRecord(table: string, id: string): Promise<void> {
  const token = getToken();
  const baseId = getBaseId();
  if (!token || !baseId) throw new AirtableNotConfiguredError();

  await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}/${id}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
  );
}

/**
 * Attempts a write against a table and reports what Airtable said.
 * Returns null on success, or a human-readable reason on failure.
 */
export async function probeTable(
  table: string,
  fields: Record<string, unknown>
): Promise<string | null> {
  const token = getToken();
  const baseId = getBaseId();
  if (!token || !baseId) return "Airtable credentials are not set";

  let response: Response;
  try {
    response = await fetch(`${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
  } catch (error) {
    return `Network error reaching Airtable: ${String(error)}`;
  }

  if (response.ok) {
    // Clean up the test row so the table isn't polluted.
    try {
      const data = (await response.json()) as { records: Array<{ id: string }> };
      const id = data.records?.[0]?.id;
      if (id) await deleteRecord(table, id);
    } catch {
      return "Wrote a test row but could not delete it — remove it manually";
    }
    return null;
  }

  const detail = await response.text();
  let parsed: { error?: { type?: string; message?: string } } = {};
  try {
    parsed = JSON.parse(detail);
  } catch {
    /* fall through to raw text */
  }

  const type = parsed.error?.type || `HTTP ${response.status}`;
  const message = parsed.error?.message || detail.slice(0, 300);

  if (response.status === 404) {
    return `${type}: table "${table}" not found (check the table name and the base ID) — ${message}`;
  }
  if (response.status === 403) {
    return `${type}: token lacks access to this base or table — ${message}`;
  }
  return `${type}: ${message}`;
}
