import type { ReactNode } from "react";

type MockFrameProps = { kind: "browser" | "phone"; children?: ReactNode };

export function MockFrame({ kind, children }: MockFrameProps) {
  if (kind === "phone") {
    return (
      <div aria-hidden="true" className="mx-auto w-[280px] overflow-hidden rounded-[32px] border-4 border-navy-border bg-white shadow-xl">
        {/* Notch */}
        <div className="flex items-center justify-center py-2">
          <div className="h-5 w-20 rounded-full bg-navy-border" />
        </div>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pb-2 text-[10px] text-muted">
          <span>9:41</span>
          <span>100%</span>
        </div>
        {/* Content */}
        <div className="space-y-3 px-4 pb-6">
          {children ?? (
            <>
              <div className="h-20 rounded-lg bg-chip-mint" />
              <div className="h-4 w-3/4 rounded bg-line" />
              <div className="h-4 w-1/2 rounded bg-line" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 rounded-lg bg-chip-teal" />
                <div className="h-16 rounded-lg bg-chip-gold" />
              </div>
              <div className="h-10 rounded-lg bg-teal/10" />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-navy-border bg-white shadow-xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-[#F3F4F6] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#FF5F57]" />
          <div className="size-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="size-2.5 rounded-full bg-[#28CA41]" />
        </div>
        <div className="ml-2 flex-1 rounded-md bg-white px-3 py-1 text-xs text-muted border border-line">
          digitalchautari.com
        </div>
      </div>
      {/* Content */}
      <div className="space-y-4 p-6">
        {children ?? (
          <>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-lg bg-teal/20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-line" />
                <div className="h-3 w-1/2 rounded bg-line" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 rounded-lg bg-chip-mint" />
              <div className="h-24 rounded-lg bg-chip-teal" />
              <div className="h-24 rounded-lg bg-chip-gold" />
            </div>
            <div className="h-12 rounded-lg bg-teal/10" />
            <div className="h-4 w-3/4 rounded bg-line" />
            <div className="h-4 w-1/2 rounded bg-line" />
          </>
        )}
      </div>
    </div>
  );
}
