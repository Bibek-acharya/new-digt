"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

type Tier = { name: string; price: string; period: string; tagline: string; features: string[]; featured: boolean };
type PricingData = { currency: string; tiers: Tier[] };
type PricingGridProps = { pricing: PricingData };

export function PricingGrid({ pricing }: PricingGridProps) {
  const [yearly, setYearly] = useState(false);

  function formatPrice(tier: Tier): string {
    if (tier.price === "Custom") return "Custom";
    if (!yearly) return `${pricing.currency} ${tier.price}`;
    const numeric = parseInt(tier.price.replace(/,/g, ""), 10);
    const yearlyPrice = Math.round((numeric * 12 * 0.85) / 500) * 500;
    return `${pricing.currency} ${yearlyPrice.toLocaleString()}`;
  }

  return (
    <Container>
      <SectionHeading eyebrow="Pricing" title="Simple, transparent plans" align="center" />
      {/* Billing toggle */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", !yearly ? "text-ink" : "text-muted")}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly((v) => !v)}
          className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200", yearly ? "bg-teal" : "bg-line")}
        >
          <span className={cn("pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200", yearly ? "translate-x-5" : "translate-x-0")} />
        </button>
        <span className={cn("text-sm font-medium", yearly ? "text-ink" : "text-muted")}>
          Yearly <span className="text-teal-dark">-15%</span>
        </span>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {pricing.tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "rounded-[var(--radius-card)] border p-[22px]",
              tier.featured
                ? "border-navy-border bg-navy-card text-white lg:-translate-y-3 lg:scale-[1.02]"
                : "border-line bg-white text-ink",
            )}
          >
            {tier.featured ? (
              <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">Most Popular</span>
            ) : null}
            <h3 className={cn("mt-3 text-lg font-semibold", tier.featured ? "text-white" : "text-ink")}>{tier.name}</h3>
            <p className={cn("mt-1 text-sm", tier.featured ? "text-white/70" : "text-muted")}>{tier.tagline}</p>
            <div className="mt-4">
              <span className={cn("text-3xl font-bold", tier.featured ? "text-white" : "text-ink")}>
                {formatPrice(tier)}
              </span>
              {tier.price !== "Custom" ? (
                <span className={cn("text-sm", tier.featured ? "text-white/70" : "text-muted")}>
                  {yearly ? "/year" : tier.period}
                </span>
              ) : null}
            </div>
            <ul className="mt-6 grid gap-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className={cn("mt-0.5 text-xs", tier.featured ? "text-gold" : "text-teal-dark")}>{"\u2713"}</span>
                  <span className={tier.featured ? "text-white/80" : "text-muted"}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
