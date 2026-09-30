import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/cn";

type IconChipProps = {
  icon: ComponentType<LucideProps> | string;
  tone?: "mint" | "teal" | "gold" | "lilac" | "pink";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const tones = {
  mint: "bg-chip-mint text-teal-dark",
  teal: "bg-chip-teal text-teal-dark",
  gold: "bg-chip-gold text-[#8a6412]",
  lilac: "bg-chip-lilac text-[#71447b]",
  pink: "bg-chip-pink text-[#9c3f50]",
} as const;

const sizes = { sm: "size-11", md: "size-[52px]", lg: "size-[60px]" } as const;

export function IconChip({ icon: Icon, tone = "mint", size = "md", className }: IconChipProps) {
  return (
    <span className={cn("chip inline-flex items-center justify-center rounded-[var(--radius-chip)] transition duration-250 group-hover:scale-[1.08]", tones[tone], sizes[size], className)} aria-hidden="true">
      {typeof Icon === "string" ? <span>{Icon}</span> : <Icon className="size-1/2" strokeWidth={1.8} />}
    </span>
  );
}
