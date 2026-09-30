import { Resend } from "resend";
import type { ContactInput } from "./schema";

type SendResult = {
  sent: boolean;
  reason?: "no-config" | "provider-error";
  error?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let resend: Resend | undefined;

function getResend(): Resend | undefined {
  const key = process.env.RESEND_API_KEY;
  if (!key) return undefined;
  resend ??= new Resend(key);
  return resend;
}

export async function sendContactEmail(input: ContactInput): Promise<SendResult> {
  const to = process.env.CONTACT_TO_EMAIL;
  const client = getResend();
  if (!client || !to) return { sent: false, reason: "no-config" };

  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const subject = escapeHtml(input.subject);
  const projectType = escapeHtml(input.projectType);
  const message = escapeHtml(input.message).replaceAll("\n", "<br />");

  try {
    const result = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to,
      replyTo: input.email,
      subject: `[Digital Chautari] ${input.subject} \u2014 ${input.name}`,
      html: `<h1>New Digital Chautari contact</h1><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Project type:</strong> ${projectType}</p><p><strong>Message:</strong><br />${message}</p>`,
    });
    if (result.error) return { sent: false, reason: "provider-error", error: String(result.error) };
    return { sent: true };
  } catch (error) {
    return { sent: false, reason: "provider-error", error: error instanceof Error ? error.message : "Unknown provider error" };
  }
}
