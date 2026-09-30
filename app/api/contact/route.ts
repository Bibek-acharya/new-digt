import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schema";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request body is too large." }, { status: 400 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Content-Type must be application/json." }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request body is too large." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }

  // Honeypot: silent 200 for bots
  if (typeof body === "object" && body !== null && "website" in body && typeof body.website === "string" && body.website.length > 0) {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "form"),
      message: issue.message,
    }));
    return json({ ok: false, error: "Please correct the highlighted fields.", issues }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.sent) {
    console.error("[/api/contact] Email not sent:", result.reason, result.error);
  }

  return json({ ok: true });
}
