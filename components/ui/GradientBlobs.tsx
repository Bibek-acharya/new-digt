"use client";

import { useReducedMotion } from "framer-motion";

type GradientBlobsProps = { grain?: boolean };

export function GradientBlobs({ grain = false }: GradientBlobsProps) {
  const reduced = useReducedMotion();
  const float = reduced ? "" : "animate-[blob-float_10s_ease-in-out_infinite_alternate]";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className={`absolute -right-24 -top-24 size-72 rounded-full bg-teal/20 blur-3xl ${float}`} />
      <span className={`absolute right-24 top-20 size-56 rounded-full bg-gold/15 blur-3xl ${reduced ? "" : "animate-[blob-float_14s_ease-in-out_infinite_alternate-reverse]"}`} />
      <span className={`absolute -right-8 top-48 size-48 rounded-full bg-leaf/15 blur-3xl ${reduced ? "" : "animate-[blob-float_8s_ease-in-out_infinite_alternate]"}`} />
      {grain ? <span className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#fff_0.6px,transparent_0.6px)] [background-size:4px_4px]" /> : null}
    </div>
  );
}
