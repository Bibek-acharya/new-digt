import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Stat = { value: string | number; label: string; suffix?: string };
type StatBarProps = { stats: Stat[]; tone?: "light" | "dark" };

export function StatBar({ stats, tone = "light" }: StatBarProps) {
  const desktopColumns = stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <Container>
      <div
        className={cn(
          "grid overflow-hidden rounded-[var(--radius-card)] border",
          tone === "dark" ? "border-navy-border bg-navy-card text-white" : "border-line bg-white text-ink",
          "grid-cols-1 min-[480px]:grid-cols-2",
          desktopColumns,
        )}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "px-5 py-7 text-center",
              index > 0 && "border-line min-[480px]:border-l",
              index > 1 && "min-[480px]:border-t-0",
              "max-[479px]:border-t",
            )}
          >
            <p className="font-[var(--font-sora)] text-3xl font-bold">
              {stat.value}{stat.suffix}
            </p>
            <p className={cn("mt-2 text-sm", tone === "dark" ? "text-white/70" : "text-muted")}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
