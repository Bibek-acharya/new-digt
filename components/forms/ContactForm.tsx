"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schema";
import { ProjectTypePills } from "./ProjectTypePills";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type FormState = "pristine" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("pristine");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", projectType: undefined, message: "", website: "" },
  });

  const projectType = watch("projectType");
  const message = watch("message");
  const messageLength = message?.length ?? 0;

  const onSubmit = async (data: ContactInput) => {
    // Client-side honeypot short-circuit
    if (data.website) {
      setFormState("success");
      return;
    }
    setFormState("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) {
        setFormState("success");
      } else {
        setFormState("error");
        setServerError(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setServerError("Network error. Please try again.");
    }
  };

  if (formState === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] border border-teal/30 bg-chip-mint p-8 text-center">
        <h3 className="text-lg font-semibold text-teal-dark">Thanks \u2014 we&apos;ll reply within 24 hours.</h3>
        <p className="mt-2 text-sm text-muted">Your message has been sent successfully.</p>
        <button
          type="button"
          onClick={() => { reset(); setFormState("pristine"); }}
          className="mt-4 text-sm font-medium text-teal-dark underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot - off screen, not display:none */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Do not fill this</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Name</label>
        <input
          id="name"
          type="text"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-card)] border px-4 py-3 text-sm outline-none transition",
            errors.name ? "border-[#B42318] focus-visible:outline-2 focus-visible:outline-[#B42318]" : "border-line focus-visible:outline-2 focus-visible:outline-teal",
          )}
        />
        {errors.name ? <p id="name-error" role="alert" className="mt-1 text-xs text-[#B42318]">{errors.name.message}</p> : null}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-card)] border px-4 py-3 text-sm outline-none transition",
            errors.email ? "border-[#B42318] focus-visible:outline-2 focus-visible:outline-[#B42318]" : "border-line focus-visible:outline-2 focus-visible:outline-teal",
          )}
        />
        {errors.email ? <p id="email-error" role="alert" className="mt-1 text-xs text-[#B42318]">{errors.email.message}</p> : null}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink">Subject</label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-card)] border px-4 py-3 text-sm outline-none transition",
            errors.subject ? "border-[#B42318] focus-visible:outline-2 focus-visible:outline-[#B42318]" : "border-line focus-visible:outline-2 focus-visible:outline-teal",
          )}
        />
        {errors.subject ? <p id="subject-error" role="alert" className="mt-1 text-xs text-[#B42318]">{errors.subject.message}</p> : null}
      </div>

      {/* Project Type */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Project Type</label>
        <ProjectTypePills value={projectType ?? ""} onChange={(v) => setValue("projectType", v as ContactInput["projectType"], { shouldValidate: true })} />
        {errors.projectType ? <p role="alert" className="mt-1 text-xs text-[#B42318]">{errors.projectType.message}</p> : null}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">Message</label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-card)] border px-4 py-3 text-sm outline-none transition",
            errors.message ? "border-[#B42318] focus-visible:outline-2 focus-visible:outline-[#B42318]" : "border-line focus-visible:outline-2 focus-visible:outline-teal",
          )}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.message ? <p id="message-error" role="alert" className="text-xs text-[#B42318]">{errors.message.message}</p> : <span />}
          <span className={cn("text-xs", messageLength > 2000 ? "text-[#B42318]" : messageLength > 1800 ? "text-gold" : "text-muted")}>
            {messageLength}/2000
          </span>
        </div>
      </div>

      {formState === "error" ? (
        <Toast variant="error">{serverError}</Toast>
      ) : null}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] bg-teal px-5 font-medium text-white transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        aria-busy={formState === "submitting" || undefined}
      >
        {formState === "submitting" ? "Sending\u2026" : "Send Message"}
      </button>
    </form>
  );
}
