# PEISCL Backend Setup

The site runs on Vercel. Form submissions are handled by **Vercel serverless
functions** in `/api` and stored in **Airtable**. There is no long-running
server to deploy.

> **Why this changed:** the old `server.cjs` (Express + local JSON files) never
> ran on Vercel — `/api/*` returned 404 in production and every submission fell
> back to the visitor's own browser storage, so nothing reached PEISCL. That is
> what this setup fixes.

---

## 1. Airtable

### Create the base

1. Go to <https://airtable.com> and create a base (e.g. **PEISCL**).
2. Create the four tables below. **Field names must match exactly** — the API
   writes to these names.

Airtable always creates a default `Name` field in a new table; rename or reuse it
as shown. All fields can be **Single line text** unless noted.

#### Table: `Registrations`

| Field          | Type              |
| -------------- | ----------------- |
| `Name`         | Single line text  |
| `WhatsApp`     | Phone / text      |
| `Program`      | Single line text  |
| `Location`     | Single line text  |
| `Status`       | Single select — options: `Pending`, `Contacted`, `Enrolled` |
| `Submitted At` | Date (include time) |

#### Table: `Guidance Requests`

| Field               | Type              |
| ------------------- | ----------------- |
| `Name`              | Single line text  |
| `WhatsApp`          | Phone / text      |
| `Education Level`   | Single line text  |
| `Field of Study`    | Single line text  |
| `Computer Literacy` | Single line text  |
| `Skills`            | Long text         |
| `Interests`         | Long text         |
| `Goal`              | Single line text  |
| `Notes`             | Long text         |
| `Status`            | Single select — `Pending`, `Contacted` |
| `Submitted At`      | Date (include time) |

#### Table: `Newsletter`

| Field           | Type                |
| --------------- | ------------------- |
| `Email`         | Email               |
| `Subscribed At` | Date (include time) |

#### Table: `Payments` (only needed if you turn Paystack on)

| Field          | Type                |
| -------------- | ------------------- |
| `Reference`    | Single line text    |
| `Email`        | Email               |
| `Amount (NGN)` | Number              |
| `Course`       | Single line text    |
| `Name`         | Single line text    |
| `Status`       | Single line text    |
| `Paid At`      | Date (include time) |

### Get credentials

1. Create a token at <https://airtable.com/create/tokens>.
2. Scope: **`data.records:write`**. Grant access to the PEISCL base only.
3. Copy the token (`pat...`) — it is shown once.
4. Your base ID is in the base URL: `https://airtable.com/`**`appXXXXXXXX`**`/...`

**Airtable is now your admin dashboard.** The old `/api/registrations` and
`/api/course-guidance` read endpoints were deliberately not rebuilt — they
returned every customer's name and phone number with no authentication, which
is fine on localhost but a data leak on a public URL.

---

## 2. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (and to a
local `.env` for development). See `.env.example` for the full annotated list.

| Variable           | Required | Purpose                          |
| ------------------ | -------- | -------------------------------- |
| `AIRTABLE_TOKEN`   | Yes      | Airtable personal access token   |
| `AIRTABLE_BASE_ID` | Yes      | Airtable base ID (`app...`)      |
| `ANTHROPIC_API_KEY`| No       | Enables the AI chat widget       |
| `PAYSTACK_ENABLED` | No       | `true` turns on checkout         |
| `PAYSTACK_SECRET_KEY` | No    | Paystack secret key              |
| `PUBLIC_SITE_URL`  | No       | Post-payment callback base URL   |

**Redeploy after adding variables** — Vercel only injects them at build/run time.

---

## 3. Local development

The Vite dev server alone does **not** run the `/api` functions. Use the Vercel
CLI so both the site and the functions run together:

```bash
npm i -g vercel
vercel dev          # serves site + /api on http://localhost:3000
```

`npm run dev` still works for pure UI work; form submissions will fail against
it because `/api` isn't running.

---

## 4. WhatsApp delivery

There is no WhatsApp API integration and no credentials to manage. After a
successful submission the visitor is shown a **"Send on WhatsApp"** button that
opens WhatsApp with the details pre-filled, addressed to the support number in
`src/lib/whatsapp.ts` (`SUPPORT_WHATSAPP`).

Change the support number there if it moves.

**Trade-off to be aware of:** delivery depends on the visitor tapping send. The
record is already safely in Airtable either way, so nothing is lost if they
don't — but Airtable is the source of truth for follow-up, not WhatsApp.

---

## 5. AI chat assistant

Set `ANTHROPIC_API_KEY` to switch it on; without it the widget returns a polite
"unavailable" message.

The assistant is grounded in the real course catalogue (generated at runtime
from `src/data/courses.ts`) and is instructed never to quote prices or invent
courses, dates, or locations.

**This costs you money per message** — it's free for visitors, not for PEISCL.
Cost controls already in place (`api/chat.ts`):

- `claude-opus-5` at `effort: "low"` — cheapest setting on the default model.
- `max_tokens: 1024` — answers are short by design.
- Prompt caching on the catalogue system prompt, so repeat turns are ~90%
  cheaper on that portion.
- Message capped at 1,500 characters; history capped at 16 turns.
- Rate limit: 20 messages per IP per 10 minutes.

The rate limit is **best-effort** — it lives in memory, and serverless instances
are recycled, so it slows casual abuse but won't stop a determined attacker. If
you ever see unexpected spend, move it to Vercel KV / Upstash Redis (see the
note in `api/_lib/rateLimit.ts`), or set a spend cap in the Anthropic console.

To use a cheaper model, change `model` in `api/chat.ts` to `claude-sonnet-5` or
`claude-haiku-4-5`.

---

## 6. Paystack (currently OFF)

The plumbing is built but deliberately inert, because **no course has a price
yet**. Checkout only activates when both are true:

1. `PAYSTACK_ENABLED=true`
2. The course has a non-zero price in `COURSE_PRICES_NGN` in
   `src/data/courses.ts` (keyed by course slug, in Naira)

Until then `/api/paystack/initialize` returns `503` and no payment UI is shown.
This is intentional — it makes it impossible to charge a placeholder amount.

### To go live

1. Fill in `COURSE_PRICES_NGN`, e.g.:
   ```ts
   const COURSE_PRICES_NGN: Record<string, number> = {
     "python-programming": 75000,
     "excel-fundamentals-data-analysis": 50000,
   };
   ```
2. Set `PAYSTACK_ENABLED=true` and `PAYSTACK_SECRET_KEY` in Vercel.
3. In the Paystack dashboard, set the webhook URL to
   `https://<your-domain>/api/paystack/webhook`.
4. **Test the webhook with Paystack's dashboard tester before taking real
   payments.** Signature verification uses the raw request body; this has been
   written carefully but has not been verified against live Paystack traffic.
5. Build the checkout button in the UI (not yet added — nothing calls
   `/api/paystack/initialize` today).

---

## Legacy files

`server.cjs` and `admin.html` are superseded by this setup and no longer match
the live API (`admin.html` reads endpoints that no longer exist). They're left
in place rather than deleted so you can decide — safe to remove once Airtable is
running.
