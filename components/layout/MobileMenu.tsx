"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Item = { label: string; href: string };
type MobileMenuProps = { open: boolean; onClose: () => void; triggerRef: RefObject<HTMLButtonElement | null>; items: Item[] };

export function MobileMenu({ open, onClose, triggerRef, items }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) onClose();
  }, [pathname, open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus());
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-b border-line bg-white p-5 shadow-lg"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <nav aria-label="Primary" className="grid gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[var(--radius-btn)] px-3 py-3 font-medium text-ink focus-visible:outline-2 focus-visible:outline-teal"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
