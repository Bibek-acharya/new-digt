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
  message: z.string().trim().min(10, "Tell us a little more \u2014 at least 10 characters.").max(2000, "Message must be 2000 characters or fewer."),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
