import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "ghost" | "gold" | "onDark" | "outlineDark";
  size?: "md" | "lg";
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  isLoading?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

const variants = {
  primary: "bg-teal text-white hover:bg-teal-dark",
  ghost: "bg-transparent text-teal-dark hover:bg-chip-teal",
  gold: "bg-gold text-navy hover:bg-[#c99422]",
  onDark: "border border-white/70 bg-transparent text-white hover:bg-white/10",
  outlineDark: "border border-navy-border bg-transparent text-navy hover:bg-navy hover:text-white",
} as const;

const sizes = { md: "min-h-11 px-4 text-sm", lg: "min-h-12 px-5 text-base" } as const;

export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  isLoading = false,
  icon: Icon,
  children,
  className,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
    variants[variant],
    sizes[size],
    className,
  );
  const content = (
    <>
      {isLoading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} aria-disabled={isLoading || undefined}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={isLoading} aria-busy={isLoading || undefined}>
      {content}
    </button>
  );
}
