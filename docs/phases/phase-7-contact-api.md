# Phase 7 — Contact Page, API Route, and FAQ

**Goal:** Ship the complete contact journey: a validated, rate-limited, XSS-safe contact API, an accessible form, the contact page, and the required FAQ.
**Depends on:** Phase 6
**Estimate:** 6–8h
**Ships:**
- A visitor can submit the contact form and receive a success state; a configured production deployment sends the message through Resend.
- Invalid, oversized, automated, and rate-limited requests have observable, safe responses.
- `/contact`, `/faq`, `/api/contact`, and `/api/health` are working and keyboard accessible.

---

## Scope

**In scope**
- The shared Zod schema, instance-local fixed-window rate limiter, Resend wrapper, contact route, health route, and optional blog route.
- Typed contact data, the radio-style project-type pills, the full form, toast, contact page, FAQ data, and FAQ page.
- Page metadata and curl/manual verification for every API outcome.

**Out of scope (later phases)**
- Site-wide motion, responsive, SEO, accessibility, and performance audit — Phase 8.
- Vercel deployment and production release QA — Phase 9.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `lib/schema.ts` | One validation contract shared by client and server. | `projectTypes`, `contactSchema`, `ContactInput` |
| `lib/rateLimit.ts` | Five requests per ten minutes per IP. | `checkRateLimit` |
| `lib/email.ts` | Lazy Resend integration and escaped HTML email. | `sendContactEmail` |
| `app/api/contact/route.ts` | JSON POST handler. | `runtime`, `dynamic`, `POST` |
| `app/api/health/route.ts` | Deployment health check. | `GET` |
| `app/api/blog/route.ts` | **Optional and strippable** typed blog response. | `GET` |
| `data/contact.ts` | Contact cards, departments, response times, and shared project options. | `infoCards`, `departments`, `responseTimes`, `projectTypes` |
| `data/faq.ts` | Eight Kathmandu-specific FAQ pairs. | `faq` |
| `components/forms/ProjectTypePills.tsx` | Single-select keyboard-navigable project type control. | `ProjectTypePills` |
| `components/forms/ContactForm.tsx` | Client form and all submission states. | `ContactForm` |
| `components/ui/Toast.tsx` | Accessible success/error notification. | `Toast` |
| `app/contact/page.tsx` | Four-section contact page. | `metadata`, default page |
| `app/faq/page.tsx` | FAQ page with accordion and CTA. | `metadata`, default page |

## Files to modify

| Path | Change |
|---|---|
| `package.json` | Confirm `zod`, `react-hook-form`, `@hookform/resolvers`, and `resend` are installed; do not add another runtime dependency. |
| `data/contact.ts` | If the file was scaffolded earlier, replace placeholders with the exact contract below. |
| `app/globals.css` | Ensure the existing token and focus/error classes support the states below; do not introduce new token values. |

## Step-by-step

1. Create `lib/schema.ts` with the exact schema in Backend Contract §6.1; check the installed Zod major version before choosing its enum error-map syntax.
2. Create `lib/rateLimit.ts` with a prune-on-write fixed-window limiter and document its Vercel instance-local limitation.
3. Create `lib/email.ts`; instantiate Resend only inside a function and escape every user value used in the HTML body.
4. Create the route handler. Apply the body-size/content-type guards, parsing, validation, honeypot, rate limit, send, and safe response flow in that order.
5. Create the health route. Add the blog route only if it is useful; it is optional and must not block sign-off.
6. Add `data/contact.ts` and `data/faq.ts`; import these values rather than hardcoding page copy in JSX.
7. Build `ProjectTypePills` as `role="radiogroup"` containing `role="radio"` buttons. Use teal background and white text for the selected 20px-radius pill.
8. Build `ContactForm` with `react-hook-form`, `zodResolver(contactSchema)`, visible labels, live counter, off-screen honeypot, and all four UI states.
9. Build `Toast`, then compose the four sections of `/contact`: PageHero, four info cards, four direct-line cards, and the two-column form/map block.
10. Build `/faq` from `data/faq.ts`, add metadata to both pages, and verify every curl command below against a local server.

## Implementation detail

### `lib/schema.ts`

This is the exact SPEC §6.1 schema and must not be simplified:

```ts
import { z } from "zod";

export const projectTypes = [
  "Digital Marketing",
  "Content Creation",
  "Software Development",
  "Branding & Design",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  subject: z.string().trim().min(3, "Please add a short subject.").max(120, "Subject must be 120 characters or fewer."),
  projectType: z.enum(projectTypes, { errorMap: () => ({ message: "Choose a project type." }) }),
  message: z.string().trim().min(10, "Tell us a little more — at least 10 characters.").max(2000, "Message must be 2000 characters or fewer."),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

The spec fixes Zod v3. If `package.json` contains Zod v3, use the `invalid_type_error`/`required_error` options where needed and the `errorMap` shown above. If the installed version is Zod v4, check its installed typings and use the v4 `errorMap`/`error` key instead; do not mix v3 and v4 option names. Keep `projectTypes` as the exported `as const` tuple and import it from both `data/contact.ts` and the form. The spec's `website: z.string().max(0)` means a non-empty honeypot fails validation while §6.3 requires a silent 200; the route implementation below explicitly handles that contradiction after `safeParse` and before returning validation issues.

### `lib/rateLimit.ts`

Use prune-on-write rather than a process timer: it has no interval lifecycle to leak across hot reloads/serverless invocations, and removes expired entries whenever traffic arrives. It cannot promise a completely empty map during a period with no writes, but every write bounds stale state encountered by that request.

```ts
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();

  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(key);
  }

  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  if (current.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
```

```ts
// This limiter is instance-local on Vercel/serverless and is not a distributed quota.
// Upgrade to Upstash Redis for a shared production rate limit when traffic requires it.
```

### `lib/email.ts`

```ts
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
      subject: `[Digital Chautari] ${input.subject} — ${input.name}`,
      html: `<h1>New Digital Chautari contact</h1><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Project type:</strong> ${projectType}</p><p><strong>Message:</strong><br />${message}</p>`,
    });
    if (result.error) return { sent: false, reason: "provider-error", error: String(result.error) };
    return { sent: true };
  } catch (error) {
    return { sent: false, reason: "provider-error", error: error instanceof Error ? error.message : "Unknown provider error" };
  }
}
```

The lazy initializer means importing this module never throws when `RESEND_API_KEY` is absent. `error` is for server logs only; never send it to a browser.

### `app/api/contact/route.ts`

```ts
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

  const parsed = contactSchema.safeParse(body);

  // SPEC §6.3 requires the honeypot to be a silent 200, while the exact §6.1
  // max(0) schema rejects it. Treat an otherwise bot-like body silently here.
  if (typeof body === "object" && body !== null && "website" in body && typeof body.website === "string" && body.website.length > 0) {
    return json({ ok: true });
  }

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
    return json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const result = await sendContactEmail(parsed.data);
  if (result.reason === "no-config") {
    console.error("Contact submission received but email is not configured.", {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
    });
    return json({ ok: true });
  }
  if (!result.sent) {
    console.error("Contact email provider error.", result.error);
    return json({ ok: false, error: "We could not send your message. Please try again." }, { status: 500 });
  }
  return json({ ok: true });
}
```

The only server-side error output is `console.error`. Never return `RESEND_API_KEY`, provider error text, or a stack trace. The explicit 32 KiB guard is before JSON parsing; the schema's field caps remain the authoritative per-field server-side caps.

### Health and optional blog routes

`app/api/health/route.ts`:

```ts
import { NextResponse } from "next/server";

const startedAt = Date.now();

export function GET() {
  return NextResponse.json({ ok: true, uptime: Math.floor((Date.now() - startedAt) / 1000) });
}
```

`app/api/blog/route.ts` is **optional and strippable**. If implemented, it is only:

```ts
import { NextResponse } from "next/server";
import { blogPosts } from "@/data/blog";

export function GET() {
  return NextResponse.json({ blogPosts });
}
```

Removing this optional route must not affect Phase 7 sign-off.

### `data/contact.ts`

```ts
import { projectTypes } from "@/lib/schema";
import { site } from "@/data/site";

export const infoCards = [
  { label: "Address", value: "Kathmandu, Nepal", detail: "3rd Floor, Sundhara", icon: "MapPin", href: undefined },
  { label: "Email", value: "hello@digitalchautari.com", detail: "", icon: "Mail", href: "mailto:hello@digitalchautari.com" },
  { label: "Phone", value: "+977 98XXXXXXXX", detail: "", icon: "Phone", href: "tel:+97798XXXXXXXX" },
  { label: "Business Hours", value: site.hours, detail: "", icon: "Clock", href: undefined },
] as const;

export const departments = [
  { name: "Marketing", email: "marketing@digitalchautari.com", note: "Campaigns, SEO, paid media", href: "mailto:marketing@digitalchautari.com" },
  { name: "Content Studio", email: "content@digitalchautari.com", note: "Video, photography, copy", href: "mailto:content@digitalchautari.com" },
  { name: "Software Development", email: "dev@digitalchautari.com", note: "Web, mobile, health-tech", href: "mailto:dev@digitalchautari.com" },
  { name: "Business Development", email: "business@digitalchautari.com", note: "Partnerships, proposals", href: "mailto:business@digitalchautari.com" },
] as const;

export const responseTimes = [
  { label: "Email", value: "Within 24 hours" },
  { label: "Proposals", value: "2–3 business days" },
  { label: "Urgent", value: "Same business day" },
] as const;

export { projectTypes };
```

### `components/forms/ProjectTypePills.tsx`

Use the radio pattern because exactly one project type is selected and native radio semantics make the choice clear to assistive technology. The selected pill is `bg-teal text-white`, with a `20px` radius; unselected pills use the light surface and teal-dark border.

```tsx
"use client";

import { useRef } from "react";
import type { ContactInput } from "@/lib/schema";
import { projectTypes } from "@/lib/schema";

type Props = {
  value: ContactInput["projectType"] | undefined;
  onChange: (value: ContactInput["projectType"]) => void;
  errorId?: string;
  invalid?: boolean;
};

export function ProjectTypePills({ value, onChange, errorId, invalid }: Props) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const move = (index: number, direction: 1 | -1) => {
    const next = (index + direction + projectTypes.length) % projectTypes.length;
    refs.current[next]?.focus();
    onChange(projectTypes[next]);
  };

  return (
    <div role="radiogroup" aria-label="Project type" aria-describedby={errorId} aria-invalid={invalid || undefined} className="flex flex-wrap gap-2">
      {projectTypes.map((type, index) => (
        <button
          key={type}
          ref={(element) => { refs.current[index] = element; }}
          type="button"
          role="radio"
          aria-checked={value === type}
          tabIndex={value === type || (!value && index === 0) ? 0 : -1}
          className={value === type ? "rounded-[20px] bg-teal px-4 py-2 text-white" : "rounded-[20px] border border-teal-dark px-4 py-2 text-teal-dark"}
          onClick={() => onChange(type)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); move(index, 1); }
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); move(index, -1); }
            if (event.key === "Home") { event.preventDefault(); refs.current[0]?.focus(); onChange(projectTypes[0]); }
            if (event.key === "End") { event.preventDefault(); refs.current[projectTypes.length - 1]?.focus(); onChange(projectTypes[projectTypes.length - 1]); }
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
```

### `components/forms/ContactForm.tsx`

```tsx
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schema";
import { ProjectTypePills } from "@/components/forms/ProjectTypePills";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

const errorClass = "text-[#B42318]";

export function ContactForm() {
  const [state, setState] = useState<"pristine" | "submitting" | "success" | "error">("pristine");
  const [serverMessage, setServerMessage] = useState("");
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });
  const messageLength = watch("message", "").length;

  const submit = async (input: ContactInput) => {
    if (input.website) {
      setState("success");
      return;
    }
    setState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your message. Please try again.");
      setState("success");
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : "We could not send your message. Please try again.");
      setState("error");
    }
  };

  if (state === "success") {
    return <div role="status" className="rounded-[12px] border border-line bg-white p-6"><h2>Thanks — we'll reply within 24 hours.</h2><button type="button" className="mt-4 rounded-[8px] bg-teal px-4 py-3 text-white" onClick={() => { reset(); setState("pristine"); }}>Send another message</button></div>;
  }

  return (
    <form noValidate aria-busy={state === "submitting"} onSubmit={handleSubmit(submit)} className="space-y-5">
      {Object.keys(errors).length > 0 && <div role="alert" className={errorClass}>Please correct the highlighted fields.</div>}
      <div><label htmlFor="name">Name</label><input id="name" {...register("name")} aria-invalid={!!errors.name} aria-describedby="name-error" className="block w-full rounded-[12px] border border-line p-3" />{errors.name && <p id="name-error" className={errorClass}>{errors.name.message}</p>}</div>
      <div><label htmlFor="email">Email</label><input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} aria-describedby="email-error" className="block w-full rounded-[12px] border border-line p-3" />{errors.email && <p id="email-error" className={errorClass}>{errors.email.message}</p>}</div>
      <div><label htmlFor="subject">Subject</label><input id="subject" {...register("subject")} aria-invalid={!!errors.subject} aria-describedby="subject-error" className="block w-full rounded-[12px] border border-line p-3" />{errors.subject && <p id="subject-error" className={errorClass}>{errors.subject.message}</p>}</div>
      <div><span className="block">Project Type</span><Controller name="projectType" control={control} render={({ field }) => <ProjectTypePills value={field.value} onChange={field.onChange} errorId="project-type-error" invalid={!!errors.projectType} />} />{errors.projectType && <p id="project-type-error" className={errorClass}>{errors.projectType.message}</p>}</div>
      <div><label htmlFor="message">Message</label><textarea id="message" rows={6} {...register("message")} aria-invalid={!!errors.message} aria-describedby="message-hint message-error" className="block w-full rounded-[12px] border border-line p-3" /><p id="message-hint" className={messageLength >= 1800 ? (messageLength >= 2000 ? errorClass : "text-gold") : "text-muted"}>{messageLength}/2000</p>{errors.message && <p id="message-error" className={errorClass}>{errors.message.message}</p>}</div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" {...register("website")} /></div>
      <Button type="submit" isLoading={state === "submitting"}>Send message</Button>
      {state === "error" && <Toast variant="error" onDismiss={() => setState("pristine")}>{serverMessage}</Toast>}
    </form>
  );
}
```

The honeypot is visually hidden off-screen with a one-pixel clipped box, not `display:none` or `hidden`; some bots omit hidden inputs, while this technique leaves it in the submitted form and remains non-disruptive to assistive technology. The form's states are pristine, invalid (RHF inline errors and `role="alert"` summary), submitting (`aria-busy` and loading label), success (replacement status card), and error (server-message toast). The message counter is muted below 1800, gold from 1800 to below 2000, and `#B42318` at 2000 and over.

### `components/ui/Toast.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = { variant: "success" | "error"; children: React.ReactNode; onDismiss?: () => void };

export function Toast({ variant, children, onDismiss }: Props) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss?.(), 6000);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);
  return <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} role={variant === "success" ? "status" : "alert"} className={variant === "success" ? "rounded-[12px] bg-chip-mint p-4 text-teal-dark" : "rounded-[12px] bg-[#FDECEC] p-4 text-[#B42318]"}><span>{children}</span>{onDismiss && <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="ml-4 underline">Dismiss</button>}</motion.div>;
}
```

### Contact and FAQ pages

`app/contact/page.tsx` must export metadata and render exactly four sections in this order: PageHero with eyebrow `Contact Us`, title `Let's start a conversation` (pass `conversation` as the gradient JSX word), and the SPEC lede; four info cards; `Reach the right team` with the four direct-line cards; and the two-column block. The map card uses this working Kathmandu OpenStreetMap embed:

```tsx
<iframe
  title="Digital Chautari location in Kathmandu"
  src="https://www.openstreetmap.org/export/embed.html?bbox=85.294%2C27.694%2C85.335%2C27.726&layer=mapnik&marker=27.7172%2C85.3240"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="h-72 w-full rounded-[12px] border-0"
/>
<div className="rounded-[12px] border border-line bg-chip-mint p-4 text-muted">Map preview unavailable. Find us in Kathmandu, Nepal, at 3rd Floor, Sundhara.</div>
```

Place the dark FAQ callout `Need quick answers?` linking to `/faq` and the three `responseTimes` beside the map. Email and phone info cards must use `mailto:` and `tel:` links.

`app/faq/page.tsx` renders PageHero with `FAQ`, `Questions, answered` (gradient `answered`), the existing `Accordion` over `faq`, and a closing `CTAPanel`. Add metadata with the root title template, a description no longer than 160 characters, `openGraph` title/description/url/type/siteName, and `twitter: { card: "summary_large_image" }`.

`data/faq.ts`:

```ts
export const faq = [
  { question: "What services does Digital Chautari offer?", answer: "We offer Digital Marketing, Content Creation, Software Development, and Branding & Design from our Kathmandu team. We can combine services when a project needs strategy, content, and software together." },
  { question: "How long is a typical engagement?", answer: "A focused campaign or content engagement can take four to eight weeks. Software and larger brand projects usually run for two to six months, with scope and milestones agreed before work starts." },
  { question: "How do you price projects?", answer: "We use the fixed monthly plans in the services section for repeat marketing work, and a scoped fixed price or milestone plan for custom work. We send a written proposal before any commitment." },
  { question: "How do we get started?", answer: "Send the contact form or email the team that matches your need. We will reply within 24 hours, ask a few practical questions, and arrange a consultation from Kathmandu." },
  { question: "What timeline should we expect?", answer: "The timeline depends on scope. We normally start with discovery, then work in two-week sprints with a demo at the end of each sprint, so progress is visible throughout the project." },
  { question: "What are your payment terms?", answer: "Payment terms are stated in the proposal. Custom projects are normally split across an initial payment and agreed milestones; monthly services are billed monthly." },
  { question: "Do you provide post-launch support?", answer: "Yes. We can provide ongoing support, analytics, maintenance, and improvement after launch. The support level and response expectations are included in the proposal or service plan." },
  { question: "How do you handle data and privacy?", answer: "We collect only what is needed to respond and deliver the project, limit access to the working team, and agree data handling in the project documentation. Ask us about your specific Nepal or cross-border requirements before sharing sensitive data." },
] as const;
```

## Data to add

| Export in `<file>` | Shape | Source |
|---|---|---|
| `projectTypes` in `lib/schema.ts` | `as const` tuple of the five exact project type strings | SPEC §4.8 / §6.1 |
| `infoCards`, `departments`, `responseTimes`, `projectTypes` in `data/contact.ts` | Four cards, four direct lines, three response-time objects, shared tuple | SPEC §4.8 |
| `faq` in `data/faq.ts` | Eight `{ question, answer }` objects | SPEC §4.11 and the exact content above |

## Acceptance criteria

**Functional**
- [ ] `POST /api/contact` returns `{ "ok": true }` for a valid request and the configured Resend inbox receives it.
- [ ] `/contact` contains PageHero, four info cards, four department cards, and the two-column form/map/FAQ/response-time block.
- [ ] `/faq` renders all eight entries from `data/faq.ts` and its closing CTA.
- [ ] The form preserves field order and has pristine, invalid, submitting, success, and error states; success offers `Send another message`.
- [ ] The honeypot returns 200 without sending mail, and the client honeypot skips the network request.
- [ ] `/api/health` returns `{ ok: true, uptime }`.

**Security / robustness**
- [ ] Five requests per ten minutes per IP return 429 on the sixth and include `Retry-After`.
- [ ] API key, provider error text, and stack traces never appear in a response.
- [ ] Name, email, subject, and message length caps are enforced server-side; bodies over 32 KiB are rejected early.
- [ ] All user-controlled email HTML is escaped, including ampersands, angle brackets, quotes, apostrophes, and line breaks.
- [ ] The missing-env path logs server-side with `console.error` and still returns 200.

**Design fidelity**
- [ ] Selected project pill uses teal background, white text, and a 20px radius; the contact map has the specified fallback beneath the iframe.
- [ ] Error text is `#B42318`; message counter is muted, gold at 1800, and danger over 2000.

**Accessibility**
- [ ] Every field has a visible label, error/hint `aria-describedby`, and `aria-invalid` when invalid.
- [ ] Project pills use the documented `radiogroup`/`radio` pattern and arrow/Home/End keys.
- [ ] Success and error notifications use `role="status"` and `role="alert"` respectively.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds

## Verification commands

Start the app with `npm run dev` and use a fresh `x-forwarded-for` value per independent test. These commands assume `BASE=http://localhost:3000`.

```bash
BASE=http://localhost:3000

# Happy path: expected {"ok":true}; with valid Resend configuration, inspect the inbox.
curl -sS -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -H 'x-forwarded-for: 203.0.113.10' \
  --data '{"name":"Asha Rai","email":"asha@example.com","subject":"Website enquiry","projectType":"Software Development","message":"I would like to discuss a Kathmandu health-tech product.","website":""}'

# 400: non-JSON content type; expected {"ok":false,"error":"Content-Type must be application/json."}
curl -sS -X POST "$BASE/api/contact" -H 'Content-Type: text/plain' -H 'x-forwarded-for: 203.0.113.11' --data 'not json'

# 400: malformed JSON; expected {"ok":false,"error":"Request body must be valid JSON."}
curl -sS -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -H 'x-forwarded-for: 203.0.113.12' --data '{'

# 400: name, email, subject, project type, and message issues; expected issues[] with one entry per invalid field.
curl -sS -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -H 'x-forwarded-for: 203.0.113.13' --data '{"name":"","email":"bad","subject":"x","projectType":"Nope","message":"short","website":""}'

# 400: oversized body; expected {"ok":false,"error":"Request body is too large."}
python3 -c 'print("{" + "\"name\":\"Asha Rai\",\"email\":\"asha@example.com\",\"subject\":\"Large\",\"projectType\":\"Other\",\"message\":\"" + ("x" * 33000) + "\"}")' | curl -sS -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -H 'x-forwarded-for: 203.0.113.14' --data-binary @-

# Honeypot: expected exactly {"ok":true}; confirm server logs no send and the provider inbox receives nothing.
curl -sS -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -H 'x-forwarded-for: 203.0.113.15' --data '{"name":"Asha Rai","email":"asha@example.com","subject":"Bot","projectType":"Other","message":"This is a bot submission with enough text.","website":"https://bot.example"}'

# 429: six rapid requests from the same IP; first five may be 200, sixth must be
# {"ok":false,"error":"Too many requests. Please try again later."} with Retry-After.
for i in 1 2 3 4 5 6; do curl -si -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -H 'x-forwarded-for: 203.0.113.16' --data '{"name":"Asha Rai","email":"asha@example.com","subject":"Rate test","projectType":"Other","message":"This message is long enough for validation.","website":""}'; done

# Health: expected {"ok":true,"uptime":<number>}.
curl -sS "$BASE/api/health"
```

## Manual QA

- [ ] Tab through every contact field; labels, focus rings, inline errors, and the error summary are visible.
- [ ] Use Arrow keys, Home, and End in ProjectTypePills; verify only one radio is selected.
- [ ] Submit an empty form, a valid form, a message at 1800 characters, and a message over 2000 characters.
- [ ] Fill the honeypot with browser devtools and verify no network request is made by the client.
- [ ] With no Resend variables, submit a valid form and verify the UI still succeeds while the server logs the no-config path.
- [ ] With valid Resend variables, submit on a production-like build and confirm the inbox receives the message.
- [ ] Open the map with the embed blocked and verify the styled fallback remains useful.
- [ ] Open `/faq`, expand each accordion item, and verify the closing CTA.

## Commit

`git commit -m "Phase 7: ship contact API and FAQ"`
