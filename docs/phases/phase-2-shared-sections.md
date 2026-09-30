# Phase 2 — Shared Section Components

**Goal:** Build the reusable page sections and typed content constants that make every route composable from the canonical specification.
**Depends on:** Phase 1
**Estimate:** 5–7h
**Ships:**
- Real implementations of `PageHero`, `StatBar`, `DarkBanner`, and `CTAPanel`.
- Precise, implementation-ready contracts for every other reusable section in SPEC §2.7.
- Accessible `Accordion` and decorative `GradientBlobs` primitives.
- Typed `site`, navigation, testimonials, blog, team, pricing, products, and FAQ data exports.
- A temporary root smoke page that mounts one instance of every shared section for isolated verification; it is replaced in Phase 3.

---

## Scope

**In scope**
- Implement the four shared sections used across the page contracts with complete strict TypeScript TSX.
- Implement `GradientBlobs` and the accessible, animated `Accordion`.
- Add all Phase 2 data modules and keep page copy out of JSX.
- Add a temporary `/` smoke composition for all shared sections.

**Out of scope (later phases)**
- Full home, services, products, about, contact, and FAQ page compositions — Phase 3 and later page phases.
- `TabbedShowcase`, contact forms, API routes, SEO route files, and production metadata — their owning phases.
- Inventing personal names or unapproved testimonial claims — content owner review before launch.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `components/sections/PageHero.tsx` | Gradient page-introduction wash | `{ eyebrow, title, lede, align? }` |
| `components/sections/StatBar.tsx` | Equal-segment metric card | `{ stats, tone? }` |
| `components/sections/DarkBanner.tsx` | Full-bleed navy band with optional slot | `{ eyebrow, title, lede?, children? }` |
| `components/sections/CTAPanel.tsx` | Gradient CTA panel with two actions | `{ eyebrow?, title, body?, primary, secondary? }` |
| `components/sections/ProcessSteps.tsx` | Numbered process with desktop connectors | Precise contract below |
| `components/sections/Testimonials.tsx` | Three quote cards | Precise contract below |
| `components/sections/BlogTeaser.tsx` | Three gradient blog cards | Precise contract below |
| `components/sections/Timeline.tsx` | Alternating roadmap timeline | Precise contract below |
| `components/sections/TeamGrid.tsx` | Seven role-only team cards | Precise contract below |
| `components/sections/PricingGrid.tsx` | Three pricing tiers and billing toggle | Precise contract below |
| `components/sections/MockFrame.tsx` | CSS-only browser/phone frame | `{ kind, children? }` |
| `components/ui/GradientBlobs.tsx` | Decorative radial blobs and optional grain | `{ grain? }` |
| `components/ui/Accordion.tsx` | Accessible disclosure list | `{ items }` |
| `data/site.ts` | Site identity and contact constants | `site` |
| `data/navigation.ts` | Header and footer links | `navigation`, `footerColumns` |
| `data/testimonials.ts` | Three labelled illustrative quotes | `testimonials` |
| `data/blog.ts` | Three teaser records | `blogPosts` |
| `data/team.ts` | Seven roles, values, milestones, trust | `team`, `values`, `milestones`, `trust` |
| `data/pricing.ts` | Currency and three exact tiers | `pricing` |
| `data/products.ts` | Product type, three ventures, spotlight | `Product`, `products`, `spotlight` |
| `data/faq.ts` | Eight FAQ records | `faq` |
| `app/page.tsx` | Temporary shared-section smoke page | Default page component; replaced in Phase 3 |

## Files to modify

| Path | Change |
|---|---|
| `app/page.tsx` | Replace the Phase 0 placeholder with the temporary shared-section smoke page; replace again with the Home contract in Phase 3. |
| `components/ui/SectionHeading.tsx` | Only if required to accept the section heading composition; preserve its Phase 1 prop names. |

## Step-by-step

1. Add the typed data files first. Every page section must consume these exports rather than duplicating copy in JSX.
2. Add `GradientBlobs` and `Accordion`; verify the accordion with keyboard and screen-reader semantics before composing sections.
3. Add `PageHero`, `StatBar`, `DarkBanner`, and `CTAPanel` using the complete code below.
4. Add the remaining section components to their contracts below. The contracts are deliberately exact about DOM order, grid maths, dividers, and responsive behavior so implementation does not drift.
5. Add the temporary smoke page. It should mount one of every shared section, including `MockFrame`, without pretending to be the finished Home page.
6. Run format, lint, typecheck, and build. Confirm no shared section hardcodes page copy outside `data/`.

## Design & content notes

### Complete section implementations

`components/ui/GradientBlobs.tsx` is decorative and may remain a Server Component, but the implementation below uses the allowed client boundary so it can explicitly check `useReducedMotion()`. Three absolutely positioned, blurred radial circles use CSS animation durations between 8s and 14s; reduced motion renders them without animation classes. It must never enter the accessibility tree:

```tsx
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
```

If no noise asset exists, omit the optional grain span rather than creating a raster asset; the project otherwise uses zero raster images. Add the keyframe only if the component needs it:

```css
@keyframes blob-float {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(-18px, 14px, 0) scale(1.08); }
}
```

`components/ui/Accordion.tsx` is client-side because it owns disclosure state. Every button must have a stable `id`, every panel must have `role="region"`, `aria-labelledby` pointing to that button, and `aria-controls` pointing back to the panel. The animated wrapper is `grid-rows-[0fr]` to `grid-rows-[1fr]`; the inner element needs `min-h-0`:

```tsx
"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type AccordionItem = { question: string; answer: string };
type AccordionProps = { items: AccordionItem[] };

export function Accordion({ items }: AccordionProps) {
  const prefix = useId();
  const [open, setOpen] = useState<number | null>(null);
  return <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
    {items.map((item, index) => {
      const buttonId = `${prefix}-button-${index}`;
      const panelId = `${prefix}-panel-${index}`;
      const expanded = open === index;
      return <div key={item.question}>
        <h3><button id={buttonId} type="button" className="flex min-h-14 w-full items-center justify-between gap-4 px-[22px] py-4 text-left text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? null : index)}><span>{item.question}</span><span aria-hidden="true" className="text-xl text-teal-dark">{expanded ? "−" : "+"}</span></button></h3>
        <div id={panelId} role="region" aria-labelledby={buttonId} className={cn("grid transition-[grid-template-rows] duration-[280ms]", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="min-h-0 overflow-hidden"><p className="px-[22px] pb-5 leading-7 text-muted">{item.answer}</p></div></div>
      </div>;
    })}
  </div>;
}
```

`components/sections/PageHero.tsx`:

```tsx
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradientBlobs } from "@/components/ui/GradientBlobs";
import { cn } from "@/lib/cn";

type PageHeroProps = { eyebrow: ReactNode; title: ReactNode; lede: ReactNode; align?: "left" | "center" };

export function PageHero({ eyebrow, title, lede, align = "left" }: PageHeroProps) {
  return <section className="relative overflow-hidden bg-[var(--gradient-page-hero)] pb-12 pt-[84px]"><GradientBlobs /><Container className={cn("relative", align === "center" && "text-center")}><div className={cn("max-w-[720px]", align === "center" && "mx-auto")}><Eyebrow>{eyebrow}</Eyebrow><h1 className="mt-5">{title}</h1><p className="mt-5 max-w-[720px] text-lg leading-[1.6] text-muted">{lede}</p></div></Container></section>;
}
```

`components/sections/StatBar.tsx` uses one bordered card, equal-width segments, and 1px vertical dividers. It stacks to 2×2 and then one column at the mobile boundary:

```tsx
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Stat = { value: string | number; label: string; suffix?: string };
type StatBarProps = { stats: Stat[]; tone?: "light" | "dark" };

export function StatBar({ stats, tone = "light" }: StatBarProps) {
  const desktopColumns = stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return <Container><div className={cn("grid overflow-hidden rounded-[var(--radius-card)] border", tone === "dark" ? "border-navy-border bg-navy-card text-white" : "border-line bg-white text-ink", "grid-cols-1 min-[480px]:grid-cols-2", desktopColumns)}>
    {stats.map((stat, index) => <div key={stat.label} className={cn("px-5 py-7 text-center", index > 0 && "border-line min-[480px]:border-l", index > 1 && "min-[480px]:border-t-0", "max-[479px]:border-t")}><p className="font-[var(--font-sora)] text-3xl font-bold">{stat.value}{stat.suffix}</p><p className={cn("mt-2 text-sm", tone === "dark" ? "text-white/70" : "text-muted")}>{stat.label}</p></div>)}
  </div></Container>;
}
```

For exactly four stats at ≤760px, use two columns above the narrow 480px safety breakpoint and one column below it; at desktop the equal segments are four columns. The implementation must keep `28px` block padding.

`components/sections/DarkBanner.tsx`:

```tsx
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type DarkBannerProps = { eyebrow: ReactNode; title: ReactNode; lede?: ReactNode; children?: ReactNode };

export function DarkBanner({ eyebrow, title, lede, children }: DarkBannerProps) {
  return <section className="bg-navy py-16 text-white"><Container><Eyebrow tone="dark">{eyebrow}</Eyebrow><h2 className="mt-4 max-w-3xl text-white">{title}</h2>{lede ? <p className="mt-4 max-w-[720px] text-lg leading-[1.6] text-white/75">{lede}</p> : null}{children ? <div className="mt-8">{children}</div> : null}</Container></section>;
}
```

`components/sections/CTAPanel.tsx` uses the exact `--gradient-cta`, rounded 24px (the spec's `--radius-pill`→24px panel), `--shadow-panel`, white heading, and two actions. The primary action is a white background with teal text; the secondary is transparent with a white border:

```tsx
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type CTAAction = { label: string; href: string };
type CTAPanelProps = { eyebrow?: string; title: string; body?: string; primary: CTAAction; secondary?: CTAAction };

export function CTAPanel({ eyebrow, title, body, primary, secondary }: CTAPanelProps) {
  return <Container><section className="rounded-[24px] bg-[var(--gradient-cta)] px-6 py-10 shadow-[var(--shadow-panel)] sm:px-10 sm:py-12"><div className="max-w-3xl">{eyebrow ? <Eyebrow tone="dark">{eyebrow}</Eyebrow> : null}<h2 className="mt-4 text-white">{title}</h2>{body ? <p className="mt-4 max-w-2xl text-lg leading-[1.6] text-white/80">{body}</p> : null}<div className="mt-7 flex flex-wrap gap-3"><a href={primary.href} className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] bg-white px-5 font-medium text-teal-dark transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{primary.label}</a>{secondary ? <a href={secondary.href} className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] border border-white/80 bg-transparent px-5 font-medium text-white transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{secondary.label}</a> : null}</div></div></section></Container>;
}
```

### Remaining reusable section contracts

- **`ProcessSteps`** — props `{ steps: { title: string; body: string }[]; tone?: "light" | "dark" }`. Render a `section` containing a heading stack and an ordered list. Each step is a `li` with a numbered 44px chip, `h3`, and body. Desktop layout is `grid-template-columns: repeat(4, minmax(0, 1fr))`, `gap: 20px`; an absolutely positioned 1px connector runs from the center-right of each chip to the next chip. Mobile is one column and hides connectors. Dark chips are `--navy-card` with `--navy-border`; light chips use a pastel tint.
- **`Testimonials`** — props `{ testimonials: { quote: string; name: string; title: string }[] }`. Render exactly three `Card interactive` elements in a `grid-cols-1 md:grid-cols-3` grid with `gap-5`; each has five gold star glyphs, a `blockquote`, then name and title/company. Keep illustrative attribution labels explicit and do not add personal names.
- **`BlogTeaser`** — props `{ posts: { slug: string; title: string; excerpt: string; category: string; date: string; readTime: string; gradient: [string, string] }[] }`. Render three anchor cards in a `grid-cols-1 md:grid-cols-3` grid with `gap-5`; each begins with an aspect-16/9 CSS-gradient block, then category, localized ISO date, read time, title, excerpt, and literal `Read more →`. Use the gradient token names from `data/blog.ts`, never image assets.
- **`Timeline`** — props `{ milestones: { year: number; title: string; body: string }[] }`. Render a dark section with a centered 1px vertical line and four items in an alternating two-column layout. Each item has a green dot on the line and a gold year pill. On ≤760px the line moves to the left and all content is left-aligned; use one column, not horizontal scrolling.
- **`TeamGrid`** — props `{ team: { role: string; monogram: string; focus: string; gradient: string }[] }`. Render seven role-only cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` with `gap-5`; each card has a gradient initial-avatar circle, role heading, and focus. Do not render invented personal names.
- **`PricingGrid`** — props `{ pricing: { currency: string; tiers: Tier[] } }` where `Tier` has the exact `name`, `price`, `period`, `tagline`, `features`, and `featured` fields below. This is the one client section in this phase because of the Monthly/Yearly toggle. Render three cards in `grid-cols-1 lg:grid-cols-3`, `gap-5`; featured is `--navy-card`, has a gold `Most Popular` badge, and uses `lg:-translate-y-3 lg:scale-[1.02]`. Monthly shows exact prices; Yearly computes numeric `price × 12 × 0.85`, rounds to nearest 500, and shows `/year`; `Custom` stays `Custom`.
- **`MockFrame`** — props `{ kind: "browser" | "phone"; children?: ReactNode }`. Render a CSS-only frame with top browser dots/address bar for `browser`, or a rounded phone shell/notch for `phone`. Inside, render fake dashboard rectangles and children; no `<img>`, remote asset, or raster file. Browser is wide; phone has a narrow fixed aspect. All fake content is `aria-hidden` unless children are real product content.

### Typed content data

`data/site.ts`:

```ts
export const site = {
  name: "Digital Chautari",
  tagline: "Digital. Together.",
  description: "Digital Chautari is a Kathmandu-based digital agency building brands, content, and software — including Physio@Home, our at-home physiotherapy platform.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digital-chautari.vercel.app",
  founded: 2025,
  location: "Kathmandu, Nepal",
  email: "hello@digitalchautari.com",
  phone: "+977 98XXXXXXXX",
  hours: "Sunday–Friday, 10:00–18:00 NPT",
  social: [{ label: "LinkedIn", href: "#" }, { label: "X", href: "#" }, { label: "Instagram", href: "#" }, { label: "GitHub", href: "#" }],
} as const;
```

`data/navigation.ts`:

```ts
export const navigation = [
  { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Products", href: "/products" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
] as const;

export const footerColumns = [
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Products", href: "/products" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }] },
  { title: "Services", links: [{ label: "Digital Marketing", href: "/services" }, { label: "Content Creation", href: "/services" }, { label: "Software Development", href: "/services" }, { label: "Branding & Design", href: "/services" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Accessibility", href: "#" }] },
] as const;
```

`data/pricing.ts`:

```ts
export const pricing = {
  currency: "Rs",
  tiers: [
    { name: "Starter", price: "15,000", period: "/month", tagline: "For founders validating a new idea.", features: ["1 active campaign channel", "SEO audit + monthly reporting", "4 social posts / month", "Email support"], featured: false },
    { name: "Professional", price: "45,000", period: "/month", tagline: "Our most popular plan for growing teams.", features: ["Up to 3 channels, fully managed", "Content production (video + photo)", "Landing page build & CRO", "Bi-weekly strategy calls", "Priority support"], featured: true },
    { name: "Enterprise", price: "Custom", period: "", tagline: "For organisations with complex needs.", features: ["Dedicated squad", "Custom software development", "Full brand identity system", "SLA & 24/7 escalation", "Quarterly on-site reviews"], featured: false },
  ],
} as const;
```

`data/products.ts`:

```ts
export type Product = {
  slug: "eco-creative" | "one-content" | "physio-at-home";
  name: string; category: string; tagline: string; description: string;
  tags: string[]; stats: { label: string; value: string }[];
  cta: { label: string; href: string };
  frame: "browser" | "phone" | "browser";
};

export const products: Product[] = [
  { slug: "eco-creative", name: "Eco Creative Marketing Agency", category: "Marketing Agency", tagline: "Sustainable marketing for brands that mean it", description: "Eco Creative helps Kathmandu and Nepal-based brands grow with measurable, responsible marketing. Its team connects search, paid social, content, and analytics into campaigns built for lasting impact.", tags: ["SEO", "Paid Social", "Content", "Analytics"], stats: [{ label: "Campaigns", value: "30+" }, { label: "Industries", value: "12" }, { label: "Rating", value: "4.9★" }], cta: { label: "Talk to us", href: "/contact" }, frame: "browser" },
  { slug: "one-content", name: "One Content Creation Studio", category: "Content Studio", tagline: "One team for every format your audience scrolls", description: "One Content gives Kathmandu teams one partner for video, photography, copy, and design. The studio turns a single idea into consistent formats for Nepalese audiences and modern channels.", tags: ["Video", "Photo", "Copy", "Design"], stats: [{ label: "Assets Delivered", value: "400+" }, { label: "Brands", value: "50+" }, { label: "Studios", value: "3" }], cta: { label: "Start a project", href: "/contact" }, frame: "phone" },
  { slug: "physio-at-home", name: "Physio@Home", category: "Health-Tech", tagline: "Physiotherapy that comes to your living room", description: "Physio@Home connects people across Kathmandu with licensed physiotherapists at home. The Nepal-focused platform brings booking, recovery plans, vitals, and payments into one calmer care journey.", tags: ["Booking", "Vitals", "Plans", "Payments"], stats: [{ label: "Districts", value: "8" }, { label: "Physios", value: "25" }, { label: "Rating", value: "4.9★" }], cta: { label: "Book a session", href: "/contact" }, frame: "browser" },
];

export const spotlight = { eyebrow: "Health-Tech", title: "Physio@Home — healthcare reimagined", body: "Patients book a licensed physiotherapist, share symptoms and vitals, follow a recovery plan, and pay in-app. We built it because waiting rooms in Kathmandu are a barrier, not a formality." } as const;
```

`data/team.ts`:

```ts
export const team = [
  { role: "Founder & CEO", monogram: "FC", focus: "Vision, fundraising, partnerships", gradient: "teal-to-gold" },
  { role: "Co-Founder & COO", monogram: "CO", focus: "Operations, delivery, hiring", gradient: "leaf-to-teal" },
  { role: "Front-End Developer", monogram: "FE", focus: "React, Next.js, design systems", gradient: "lilac-to-teal" },
  { role: "Back-End Developer", monogram: "BE", focus: "APIs, databases, infrastructure", gradient: "navy-to-teal" },
  { role: "Marketing Lead", monogram: "ML", focus: "Campaigns, SEO, paid media", gradient: "gold-to-leaf" },
  { role: "Sales Executive", monogram: "SE", focus: "Client relationships, pipeline", gradient: "pink-to-gold" },
  { role: "Business Development Officer", monogram: "BD", focus: "Partnerships, vendor network", gradient: "teal-to-blue" },
] as const;

export const values = [
  { title: "Passion", icon: "Flame", body: "We care about the outcome more than the deliverable." },
  { title: "Creativity", icon: "Lightbulb", body: "We look for the idea nobody else tried." },
  { title: "Excellence", icon: "Award", body: "Details are the product." },
  { title: "Collaboration", icon: "Users", body: "Client and agency, one team." },
] as const;

export const milestones = [
  { year: 2025, title: "The Idea", body: "Digital Chautari registered. Three problems picked: marketing, content, and access to physiotherapy." },
  { year: 2025, title: "First Products", body: "Eco Creative and One Content launched with their first five clients." },
  { year: 2026, title: "Health-Tech Entry", body: "Physio@Home MVP shipped across Kathmandu Valley, with eight districts on the roadmap." },
  { year: 2026, title: "Company Registration", body: "Formal company registration, expanded team, and first enterprise contracts." },
] as const;

export const trust = ["ISO 9001 Ready", "Data Protection (Nepal)", "Global Delivery", "Pan-Nepal Network"] as const;
```

`data/testimonials.ts` must retain this HTML-comment-level content warning in the source file: `// Illustrative placeholders only; replace before launch and do not impersonate named people.` Use role-based attribution until supplied:

```ts
export const testimonials = [
  { quote: "Illustrative client quote — replace before launch.", name: "Marketing Lead", title: "Marketing Lead, E-Commerce Client" },
  { quote: "Illustrative client quote — replace before launch.", name: "Founder", title: "Founder, Kathmandu Startup" },
  { quote: "Illustrative client quote — replace before launch.", name: "Operations Lead", title: "Operations Lead, Nepalese Organisation" },
] as const;
```

`data/blog.ts` contains the three exact required titles/categories and token-name gradients. Dates, read times, and excerpts must be confirmed by the content owner before launch:

```ts
export const blogPosts = [
  { slug: "why-a-chautari-still-beats-a-conference-room", title: "Why a chautari still beats a conference room", excerpt: "A practical look at the conversations and trust that make collaborative work move.", category: "Culture", date: "2026-01-15", readTime: "4 min read", gradient: ["teal", "leaf"] as [string, string] },
  { slug: "physiotherapy-at-home-what-we-learned-from-200-sessions", title: "Physiotherapy at home: what we learned from 200 sessions", excerpt: "Lessons from designing a calmer, more accessible recovery experience in Kathmandu.", category: "Health-Tech", date: "2026-02-12", readTime: "6 min read", gradient: ["navy", "teal"] as [string, string] },
  { slug: "five-seo-mistakes-nepalese-brands-keep-making", title: "Five SEO mistakes Nepalese brands keep making", excerpt: "The search fundamentals teams can fix before spending more on acquisition.", category: "Digital Marketing", date: "2026-03-05", readTime: "5 min read", gradient: ["gold", "leaf"] as [string, string] },
] as const;
```

`data/faq.ts` supplies exactly eight Q/A pairs covering the required subjects (services, engagement length, pricing, starting, timeline, payment terms, post-launch support, and data/privacy):

```ts
export const faq = [
  { question: "What services do you offer?", answer: "Digital Marketing, Content Creation, Software Development, and Branding & Design, plus the strategy and delivery support that connects them." },
  { question: "How long is a typical engagement?", answer: "It depends on the scope: a focused campaign may take a few weeks, while a product or retained growth partnership is planned in milestones over several months." },
  { question: "How do you price projects?", answer: "We scope the outcome, team, timeline, and deliverables first, then provide transparent fixed-scope or retained pricing." },
  { question: "How do we get started?", answer: "Send a message through the contact form with your goals and project type. We will reply within one business day with next steps." },
  { question: "What timeline should we expect?", answer: "After discovery, we share a milestone plan. Most work begins with a two-week sprint rhythm and a demo at the end of each sprint." },
  { question: "What are your payment terms?", answer: "Payment terms are agreed in the proposal and vary by scope; the team will make the schedule clear before work starts." },
  { question: "Do you provide post-launch support?", answer: "Yes. Post-launch support and ongoing improvement can be included as a retained service or a separately scoped support plan." },
  { question: "How do you handle data and privacy?", answer: "We limit access to project data, use appropriate safeguards, and agree the relevant handling and privacy requirements during discovery." },
] as const;
```

### Temporary smoke page source

Create this as `app/page.tsx` for verification only; it is documentation of the required smoke composition, not a request to add application code during this documentation task. Replace it with the Home contract in Phase 3:

```tsx
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { CTAPanel } from "@/components/sections/CTAPanel";
import { DarkBanner } from "@/components/sections/DarkBanner";
import { MockFrame } from "@/components/sections/MockFrame";
import { PageHero } from "@/components/sections/PageHero";
import { PricingGrid } from "@/components/sections/PricingGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatBar } from "@/components/sections/StatBar";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { Timeline } from "@/components/sections/Timeline";
import { Accordion } from "@/components/ui/Accordion";
import { blogPosts } from "@/data/blog";
import { faq } from "@/data/faq";
import { milestones, team } from "@/data/team";
import { pricing } from "@/data/pricing";
import { testimonials } from "@/data/testimonials";

export default function SmokePage() {
  return <>
    <PageHero eyebrow="Shared section smoke test" title={<>Reusable sections, <span className="gradient-text">together</span></>} lede="Temporary Phase 2 verification page." align="center" />
    <StatBar stats={[{ value: 3, label: "Products" }, { value: 6, label: "Team Members", suffix: "+" }, { value: 100, label: "Commitment", suffix: "%" }]} />
    <DarkBanner eyebrow="Shared dark banner" title="A navy surface with a content slot"><StatBar tone="dark" stats={[{ value: "250+", label: "Projects" }, { value: "40+", label: "Clients" }]} /></DarkBanner>
    <section className="py-16"><CTAPanel eyebrow="Shared CTA" title="Ready to build something extraordinary together?" body="Tell us what you're working on." primary={{ label: "Start a Project", href: "/contact" }} secondary={{ label: "View Services", href: "/services" }} /></section>
    <ProcessSteps steps={[{ title: "Discover", body: "Workshops and honest conversations." }, { title: "Design", body: "One coherent brand, UX, and content system." }, { title: "Develop", body: "Agile builds in two-week sprints." }, { title: "Deliver", body: "Launch, measure, and improve." }]} />
    <Testimonials testimonials={testimonials} />
    <BlogTeaser posts={blogPosts} />
    <Timeline milestones={milestones} />
    <TeamGrid team={team} />
    <PricingGrid pricing={pricing} />
    <section className="p-16"><MockFrame kind="browser" /></section>
    <section className="mx-auto max-w-[720px] px-[22px] py-16"><Accordion items={faq} /></section>
  </>;
}
```

## Acceptance criteria

**Functional**
- [ ] `PageHero`, `StatBar`, `DarkBanner`, and `CTAPanel` compile and consume only their contracted props.
- [ ] `Accordion` has button `aria-expanded`, reciprocal `aria-controls`/`aria-labelledby`, and a working `0fr→1fr` grid animation.
- [ ] Data modules export the exact names required by this phase and use no invented personal names.
- [ ] Smoke page mounts one `PageHero`, `StatBar`, `DarkBanner`, `CTAPanel`, `ProcessSteps`, `Testimonials`, `BlogTeaser`, `Timeline`, `TeamGrid`, `PricingGrid`, and `MockFrame`.
- [ ] `PricingGrid` yearly billing computes numeric prices as `×12×0.85`, nearest 500, and retains `Custom`.

**Design fidelity**
- [ ] Page hero uses `--gradient-page-hero`, top-right blobs, 84px top/48px bottom, and lede max width 720px.
- [ ] Stat segments use 28px block padding, equal widths, 20px grid rhythm, and 1px dividers.
- [ ] Dark sections use `--navy`; CTA uses the exact `--gradient-cta`, 24px radius, and `--shadow-panel`.
- [ ] Responsive collapse follows 760px, not 768px: grids stack/collapse exactly as each contract states.

**Accessibility**
- [ ] Decorative blobs, grain, fake frame content, and progress decoration are `aria-hidden`.
- [ ] Accordion is usable by keyboard and exposes its open state to assistive technology.
- [ ] All smoke-page links, buttons, and tab-like controls have visible focus styles.
- [ ] Reduced motion keeps accordion transition effectively static and does not animate blobs or section reveals.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds

## Verification commands

```bash
npm run format
npm run lint
npm run typecheck
npm run build
npm run dev
```

## Manual QA

- [ ] Open `/` and confirm every shared section renders once, with no missing data or console warnings.
- [ ] At 360px, the smoke page has no horizontal scroll; at 760px, the intended mobile/desktop boundary is observed.
- [ ] Open and close each accordion item with mouse and keyboard; inspect `aria-expanded`, `aria-controls`, and `role="region"`.
- [ ] Toggle PricingGrid Monthly/Yearly and verify Starter, Professional, and Enterprise display the correct values and periods.
- [ ] Enable reduced motion and confirm blobs, reveals, count-up, and accordion effects settle to their final/static state.
- [ ] Confirm testimonials are visibly labelled as illustrative placeholders and contain no invented names.

## Commit

`git commit -m "Phase 2: shared section components"`
