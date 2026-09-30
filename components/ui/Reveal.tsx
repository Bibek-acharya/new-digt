"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { createElement } from "react";
import { cn } from "@/lib/cn";

type RevealProps = { children: ReactNode; index?: number; as?: ElementType; className?: string };

export function Reveal({ children, index = 0, as = "div", className }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return createElement(as, { className: cn(className) }, children);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.07 }}
    >
      {children}
    </motion.div>
  );
}
