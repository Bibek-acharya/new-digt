import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = { children: ReactNode; tone?: "light" | "dark"; className?: string };

export function Eyebrow({ children, tone = "light", className }: EyebrowProps) {
  return (
    <span className={cn("inline-flex rounded-[var(--radius-pill)] px-3 py-1.5 font-sans text-[13px] font-semibold uppercase tracking-[0.08em]", tone === "light" && "bg-chip-mint text-teal-dark", tone === "dark" && "bg-gold/15 text-gold", className)}>
      {children}
    </span>
  );
}
