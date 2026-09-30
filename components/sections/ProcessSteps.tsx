import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

type Step = { title: string; body: string };
type ProcessStepsProps = { steps: Step[]; tone?: "light" | "dark" };

export function ProcessSteps({ steps, tone = "dark" }: ProcessStepsProps) {
  return (
    <section className={cn(tone === "dark" ? "bg-navy py-16 text-white" : "bg-paper py-16 text-ink")}>
      <Container>
        <SectionHeading
          eyebrow="Our Process"
          title="How we work"
          align="center"
          tone={tone}
        />
        <div className="relative mt-12">
          {/* Connector line (desktop only) */}
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-navy-border lg:block" />
          <ol className="grid grid-cols-1 gap-5 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <div className="flex flex-col items-center lg:items-start">
                  <div className={cn(
                    "relative z-10 grid size-11 place-items-center rounded-full border text-sm font-bold",
                    tone === "dark"
                      ? "border-navy-border bg-navy-card text-white"
                      : "border-line bg-white text-ink",
                  )}>
                    {index + 1}
                  </div>
                  <h3 className={cn("mt-4 text-base font-semibold", tone === "dark" ? "text-white" : "text-ink")}>
                    {step.title}
                  </h3>
                  <p className={cn("mt-2 text-sm leading-relaxed", tone === "dark" ? "text-white/70" : "text-muted")}>
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
