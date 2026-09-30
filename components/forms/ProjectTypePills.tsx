"use client";

import { cn } from "@/lib/cn";

const projectTypeOptions = [
  "Digital Marketing",
  "Content Creation",
  "Software Development",
  "Branding & Design",
  "Other",
] as const;

type ProjectTypePillsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProjectTypePills({ value, onChange }: ProjectTypePillsProps) {
  return (
    <div role="radiogroup" aria-label="Project type" className="flex flex-wrap gap-2">
      {projectTypeOptions.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-10 rounded-[20px] px-4 py-2 text-sm font-medium transition",
              selected
                ? "bg-teal text-white"
                : "bg-chip-teal text-ink hover:bg-chip-mint",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
