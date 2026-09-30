import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Testimonial = { quote: string; name: string; title: string };
type TestimonialsProps = { testimonials: Testimonial[] };

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-paper py-16 text-ink">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="What clients say" align="center" />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} interactive>
              <div className="mb-3 text-gold" aria-hidden="true">{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <blockquote className="text-sm leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 border-t border-line pt-3">
                <p className="text-sm font-semibold text-ink">{t.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
