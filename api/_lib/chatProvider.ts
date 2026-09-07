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
 * Model candidates, tried in order. An explicit GEMINI_MODEL always wins;
 * the rest are fallbacks so a model rename on Google's side doesn't take the
 * assistant down. The first one that answers is remembered for the life of
 * the warm instance.
 */
const GEMINI_MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
].filter((m): m is string => Boolean(m));

const GEMINI_MODEL = GEMINI_MODEL_CANDIDATES[0];
let resolvedGeminiModel: string | null = null;

/** True when the failure looks like "this model doesn't exist", not a real error. */
function isModelUnavailable(status: number, detail: string): boolean {
  if (status === 404) return true;
  return status === 400 && /not found|not supported|unsupported model/i.test(detail);
}

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
          maxOutputTokens: maxTokens,
          temperature: 0.3,
        },
      }),
    }
  );
}

async function askGemini(
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<string> {
  const candidates = resolvedGeminiModel
    ? [resolvedGeminiModel]
    : GEMINI_MODEL_CANDIDATES;

  let response: Response | null = null;
  let lastError = "";

  for (const model of candidates) {
    const attempt = await callGemini(model, system, messages, maxTokens);

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

    // Only keep trying if the model itself is the problem. A bad key or a
    // disabled API would fail identically on every candidate.
    if (!isModelUnavailable(attempt.status, detail)) break;
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
      32
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
