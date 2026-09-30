import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal" aria-label="Digital Chautari home">
      <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-teal via-teal-dark to-gold font-[var(--font-sora)] text-base font-extrabold text-white shadow-lg shadow-teal/25 transition-shadow group-hover:shadow-xl group-hover:shadow-teal/35">
        DC
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-leaf" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-[var(--font-sora)] text-[15px] font-bold tracking-tight", inverted ? "text-white" : "text-ink")}>
          Digital Chautari
        </span>
        <span className={cn("mt-0.5 font-sans text-[11px] font-medium tracking-wide", inverted ? "text-white/60" : "text-muted")}>
          Digital. Together.
        </span>
      </span>
    </Link>
  );
}
