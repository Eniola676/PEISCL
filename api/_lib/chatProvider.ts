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

// Overridable so a model rename doesn't require a code change.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function askGemini(
  system: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY as string,
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

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Gemini responded ${response.status}: ${detail.slice(0, 400)}`
    );
  }

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
