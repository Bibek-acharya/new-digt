import { Container } from "@/components/ui/Container";

type CTAAction = { label: string; href: string };
type CTAPanelProps = { eyebrow?: string; title: string; body?: string; primary: CTAAction; secondary?: CTAAction };

export function CTAPanel({ eyebrow, title, body, primary, secondary }: CTAPanelProps) {
  return (
    <Container>
      <section
        className="rounded-[24px] px-6 py-10 shadow-[var(--shadow-panel)] sm:px-10 sm:py-12"
        style={{ background: "linear-gradient(135deg, #0F9488 0%, #0B6F66 45%, #0F4C9E 100%)" }}
      >
        <div className="max-w-3xl">
          {eyebrow ? (
            <span className="inline-flex rounded-full bg-gold/20 px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">{title}</h2>
          {body ? <p className="mt-4 max-w-2xl text-lg leading-[1.6] text-white/85">{body}</p> : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={primary.href}
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] bg-white px-6 font-semibold text-teal-dark transition hover:bg-white/90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] border-2 border-white/60 bg-transparent px-6 font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </Container>
  );
}
