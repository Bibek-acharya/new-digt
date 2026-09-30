import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastProps = { variant: "success" | "error"; children: ReactNode; onDismiss?: () => void };

export function Toast({ variant, children, onDismiss }: ToastProps) {
  return (
    <div role={variant === "error" ? "alert" : "status"} className={cn("flex items-start justify-between gap-4 rounded-[var(--radius-card)] border p-4 text-sm", variant === "success" ? "border-teal/30 bg-chip-mint text-teal-dark" : "border-[#B42318]/30 bg-[#FDECEC] text-[#B42318]")}>
      <p>{children}</p>
      {onDismiss ? (
        <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="rounded p-1 focus-visible:outline-2 focus-visible:outline-teal">
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
