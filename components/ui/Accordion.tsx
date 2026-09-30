"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type AccordionItem = { question: string; answer: string };
type AccordionProps = { items: AccordionItem[] };

export function Accordion({ items }: AccordionProps) {
  const prefix = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
      {items.map((item, index) => {
        const buttonId = `${prefix}-button-${index}`;
        const panelId = `${prefix}-panel-${index}`;
        const expanded = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex min-h-14 w-full items-center justify-between gap-4 px-[22px] py-4 text-left text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="text-xl text-teal-dark">
                  {expanded ? "\u2212" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-[280ms]",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="px-[22px] pb-5 leading-7 text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
