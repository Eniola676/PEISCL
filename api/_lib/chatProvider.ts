/**
 * Chat provider abstraction.
 *
 * Picks whichever provider is configured, so the site can start on Gemini's
 * free tier and move to Claude later by swapping an environment variable —
 * no code change required.
 *
 * Priority: GEMINI_API_KEY, then ANTHROPIC_API_KEY.
 */

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ProviderName = "gemini" | "anthropic" | null;

export function activeProvider(): ProviderName {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

/** Thrown when the provider declined the request on safety grounds. */
export class ContentRefusedError extends Error {
  constructor() {
    super("Content refused");
    this.name = "ContentRefusedError";
  }
}

// -----------------------------------------------------------------------------
// Gemini (Google AI Studio free tier)
// -----------------------------------------------------------------------------

/**
 * Model candidates, tried in order. An explicit GEMINI_MODEL always wins.
 *
 * These are all "lite" models, chosen by measurement rather than by capability
 * on paper: on Google's free tier the full Flash models allow roughly one
 * request before returning 429 RESOURCE_EXHAUSTED, which is useless for a
 * public support widget. Measured over 5 back-to-back requests per model:
 *
 *   gemini-flash-lite-latest   5/5 ok   avg 1.2s   worst 1.9s
 *   gemini-3.5-flash-lite      5/5 ok   avg 1.6s   worst 3.7s
 *   gemini-3.1-flash-lite      5/5 ok   avg 4.4s   worst 7.5s
 *   gemini-3.6-flash           0/5      all 429
 *
 * The alias leads so the site follows Google's current lite model without a
 * deploy; the pinned IDs behind it cover the alias being retired or throttled.
 */
const GEMINI_MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  // Last resort only: capable, but free-tier quota rejects almost every call.
  "gemini-3.6-flash",
].filter((m): m is string => Boolean(m));

const GEMINI_MODEL = GEMINI_MODEL_CANDIDATES[0];
let resolvedGeminiModel: string | null = null;

/** True when the failure looks like "this model doesn't exist", not a real error. */
function isModelUnavailable(status: number, detail: string): boolean {
  if (status === 404) return true;
  return status === 400 && /not found|not supported|unsupported model/i.test(detail);
}

/**
 * True when another model is worth trying: the free tier hands out
 * 429 RESOURCE_EXHAUSTED per model, so a sibling model often answers
 * immediately when this one won't.
 */
function shouldTryNextModel(status: number, detail: string): boolean {
  return status === 429 || status === 503 || isModelUnavailable(status, detail);
}

/** Well under the 30s function limit, leaving room to try another model. */
const GEMINI_TIMEOUT_MS = 12_000;

async function callGemini(
  model: string,
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<Response> {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      headers: {
        "x-goog-api-key": (process.env.GEMINI_API_KEY as string).trim(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        // Gemini uses "model" where the rest of the app uses "assistant".
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          // These models think before answering and thought tokens come out of
          // this budget, so it must stay well clear of the answer length or the
          // reply arrives empty.
          maxOutputTokens: maxTokens,
          temperature: 0.3,
        },
      }),
    }
  );
}

async function callGeminiSafely(
  model: string,
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<Response | Error> {
  try {
    return await callGemini(model, system, messages, maxTokens);
  } catch (error) {
    // A network failure or the abort timeout — treat like an unavailable model
    // so the loop moves on instead of taking the whole assistant down.
    return error instanceof Error ? error : new Error(String(error));
  }
}

async function askGemini(
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<string> {
  // A remembered model is tried first, but the full list stays behind it: the
  // model that worked a minute ago may be out of quota now.
  const candidates = resolvedGeminiModel
    ? [
        resolvedGeminiModel,
        ...GEMINI_MODEL_CANDIDATES.filter((m) => m !== resolvedGeminiModel),
      ]
    : GEMINI_MODEL_CANDIDATES;

  let response: Response | null = null;
  let lastError = "";

  for (const model of candidates) {
    const attempt = await callGeminiSafely(model, system, messages, maxTokens);

    if (attempt instanceof Error) {
      lastError = `Gemini request to "${model}" failed: ${attempt.message}`;
      continue;
    }

    if (attempt.ok) {
      if (resolvedGeminiModel !== model) {
        console.log(`Gemini: using model "${model}"`);
        resolvedGeminiModel = model;
      }
      response = attempt;
      break;
    }

    const detail = await attempt.text();
    lastError = `Gemini responded ${attempt.status} for model "${model}": ${detail.slice(0, 400)}`;

    // Anything else (a bad key, a disabled API) would fail identically on every
    // candidate, so stop rather than burn the whole list.
    if (!shouldTryNextModel(attempt.status, detail)) break;

    // The remembered model just failed; don't keep preferring it.
    if (resolvedGeminiModel === model) resolvedGeminiModel = null;
  }

  if (!response) throw new Error(lastError || "Gemini request failed");

  const data = (await response.json()) as {
    promptFeedback?: { blockReason?: string };
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  if (data.promptFeedback?.blockReason) throw new ContentRefusedError();

  const candidate = data.candidates?.[0];
  if (candidate?.finishReason === "SAFETY") throw new ContentRefusedError();

  const text = (candidate?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .trim();

  return text;
}

// -----------------------------------------------------------------------------
// Anthropic (paid — better answers, no data used for training)
// -----------------------------------------------------------------------------

async function askAnthropic(
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<string> {
  // Imported lazily so the Gemini path doesn't pay to load the SDK.
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: maxTokens,
    output_config: { effort: "low" },
    system: [
      { type: "text", text: system, cache_control: { type: "ephemeral" } },
    ],
    messages,
  });

  if (response.stop_reason === "refusal") throw new ContentRefusedError();

  // Typed structurally rather than via the SDK's namespace types, so this keeps
  // compiling across SDK versions (the class is imported dynamically above).
  const blocks = response.content as Array<{ type: string; text?: string }>;
  return blocks
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();
}

// -----------------------------------------------------------------------------

export async function askAssistant(
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<string> {
  const provider = activeProvider();
  if (provider === "gemini") return askGemini(system, messages, maxTokens);
  if (provider === "anthropic") return askAnthropic(system, messages, maxTokens);
  throw new Error("No chat provider configured");
}

/** Strips anything key-shaped before an error is shown outside the server. */
function redact(text: string): string {
  return text
    .replace(/AIza[A-Za-z0-9_\-]{10,}/g, "[REDACTED_KEY]")
    .replace(/sk-ant-[A-Za-z0-9_\-]{10,}/g, "[REDACTED_KEY]")
    .replace(/pat[A-Za-z0-9]{10,}\.[A-Za-z0-9]{10,}/g, "[REDACTED_KEY]");
}

/**
 * Sends a trivial message to verify the provider actually answers.
 * Returns null on success, or a redacted reason on failure.
 */
export async function probeChat(): Promise<string | null> {
  const provider = activeProvider();
  if (!provider) return "No chat provider configured";

  try {
    const reply = await askAssistant(
      "You are a test harness. Reply with the single word: OK",
      [{ role: "user", content: "Reply with OK" }],
      // Must exceed the thinking budget or the reply comes back empty.
      512
    );
    return reply ? null : "Provider returned an empty response";
  } catch (error) {
    if (error instanceof ContentRefusedError) {
      return "Provider refused the test message (unexpected, but the API is reachable)";
    }
    return redact(error instanceof Error ? error.message : String(error));
  }
}

/** The model name currently in use — handy when debugging a rename. */
export function activeModel(): string | null {
  const provider = activeProvider();
  if (provider === "gemini") return resolvedGeminiModel || GEMINI_MODEL;
  if (provider === "anthropic") return "claude-opus-5";
  return null;
}
