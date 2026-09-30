import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtext?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtext, align = "left", tone = "light", className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-[720px]", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("mt-3", tone === "dark" ? "text-white" : "text-ink")}>{title}</h2>
      {subtext ? <p className={cn("mt-4 text-lg leading-[1.6]", tone === "dark" ? "text-white/75" : "text-muted")}>{subtext}</p> : null}
    </div>
  );
}
