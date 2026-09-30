import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type DarkBannerProps = { eyebrow: ReactNode; title: ReactNode; lede?: ReactNode; children?: ReactNode };

export function DarkBanner({ eyebrow, title, lede, children }: DarkBannerProps) {
  return (
    <section className="bg-navy py-16 text-white">
      <Container>
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-white">{title}</h2>
        {lede ? <p className="mt-4 max-w-[720px] text-lg leading-[1.6] text-white/75">{lede}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}
