import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { coursesData } from "../src/data/courses.js";
import { locations, allLocationIds } from "../src/data/locations.js";
import { badRequest, guardMethod, readJsonBody, serverError } from "./_lib/http.js";
import { getClientKey, isRateLimited } from "./_lib/rateLimit.js";

/**
 * Vercel's default function timeout is 10s, which a model call can occasionally
 * exceed. Hobby plans allow up to 60s; 30 gives comfortable headroom.
 */
export const config = { maxDuration: 30 };

/** Cost guards for a public, unauthenticated endpoint. */
const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY = 16;
const MAX_TOKENS = 1024;
const RATE_LIMIT = 20; // messages
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

/**
 * The catalogue is small enough to inline, so the assistant answers from real
 * data instead of guessing. Built once per cold start and cached by Anthropic
 * via cache_control, so repeat turns don't pay full price for it.
 */
function buildSystemPrompt(): string {
  const courseLines = coursesData
    .map((course) => {
      const where = course.locations.map((id) => locations[id].name).join(", ");
      return `- ${course.title} | Track: ${course.track} | Level: ${course.level} | Duration: ${course.duration} | Available at: ${where}`;
    })
    .join("\n");

  const locationLines = allLocationIds
    .map((id) => `- ${locations[id].name}: ${locations[id].address}`)
    .join("\n");

  return `You are the support assistant for PEISCL, a tech skills training institute in Abuja, Nigeria.

Your job is to help visitors understand the courses and work out which one suits them, then point them to registration.

## Courses (${coursesData.length} total)
${courseLines}

## Locations
${locationLines}

## Contact
- WhatsApp / phone: 08097545740
- Email: ictpanorama5@gmail.com
- Register on the site, or use the "Find My Course" questionnaire if unsure.

## Rules
- Only answer questions about PEISCL, its courses, and getting started. If asked about anything unrelated, say that's outside what you can help with and offer to answer a course question instead.
- NEVER state or estimate a price, fee, or discount. Pricing is not published. If asked about cost, say pricing isn't listed publicly and point them to WhatsApp on 08097545740 or the registration form so the team can share current fees.
- Never invent courses, dates, cohort start times, durations, or locations. If it isn't in the data above, say you don't have that detail and refer them to the team.
- Be concise — usually 2-4 sentences. Use plain language; many visitors are new to tech.
- When someone seems ready to enrol, point them to the Register button or the "Find My Course" page.`;
}

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function parseMessages(value: unknown): IncomingMessage[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const trimmed = value.slice(-MAX_HISTORY);
  const parsed: IncomingMessage[] = [];

  for (const entry of trimmed) {
    if (!entry || typeof entry !== "object") return null;
    const { role, content } = entry as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;

    const text = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!text) return null;

    parsed.push({ role, content: text });
  }

  // The Messages API requires the conversation to begin with a user turn.
  while (parsed.length && parsed[0].role !== "user") parsed.shift();
  return parsed.length ? parsed : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "POST")) return;

  if (!process.env.ANTHROPIC_API_KEY) {
    return serverError(res, "Chat is not configured");
  }

  if (isRateLimited(getClientKey(req), RATE_LIMIT, RATE_WINDOW_MS)) {
    return res
      .status(429)
      .json({ success: false, error: "You've sent a lot of messages — please wait a few minutes." });
  }

  const messages = parseMessages(readJsonBody(req).messages);
  if (!messages) return badRequest(res, "A valid message is required");

  try {
    const client = new Anthropic();

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: buildSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") {
      return res.status(200).json({
        success: true,
        reply:
          "I can't help with that one. Ask me anything about PEISCL's courses and I'll do my best.",
      });
    }

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!reply) return serverError(res, "Empty response from assistant");

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      console.error("Anthropic rate limit hit:", error.message);
      return res
        .status(429)
        .json({ success: false, error: "We're a bit busy — please try again shortly." });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic auth failed — check ANTHROPIC_API_KEY");
      return serverError(res, "Chat is not configured");
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${error.status}:`, error.message);
      return serverError(res, "The assistant is unavailable right now");
    }

    console.error("Chat handler failed:", error);
    return serverError(res, "The assistant is unavailable right now");
  }
}
