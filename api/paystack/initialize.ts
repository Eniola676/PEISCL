import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCourseBySlug } from "../../src/data/courses.js";
import { badRequest, guardMethod, readJsonBody, serverError } from "../_lib/http.js";
import { LIMITS, cleanString, isValidEmail } from "../_lib/validate.js";

/**
 * Creates a Paystack transaction and returns the hosted checkout URL.
 *
 * Deliberately inert until BOTH are true:
 *   PAYSTACK_ENABLED=true       (explicit opt-in)
 *   the course has a price > 0  (see COURSE_PRICES_NGN in src/data/courses.ts)
 *
 * This prevents the endpoint from ever charging a placeholder amount.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (guardMethod(req, res, "POST")) return;

  if (process.env.PAYSTACK_ENABLED !== "true") {
    return res
      .status(503)
      .json({ success: false, error: "Online payment isn't enabled yet" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return serverError(res, "Payment is not configured");

  const body = readJsonBody(req);
  const email = cleanString(body.email, LIMITS.email).toLowerCase();
  const courseSlug = cleanString(body.courseSlug, LIMITS.shortText);
  const name = cleanString(body.name, LIMITS.name);

  if (!email || !isValidEmail(email)) return badRequest(res, "A valid email is required");
  if (!courseSlug) return badRequest(res, "Course is required");

  const course = getCourseBySlug(courseSlug);
  if (!course) return badRequest(res, "Unknown course");

  // Price lives with the course data; 0 means "not priced yet".
  if (!course.priceNgn || course.priceNgn <= 0) {
    return res
      .status(503)
      .json({ success: false, error: "This course isn't available for online payment yet" });
  }

  try {
    const origin =
      process.env.PUBLIC_SITE_URL ||
      (req.headers.origin as string) ||
      `https://${req.headers.host}`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        // Paystack expects the smallest currency unit (kobo).
        amount: Math.round(course.priceNgn * 100),
        currency: "NGN",
        callback_url: `${origin}/payment-complete`,
        metadata: {
          courseSlug: course.slug,
          courseTitle: course.title,
          customerName: name,
        },
      }),
    });

    const data = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    };

    if (!response.ok || !data.status || !data.data?.authorization_url) {
      console.error("Paystack initialize failed:", data.message || response.status);
      return serverError(res, "Could not start the payment");
    }

    return res.status(200).json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return serverError(res, "Could not start the payment");
  }
}
