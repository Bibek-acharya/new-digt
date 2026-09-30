import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  variant?: "standard" | "tight" | "hero" | "none";
  tone?: "light" | "tint" | "dark";
  className?: string;
  children: ReactNode;
  id?: string;
};

const variants = {
  standard: "py-16",
  tight: "py-12",
  hero: "pb-12 pt-[84px]",
  none: "",
} as const;

const tones = {
  light: "bg-paper text-ink",
  tint: "bg-[#EAF6EC] text-ink",
  dark: "bg-navy text-white",
} as const;

export function Section({ variant = "standard", tone = "light", className, children, id }: SectionProps) {
  return (
    <section id={id} className={cn(variants[variant], tones[tone], className)}>
      {children}
    </section>
  );
}
