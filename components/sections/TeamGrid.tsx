import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type TeamMember = { role: string; monogram: string; focus: string; gradient: string };
type TeamGridProps = { team: TeamMember[] };

export function TeamGrid({ team }: TeamGridProps) {
  return (
    <section className="bg-paper py-16 text-ink">
      <Container>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.role} interactive>
              <div className={cn(
                "mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br text-lg font-bold text-white",
                member.gradient,
              )}>
                {member.monogram}
              </div>
              <h3 className="mt-4 text-center text-base font-semibold text-ink">{member.role}</h3>
              <p className="mt-1 text-center text-sm text-muted">{member.focus}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
