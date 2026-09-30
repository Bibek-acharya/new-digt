import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  as?: ElementType;
  tone?: "light" | "dark" | "transparent";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

export function Card({ as: Component = "div", tone = "light", interactive = false, className, children }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-[var(--radius-card)] border p-[22px]",
        tone === "light" && "border-line bg-white text-ink",
        tone === "dark" && "border-navy-border bg-navy-card text-white",
        tone === "transparent" && "border-transparent bg-transparent",
        interactive && "transition duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
