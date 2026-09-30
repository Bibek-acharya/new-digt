import Link from "next/link";
import { cn } from "@/lib/cn";
import Image from "next/image";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal" aria-label="Digital Chautari home">
      <Image
        src="/logo.svg"
        alt="Digital Chautari Logo"
        width={48}
        height={48}
        className="size-12 rounded-xl transition-transform group-hover:scale-105"
        priority
      />
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
