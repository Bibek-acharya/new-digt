import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradientBlobs } from "@/components/ui/GradientBlobs";
import { cn } from "@/lib/cn";

type PageHeroProps = { eyebrow: ReactNode; title: ReactNode; lede: ReactNode; align?: "left" | "center" };

export function PageHero({ eyebrow, title, lede, align = "left" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--gradient-page-hero)] pb-12 pt-[84px]">
      <GradientBlobs />
      <Container className={cn("relative", align === "center" && "text-center")}>
        <div className={cn("max-w-[720px]", align === "center" && "mx-auto")}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5">{title}</h1>
          <p className="mt-5 max-w-[720px] text-lg leading-[1.6] text-muted">{lede}</p>
        </div>
      </Container>
    </section>
  );
}
