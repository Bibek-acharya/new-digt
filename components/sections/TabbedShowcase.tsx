"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MockFrame } from "@/components/sections/MockFrame";
import type { Product } from "@/data/products";

type Slug = Product["slug"];

const isSlug = (value: string): value is Slug =>
  value === "eco-creative" || value === "one-content" || value === "physio-at-home";

type TabbedShowcaseProps = { products: Product[] };

export function TabbedShowcase({ products }: TabbedShowcaseProps) {
  const reduceMotion = useReducedMotion();
  const firstSlug = products[0]?.slug ?? "eco-creative";
  const [activeSlug, setActiveSlug] = useState<Slug>(firstSlug);
  const [direction, setDirection] = useState<1 | -1>(1);
  const tabRefs = useRef<Partial<Record<Slug, HTMLButtonElement | null>>>({});
  const lastWrittenHash = useRef<string | null>(null);
  const activeProduct = products.find(({ slug }) => slug === activeSlug) ?? products[0];

  const focusTab = useCallback((slug: Slug) => {
    window.requestAnimationFrame(() => tabRefs.current[slug]?.focus());
  }, []);

  const selectSlug = useCallback(
    (nextSlug: Slug, syncHash = true) => {
      const currentIndex = products.findIndex(({ slug }) => slug === activeSlug);
      const nextIndex = products.findIndex(({ slug }) => slug === nextSlug);
      if (nextIndex >= 0 && currentIndex >= 0 && nextIndex !== currentIndex) {
        setDirection(nextIndex > currentIndex ? 1 : -1);
      }
      if (nextSlug === activeSlug) {
        focusTab(nextSlug);
        return;
      }
      setActiveSlug(nextSlug);
      if (syncHash) {
        const nextHash = `#${nextSlug}`;
        if (window.location.hash !== nextHash) {
          lastWrittenHash.current = nextHash;
          window.history.replaceState(null, "", nextHash);
        }
      }
      focusTab(nextSlug);
    },
    [activeSlug, focusTab, products],
  );

  useEffect(() => {
    const readHash = () => window.location.hash.slice(1);
    const syncFromHash = () => {
      const hash = `#${readHash()}`;
      if (lastWrittenHash.current === hash) {
        lastWrittenHash.current = null;
        return;
      }
      const hashSlug = readHash();
      if (isSlug(hashSlug) && products.some(({ slug }) => slug === hashSlug)) {
        selectSlug(hashSlug, false);
      } else if (activeSlug !== firstSlug) {
        selectSlug(firstSlug, false);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [activeSlug, firstSlug, products, selectSlug]);

  if (!activeProduct) return null;

  const panelVariants = {
    initial: { opacity: 0, x: direction * 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction * -16 },
  } as const;

  const move = (offset: number) => {
    const index = products.findIndex(({ slug }) => slug === activeSlug);
    const next = products[(index + offset + products.length) % products.length];
    if (next) selectSlug(next.slug);
  };

  return (
    <section aria-label="Our products" className="py-16">
      <Container>
        <div role="tablist" aria-label="Product ventures" className="flex flex-wrap gap-2">
          {products.map((product) => {
            const selected = product.slug === activeSlug;
            return (
              <button
                key={product.slug}
                ref={(node) => { tabRefs.current[product.slug] = node; }}
                id={`tab-${product.slug}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${product.slug}`}
                tabIndex={selected ? 0 : -1}
                type="button"
                className="relative min-h-11 rounded-[20px] px-4 py-2 text-sm font-semibold"
                onClick={() => selectSlug(product.slug)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault();
                    move(1);
                  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault();
                    move(-1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    selectSlug(products[0].slug);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    selectSlug(products[products.length - 1].slug);
                  } else if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectSlug(product.slug);
                  }
                }}
              >
                {selected && (
                  <motion.span
                    layoutId="tab-indicator"
                    aria-hidden="true"
                    className="absolute inset-0 -z-0 rounded-[20px] bg-teal"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 text-white">{product.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {products.map((product) => (
            <div
              key={product.slug}
              id={`panel-${product.slug}`}
              role="tabpanel"
              aria-labelledby={`tab-${product.slug}`}
              tabIndex={0}
              hidden={product.slug !== activeSlug}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              {product.slug === activeSlug && (
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={product.slug}
                    custom={direction}
                    variants={panelVariants}
                    initial={reduceMotion ? false : "initial"}
                    animate="animate"
                    exit={reduceMotion ? undefined : "exit"}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
                    className="grid grid-cols-2 items-center gap-5 max-[760px]:grid-cols-1"
                  >
                    <div className="max-[760px]:order-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-dark">{product.category}</p>
                      <h2 className="mt-2">{product.name}</h2>
                      <p className="mt-4 text-muted">{product.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {product.tags.map((tag) => <span key={tag} className="rounded-[20px] bg-chip-teal px-3 py-1 text-sm text-ink">{tag}</span>)}
                      </div>
                      <dl className="mt-6 grid grid-cols-2 gap-5">
                        {product.stats.map((stat) => <div key={stat.label}><dt className="text-sm text-muted">{stat.label}</dt><dd className="mt-1 font-semibold">{stat.value}</dd></div>)}
                      </dl>
                      <div className="mt-6"><Button variant="primary" size="md" href={product.cta.href} icon={ArrowRight}>{product.cta.label}</Button></div>
                    </div>
                    <div className="max-[760px]:order-1"><MockFrame kind={product.frame} /></div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
