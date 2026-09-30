# Phase 5 — Products Page

**Goal:** Ship a three-section, deep-linkable Products page that presents all three ventures through an accessible, animated tabbed showcase.
**Depends on:** Phase 4 — shared page sections and content data contracts
**Estimate:** 6h
**Ships:**
- `/products` renders the exact PageHero, tabbed showcase, and dark spotlight order from SPEC §5.3.
- The three product slugs are selectable by mouse, keyboard, and URL hash without a scroll jump.
- Product panels use CSS-only browser/phone mock frames, contain no raster-image dependency, and respect reduced motion.
- Product copy is typed in `data/products.ts`; no page copy is hardcoded in JSX.

---

## Scope

**In scope**
- Complete the `data/products.ts` content contract established in Phase 2 with the `Product` type, three products, and `spotlight` from SPEC §4.6.
- Create the Products page metadata and three-section composition.
- Implement `TabbedShowcase` as the client boundary, including the complete ARIA, keyboard, animation, and hash contracts below.
- Implement `MockFrame` with CSS-only browser and phone chrome and CSS-generated dashboard content.
- Add the dark `DarkBanner` spotlight with an explicitly contrast-safe light body color.

**Out of scope (later phases)**
- Contact form submission and email delivery — Phase 7.
- Site-wide SEO assets, sitemap, robots, and final Lighthouse/axe sweep — Phase 8.
- Any raster or remote-image asset pipeline — no phase owns one because this project has no raster images.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `app/products/page.tsx` | Server-rendered Products route with metadata and the three sections | `metadata`; default page export |
| `components/sections/TabbedShowcase.tsx` | Client-side tab state machine and animated panels | `TabbedShowcase({ products })` |
| `components/sections/MockFrame.tsx` | CSS-only browser/phone mock UI | Existing `MockFrame({ kind, children? })` contract |

## Files to modify

| Path | Change |
|---|---|
| `data/products.ts` | Verify the Phase 2 data against SPEC §4.6 and retain the exact three products plus `spotlight`. |
| `components/sections/MockFrame.tsx` | Extend fake dashboard content only; preserve the existing `{ kind, children? }` prop names. |

## Step-by-step

1. Verify the existing Phase 2 `data/products.ts` against SPEC §4.6 before writing the page; preserve the three literal slugs and `frame` values exactly.
2. Resolve the missing canonical product descriptions and Products PageHero lede with the content owner; do not invent or paraphrase them in JSX.
3. Implement or verify `MockFrame` with its existing `kind="browser" | "phone"` prop: browser for `eco-creative` and `physio-at-home`, phone for `one-content`.
4. Implement the complete `TabbedShowcase` below as the only client component for this page.
5. Compose `/products` in the exact three-section order and export metadata with title `"Products"`, the exact site description from SPEC §4.1 because no Products-specific description is supplied, `site.url`, `type: "website"`, `siteName: "Digital Chautari"`, and `twitter: { card: "summary_large_image" }`.
6. Run the verification commands and perform every manual deep-link, keyboard, responsive, contrast, and reduced-motion check.

## Section-by-section build plan

### Section 1 — PageHero
- **Component:** `<PageHero eyebrow="Our Products" title={<>Three ventures, <span className="gradient-text">one vision</span></>} lede={productsPage.lede} />`.
- **Copy:** eyebrow `"Our Products"`; title `"Three ventures, one vision"`; the gradient word is `"one vision"`. The lede has no literal in SPEC §4.6/§5.3 and must be supplied before implementation.
- **Layout:** `PageHero` owns the `--gradient-page-hero` wash and top-right `GradientBlobs`; use the shared `1120px` container, `40px` desktop / `22px` mobile padding, hero `84px` top and `48px` bottom padding. Keep the lede at the shared `max-w-[720px]`.
- **Motion:** `PageHero`'s existing reveal contract only; no new animation. Decorative blobs are `aria-hidden="true"` and static under reduced motion.
- **Acceptance:** At `/products`, exactly one `h1` contains `Three ventures, one vision`, `one vision` uses `.gradient-text`, and the hero lede is sourced from data rather than JSX.

### Section 2 — TabbedShowcase
- **Component:** `<TabbedShowcase products={products} />`.
- **Copy:** Product category, name, description, tags, stats, and CTA are read from `data/products.ts`; the exact names, categories, tag strings, stat strings, and CTA strings are the rows in SPEC §4.6.
- **Layout:** The tablist is a horizontal pill row with `gap-5` and a `layoutId="tab-indicator"` active pill. Each panel is a two-column layout: left category label, title, description, tags, stat pairs, and CTA; right `MockFrame`. At `max-width: 760px`, use one column with the frame first, then the copy, because the visual product proof should be encountered before the supporting text on a narrow screen. Use the shared `1120px` container and `64px` standard section padding.
- **Motion:** Use `Reveal` indices for the tablist (`0`), panel frame (`1`), category/title/description group (`2`), tags (`3`), stats (`4`), and CTA (`5`), giving each the shared `index * 0.07` delay. The panel swap is `AnimatePresence mode="wait"`, `opacity: 0 -> 1`, `x: 16 -> 0` when moving forward and `x: -16 -> 0` when moving backward, `0.3s` `easeOut`, keyed by slug. `useReducedMotion()` renders the final state with no transform. The active indicator uses a spring with `stiffness: 380, damping: 32`; it exists exactly once outside the panel `AnimatePresence`.
- **Acceptance:** Selecting every tab updates all four tab attributes and the corresponding panel attributes; only the selected panel is visible; the active indicator appears once; the frame order changes to frame-first at 760px and below; no raster image request is made.

#### `TabbedShowcase` implementation contract

The following is the complete component shape. It chooses **automatic activation**: arrow keys select immediately, update the panel, and move focus. Panels are pre-rendered as DOM nodes with inactive panels `hidden`, so a focused tab never points at a removed panel. `Enter` and `Space` are still handled as activation keys for the complete keyboard contract.

```tsx
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
        // Guard: replaceState does not add history or scroll; compare before writing.
        // The ref also makes a browser hashchange caused by this write a no-op.
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

    // Mount: matching hash wins; invalid or absent hash selects the first tab.
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
                <span className="relative z-10">{product.name}</span>
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
```

The `layoutId` element is outside the panel `AnimatePresence` and is rendered exactly once because only the selected tab renders it. Hash synchronization compares the current hash before `replaceState`, uses `lastWrittenHash` to ignore a self-induced `hashchange`, and never calls `pushState`.

### `MockFrame` contract
- **Component:** `<MockFrame kind={product.frame} />` using the existing shared `{ kind, children? }` prop contract.
- **Copy:** No user-facing copy is required beyond the product-specific frame labels from the data model; fake labels are decorative dashboard chrome.
- **Layout:** `frame="browser"` renders traffic-light dots, an address pill, and a dashboard surface; `frame="phone"` renders a notch, status bar, and dashboard surface. Use divs, CSS gradients, and tree-shakeable `lucide-react` icons only.
- **Motion:** Static by default; no additional animation. Any hover treatment must use the existing 250ms card contract and must disappear under reduced motion.
- **Acceptance:** `eco-creative` and `physio-at-home` pass `kind="browser"`, `one-content` passes `kind="phone"`, and the DOM contains no `<img>`, remote image URL, canvas, or raster asset reference. No raster images exist in this project.

### Section 3 — Dark spotlight
- **Component:** `<DarkBanner eyebrow={spotlight.eyebrow} title={spotlight.title} lede={spotlight.body} />`.
- **Copy:** eyebrow `"Health-Tech"`; title `"Physio@Home — healthcare reimagined"`; body `"Patients book a licensed physiotherapist, share symptoms and vitals, follow a recovery plan, and pay in-app. We built it because waiting rooms in Kathmandu are a barrier, not a formality."`.
- **Layout:** Full-bleed `--navy` background with the shared container; use standard `64px` block padding and the existing `DarkBanner` heading/body rhythm.
- **Motion:** Use `Reveal` indices `0` for eyebrow, `1` for title, and `2` for body; the shared reduced-motion contract renders them statically.
- **Acceptance:** The eyebrow is gold on navy; body text uses `#C9D2DC`, not `--muted` `#5B6472`. Check foreground `#C9D2DC` on background `#0B1220` at `12.25:1` (passes 4.5:1), and gold `#E0A930` on navy at `8.82:1`. Never use `#5B6472` for body text on `#0B1220`.

## Complex interaction spec

```ts
type TabState = {
  active: "eco-creative" | "one-content" | "physio-at-home";
  direction: 1 | -1;
  activation: "automatic";
  hashWrite: "history.replaceState(null, '', '#' + active)";
};

// Initial and external navigation:
// location.hash in the slug set -> that tab; absent/invalid -> first tab.
// hashchange -> select matching slug without writing a new hash.
// User selection -> compare current hash, replaceState only when different,
// then focus the selected tab; never pushState and never scroll to the hash.

// Keyboard map:
// ArrowRight / ArrowDown -> next (wrap), select immediately, focus it.
// ArrowLeft / ArrowUp -> previous (wrap), select immediately, focus it.
// Home -> first, select immediately, focus it.
// End -> last, select immediately, focus it.
// Enter / Space -> activate the focused tab and focus it.

// DOM invariant:
// Every product has a pre-rendered role=tabpanel with the required id,
// aria-labelledby, and tabIndex=0. Non-active panels are hidden, not removed.
// The active panel content is the only AnimatePresence child, keyed by slug.
```

## Data to add

The Phase 2 module already established this exact data shape. Phase 5 must verify it against SPEC §4.6 rather than create a second module:

```ts
export type Product = {
  slug: "eco-creative" | "one-content" | "physio-at-home";
  name: string;
  category: string;
  tagline: string;
  description: string;
  tags: string[];
  stats: { label: string; value: string }[];
  cta: { label: string; href: string };
  frame: "browser" | "phone" | "browser";
};

export const products: Product[] = [
  { slug: "eco-creative", name: "Eco Creative Marketing Agency", category: "Marketing Agency", tagline: "Sustainable marketing for brands that mean it", description: "Eco Creative helps Kathmandu and Nepal-based brands grow with measurable, responsible marketing. Its team connects search, paid social, content, and analytics into campaigns built for lasting impact.", tags: ["SEO", "Paid Social", "Content", "Analytics"], stats: [{ label: "Campaigns", value: "30+" }, { label: "Industries", value: "12" }, { label: "Rating", value: "4.9★" }], cta: { label: "Talk to us", href: "/contact" }, frame: "browser" },
  { slug: "one-content", name: "One Content Creation Studio", category: "Content Studio", tagline: "One team for every format your audience scrolls", description: "One Content gives Kathmandu teams one partner for video, photography, copy, and design. The studio turns a single idea into consistent formats for Nepalese audiences and modern channels.", tags: ["Video", "Photo", "Copy", "Design"], stats: [{ label: "Assets Delivered", value: "400+" }, { label: "Brands", value: "50+" }, { label: "Studios", value: "3" }], cta: { label: "Start a project", href: "/contact" }, frame: "phone" },
  { slug: "physio-at-home", name: "Physio@Home", category: "Health-Tech", tagline: "Physiotherapy that comes to your living room", description: "Physio@Home connects people across Kathmandu with licensed physiotherapists at home. The Nepal-focused platform brings booking, recovery plans, vitals, and payments into one calmer care journey.", tags: ["Booking", "Vitals", "Plans", "Payments"], stats: [{ label: "Districts", value: "8" }, { label: "Physios", value: "25" }, { label: "Rating", value: "4.9★" }], cta: { label: "Book a session", href: "/contact" }, frame: "browser" },
];

export const spotlight = {
  eyebrow: "Health-Tech",
  title: "Physio@Home — healthcare reimagined",
  body: "Patients book a licensed physiotherapist, share symptoms and vitals, follow a recovery plan, and pay in-app. We built it because waiting rooms in Kathmandu are a barrier, not a formality.",
} as const;
```

| Export in `<file>` | Shape | Source |
|---|---|---|
| `Product` in `data/products.ts` | `slug: "eco-creative" | "one-content" | "physio-at-home"; name: string; category: string; tagline: string; description: string; tags: string[]; stats: { label: string; value: string }[]; cta: { label: string; href: string }; frame: "browser" | "phone" | "browser"` | SPEC §4.6, including the exact three rows and frame values |
| `products` in `data/products.ts` | `Product[]` containing Eco Creative, One Content, and Physio@Home in that order | Phase 2 established this export; SPEC §4.6 describes the records but does not name the array export |
| `spotlight` in `data/products.ts` | `{ eyebrow: string; title: string; body: string }` | SPEC §4.6 exact object |
| `productsPage.lede` in `data/products.ts` or the agreed page-data file | `string` | Missing from SPEC §4.6/§5.3; obtain canonical literal before implementation |

The `description` strings are required to be 2–3 sentences and mention Kathmandu/Nepal, but SPEC §4.6 does not provide their literal text. Phase 2 currently contains descriptions; verify those strings with the content owner rather than silently changing them. Do not create a second description source.

## Acceptance criteria

**Functional**
- [ ] `/products` renders exactly three sections in the SPEC §5.3 order.
- [ ] `/products` selects the first tab; `/products#physio-at-home` selects the third tab, does not scroll away on load, and survives reload after switching tabs.
- [ ] Home-page `Learn more →` links to `/products#eco-creative`, `/products#one-content`, and `/products#physio-at-home` open the matching tab.
- [ ] Selecting a tab uses `history.replaceState`, creates no history entry, and causes no hash/state loop.
- [ ] `MockFrame` maps browser / phone / browser exactly to the three SPEC §4.6 products.

**Design fidelity**
- [ ] Product panel is two columns above 760px and frame-first single column at 760px and below.
- [ ] Active pill uses one `layoutId="tab-indicator"` with spring stiffness `380` and damping `32`.
- [ ] Panel swap uses the specified direction, `0.3s` `easeOut`, opacity, x-offset, and reduced-motion static state.
- [ ] Spotlight uses `--navy`, exact SPEC copy, and `#C9D2DC` body text with the documented contrast ratio.

**Accessibility**
- [ ] Tabs have `role="tablist"`, an accessible label, roving `tabIndex`, `aria-selected`, `aria-controls`, and exact `tab-<slug>` IDs.
- [ ] Every panel has `role="tabpanel"`, `tabIndex={0}`, exact `panel-<slug>` ID, and matching `aria-labelledby`.
- [ ] Arrow, Home, End, Enter, and Space paths work with visible focus and automatic activation.
- [ ] All decorative mock chrome is `aria-hidden` or otherwise excluded from the accessible name; no image has missing alternative text because no images are used.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds

## Verification commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Manual QA

- [ ] Open `/products` and verify the first tab and first panel are selected.
- [ ] Open `/products#physio-at-home` directly and verify the third tab opens without a scroll jump.
- [ ] From Home, activate each `Learn more →` link and verify the matching Products tab opens.
- [ ] Switch tabs, reload, and verify the selected hash and tab persist.
- [ ] With focus on each tab, verify Right/Down, Left/Up, Home, End, Enter, and Space behavior; confirm only the selected tab has `tabIndex=0`.
- [ ] At 760px and 360px, verify frame-first stacking and no horizontal scroll; verify browser/phone frame mapping.
- [ ] Enable `prefers-reduced-motion: reduce` and verify no panel translation or indicator spring runs.
- [ ] Run axe and inspect spotlight text contrast, tab relationships, focus rings, and the absence of console warnings.

## Commit

`git commit -m "Phase 5: Products page"`
