import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Milestone = { year: number; title: string; body: string };
type TimelineProps = { milestones: Milestone[] };

export function Timeline({ milestones }: TimelineProps) {
  return (
    <section className="bg-navy py-16 text-white">
      <Container>
        <div className="relative">
          {/* Center line */}
          <div className="absolute bottom-0 left-1/2 top-0 w-px bg-navy-border max-[759px]:left-[19px]" />
          <div className="grid gap-8">
            {milestones.map((m, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={m.title}
                  className={cn(
                    "relative grid gap-5 max-[759px]:ml-12 max-[759px]:grid-cols-1 lg:grid-cols-2",
                  )}
                >
                  {/* Content */}
                  <div className={cn("max-[759px]:text-left", isLeft ? "lg:text-right lg:pr-12" : "lg:order-2 lg:pl-12")}>
                    <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                      {m.year}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-white">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{m.body}</p>
                  </div>
                  {/* Dot */}
                  <div className={cn("absolute left-[-19px] top-1 z-10 max-[759px]:left-[-19px] lg:left-1/2 lg:-translate-x-1/2", isLeft ? "lg:order-2" : "lg:order-1")}>
                    <div className="size-[14px] rounded-full border-2 border-leaf bg-navy" />
                  </div>
                  {/* Empty spacer for opposite side */}
                  <div className={cn("max-[759px]:hidden", isLeft ? "" : "lg:order-1")} />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
