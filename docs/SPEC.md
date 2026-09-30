# Digital Chautari — Canonical Specification

> **Status:** source of truth. Every phase file, data file, and component in this repo MUST conform to this document.
> If a phase file and this document disagree, **this document wins** — fix the phase file, not the spec.
> Version: 1.0 · Target: Next.js 15 App Router + TypeScript + Tailwind CSS v4

---

## 0. Product Summary

Digital Chautari is a Nepali digital agency ("chautari" = the traditional Nepali community house / courtyard — a place where people gather and talk). The site markets the agency and its three ventures.

**Pages (7 total, 5 required + 2 supporting):**

| Route | Purpose | Sections |
|---|---|---|
| `/` | Home / marketing landing | 10 |
| `/services` | Service catalogue + pricing | 6 |
| `/products` | Three ventures, tabbed deep-linkable | 3 |
| `/about` | Company story, team, roadmap | 8 |
| `/contact` | Contact form + routes to the right team | 4 |
| `/faq` | Accordion FAQ (required — Contact links here) | 2 |
| `404` | Brand-styled not-found | 1 |

**Hard requirements from the assignment:** Next.js for frontend *and* backend; a real working `POST /api/contact`; the specified palette/typography/spacing; the specified animations; deployed live on Vercel.

---

## 1. Tech Stack (fixed — do not substitute)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15.x, **App Router**, TypeScript `strict` | Server Components by default |
| Runtime | Node 20+ (Vercel default) | |
| Styling | Tailwind CSS **v4** (`@import "tailwindcss"` + `@theme`), CSS variables in `globals.css` | No Tailwind config file needed in v4 |
| Fonts | `next/font/google` → `Sora` (400,600,700,800) and `Inter` (400,500,600) | Exposed as `--font-sora`, `--font-inter` |
| Animation | `framer-motion` v11+ | `motion.div`, `useReducedMotion`, `AnimatePresence` |
| Icons | `lucide-react` | Tree-shakeable |
| Forms | `react-hook-form` + `@hookform/resolvers` + `zod` v3 | One schema, both sides |
| Email | `resend` SDK | Falls back gracefully if key missing |
| Styling helpers | `clsx` + `tailwind-merge` via `lib/cn.ts` | No `tailwind-variants` dependency |
| Quality | ESLint 9 flat config, Prettier, `npm run typecheck`, Lighthouse, axe |
| Hosting | Vercel | |

**Explicitly forbidden:** large animation libs other than framer-motion, CMS, ORM, `next/image` with remote images (no remote images exist), icon fonts, CSS frameworks, and any component library that ships its own styles (MUI/Chakra/shadcn-with-external-deps).

---

## 2. Design System

### 2.1 Colour tokens

Declared in `app/globals.css` under `:root`, then exposed to Tailwind v4 via `@theme inline { --color-teal: var(--teal); ... }` so utilities like `bg-teal`, `text-muted`, `border-line` work.

> **Spec correction:** the source PDF line-broke these hex values. The values below are the corrected ones. Never use the broken forms.

| Token | Value | Role |
|---|---|---|
| `--teal` | `#0F9488` | Primary. Buttons, links, accents, gradient start |
| `--teal-dark` | `#0B6F66` | Hover state, small teal text on light bg (contrast) |
| `--gold` | `#E0A930` | Accent. Gradient mid-stop, dark-section eyebrows, badges |
| `--leaf` | `#7FAE3A` | Gradient end-stop, success/positive markers |
| `--ink` | `#101826` | Body text |
| `--navy` | `#0B1220` | Dark section backgrounds, footer |
| `--navy-card` | `#101D2B` | Card surface on navy |
| `--navy-border` | `#223140` | Border on navy surfaces |
| `--paper` | `#FBFBF9` | Page background |
| `--line` | `#E7E5DF` | Hairline borders on light surfaces |
| `--muted` | `#5B6472` | Secondary text |
| `--chip-mint` | `#E7F5EA` | Icon chip tint A |
| `--chip-teal` | `#E7F2F4` | Icon chip tint B |
| `--chip-gold` | `#FDF1DE` | Icon chip tint C |
| `--chip-lilac` | `#F4E9F6` | Icon chip tint D |
| `--chip-pink` | `#FDEEF0` | Icon chip tint E |

**Gradients**
- `--gradient-text`: `linear-gradient(90deg, #0F9488, #E0A930, #7FAE3A)` — exactly 90°, three stops in that order. Apply via `.gradient-text` with `background-clip:text; -webkit-text-fill-color:transparent`.
- `--gradient-cta`: `linear-gradient(135deg, #0F9488 0%, #0B6F66 45%, #0F4C9E 100%)` — teal→deep-teal→blue for CTA panels and hero glow.
- `--gradient-page-hero`: `linear-gradient(180deg, #EAF6EC 0%, #FBFBF9 100%)` — mint→paper page hero wash.

**Colour rules (contrast is a hard requirement)**
- Gold is used **only** on navy/dark backgrounds, as large text (≥24px), or as a non-text accent. Never gold body text on `--paper`.
- Teal text on light backgrounds must be `--teal-dark`, not `--teal`, whenever the text is under 24px.
- Never place a pastel chip tint behind `--muted` body text without a darkening; chips carry icons, not body copy.

### 2.2 Typography

| Element | Font | Desktop | Mobile | Weight | Extra |
|---|---|---|---|---|---|
| `h1` | Sora | `56px` (`3.5rem`) | `36px` | 800 | `line-height: 1.08`, `letter-spacing: -0.02em` |
| `h2` | Sora | `38px` (`2.375rem`) | `28px` | 700 | `line-height: 1.15`, `letter-spacing: -0.015em` |
| `h3` | Sora | `20px` | `18px` | 600 | `line-height: 1.3` |
| `h4` | Sora | `16px` | `16px` | 600 | |
| Lede | Inter | `18px` | `16px` | 400 | `line-height: 1.6`, `--muted` |
| Body | Inter | `16px` | `16px` | 400 | `line-height: 1.5` (globally) |
| Body medium | Inter | `16px` | | 500 | card body emphasis |
| Eyebrow | Inter | `13px` | | 600 | `text-transform: uppercase`, `letter-spacing: 0.08em` |
| Caption | Inter | `14px` | | 500 | |

- `body { font-family: var(--font-inter); font-size: 16px; line-height: 1.5; color: var(--ink); background: var(--paper); }` lives in `globals.css`.
- Never use Sora below 16px.
- H1–H4 use `--font-sora` via a base rule, not per-component overrides.

### 2.3 Spacing rhythm

| Primitive | Value |
|---|---|
| Container max width | `1120px` |
| Container padding | `40px` desktop / `22px` mobile (switch at `760px`) |
| Section `standard` | `64px` block padding |
| Section `tight` | `48px` block padding |
| Section `hero` | `84px` top, `48px` bottom |
| Grid gap | `20px` everywhere (`gap-5`) |
| Card padding | `22px` (`1.375rem`) |
| Stat bar segment padding | `28px` block |

**Breakpoint note:** the assignment specifies a 760px navigation switchpoint, which is *not* a default Tailwind breakpoint. Add it once in `globals.css` / theme as `--breakpoint-nav: 760px` and use `max-[759px]:` variants (or a `@media (max-width: 759px)` custom variant) for all nav/grid-collapse rules. Do not shift the whole design system to 768px.

Standard Tailwind breakpoints still apply for `sm/md/lg/xl` where convenient (`md=768`, `lg=1024`, `xl=1280`), but the container and nav rules are pinned to 760px.

### 2.4 Radii, borders, shadows

| Token | Value | Applies to |
|---|---|---|
| `--radius-chip` | `10px` (accept 9–10) | `IconChip` |
| `--radius-card` | `12px` | `Card`, inputs, textareas, selects |
| `--radius-btn` | `8px` | `Button` |
| `--radius-pill` | `20px` (accept 14–20) | `Eyebrow`, `ProjectTypePills`, filter chips |
| `--shadow-hover` | `0 16px 30px -18px rgba(16, 24, 38, 0.2)` | Card hover only |
| `--shadow-panel` | `0 24px 60px -30px rgba(11, 18, 32, 0.35)` | CTA panel, floating mock UI |
| Border | `1px solid var(--line)` light · `1px solid var(--navy-border)` dark | |

Cards are **flat at rest** (no shadow). Hover = `translateY(-4px)` + `--shadow-hover`, `250ms` ease.

### 2.5 Component library

All components live under `components/ui/` (primitives), `components/layout/`, `components/sections/`, `components/forms/`.

| Component | File | Props / contract |
|---|---|---|
| `Container` | `ui/Container.tsx` | `{ children, className?, as?: "div"\|"section"\|"header"\|"footer" }` — `max-w-[1120px] mx-auto px-[22px] md:px-[40px]` (mobile-first: 22px base, 40px at ≥768px; note the nav/content switchpoint is 760px, not 768px — the extra 8px of padding applies to the next Tailwind breakpoint `md` for simplicity, and does not affect the 760px nav hamburger rule) |
| `Section` | `ui/Section.tsx` | `{ variant?: "standard"\|"tight"\|"hero"\|"none", tone?: "light"\|"tint"\|"dark", className?, children, id? }` — applies block padding per §2.3 and text/bg tone |
| `Button` | `ui/Button.tsx` | `{ variant?: "primary"\|"ghost"\|"gold"\|"onDark"\|"outlineDark", size?: "md"\|"lg", href?, type?, isLoading?, icon? }` — renders `<a>` when `href`, `<button>` otherwise |
| `Card` | `ui/Card.tsx` | `{ as?, tone?: "light"\|"dark"\|"transparent", interactive?: boolean, className?, children }` — `interactive` adds the hover lift |
| `IconChip` | `ui/IconChip.tsx` | `{ icon: LucideIcon \| string, tone?: "mint"\|"teal"\|"gold"\|"lilac"\|"pink", size?: "sm"\|"md"\|"lg", className? }` — 44px/52px/60px square, 10px radius, scales `1.08` when an ancestor `.group` is hovered |
| `Eyebrow` | `ui/Eyebrow.tsx` | `{ children, tone?: "light"\|"dark", className? }` — pill, 13px/600/uppercase/0.08em; `light` = mint bg + `--teal-dark` text, `dark` = translucent gold bg + gold text |
| `Reveal` | `ui/Reveal.tsx` | `{ children, index?: number, as?, className?, once?: boolean }` — `whileInView` fade + 16px slide-up, `delay = index * 0.07`, honours `useReducedMotion` |
| `SectionHeading` | `ui/SectionHeading.tsx` | `{ eyebrow?, title, subtext?, align?: "left"\|"center", tone?: "light"\|"dark", className? }` |
| `CountUp` | `ui/CountUp.tsx` | `{ to: number, prefix?, suffix?, durationMs?, className? }` — animates once in view; renders final value when reduced motion |
| `ScrollProgress` | `layout/ScrollProgress.tsx` | 2px teal→gold→leaf bar pinned under the header |
| `GradientBlobs` | `ui/GradientBlobs.tsx` | absolutely-positioned blurred radial circles + optional grain; `aria-hidden` |
| `Accordion` | `ui/Accordion.tsx` | accessible disclosure list; used by `/faq` and About values |
| `Toast` | `ui/Toast.tsx` | `{ variant: "success"\|"error", children, onDismiss? }` — `role="status"` / `role="alert"` |

### 2.6 Layout chrome

**Header** (`components/layout/Header.tsx`, client)
- Sticky `top-0 z-50`, `bg-white/80 backdrop-blur-md`, gains `border-b border-line` + stronger opacity after `scrollY > 8`.
- Left: `Logo` (36px rounded-`--radius-card` teal-gradient square, "DC" in Sora 700 white) + wordmark "Digital Chautari" (Sora 600) + tagline "Digital. Together." (Inter, 12px, `--muted`).
- Center: nav `Home / Services / Products / About / Contact`. Active = `--teal-dark` text + 6px teal underline dot beneath the label, derived from `usePathname()`.
- Right: `Button variant="primary" href="/contact"` labelled "Contact Us".
- `≤760px`: hamburger button (`aria-label="Toggle menu"`, `aria-expanded`, `aria-controls`) → animated dropdown panel. Closes on route change (`usePathname` effect), on `Escape`, and on outside click. Focus is trapped while open; body scroll locked.

**Footer** (`components/layout/Footer.tsx`, server)
- `--navy` background, 4 columns on desktop (`2 cols @ ≥761px`, `1 col mobile`): **Brand** (logo, 1-paragraph blurb, social row) · **Company** (About, Products, FAQ, Contact) · **Services** (Digital Marketing, Content Creation, Software Development, Branding & Design — all → `/services`) · **Legal** (Privacy, Terms, Accessibility — `href="#"`, marked `aria-disabled` and excluded from tab order).
- Top `border-b border-navy-border` divider, then centered `© 2026 Digital Chautari. All rights reserved.` + "Built in Kathmandu, Nepal".

### 2.7 Shared sections

| Component | File | Notes |
|---|---|---|
| `PageHero` | `sections/PageHero.tsx` | `--gradient-page-hero` wash + `GradientBlobs` top-right. Props: `{ eyebrow, title, lede, align? }`. Title renders as `string | ReactNode`; callers pass the gradient word as JSX. Lede `max-w-[720px]`. |
| `StatBar` | `sections/StatBar.tsx` | One bordered `--radius-card` card split into 3–4 equal segments with `1px` vertical dividers. Props `{ stats: { value: string \| number, label: string, suffix? }[], tone? }`. Stacks to 2×2 then 1-col on mobile. |
| `DarkBanner` | `sections/DarkBanner.tsx` | `--navy` full-bleed, `DarkBannerEyebrow` (gold) + white `h2` + optional lede. Accepts a `children` slot for stat grids. |
| `CTAPanel` | `sections/CTAPanel.tsx` | `--gradient-cta` rounded panel (`--radius-pill`→`24px`), white heading, two buttons (`primary` = white bg/teal text, `onDark` = transparent/white border). Props `{ eyebrow?, title, body?, primary { label, href }, secondary? { label, href } }` |
| `ProcessSteps` | `sections/ProcessSteps.tsx` | Dark variant: numbered chips on `--navy-card` with `--navy-border`, connecting hairline between steps on desktop. Light variant for reuse. |
| `Testimonials` | `sections/Testimonials.tsx` | 3 quote cards: 5 gold stars, `<blockquote>`, name + title/company. |
| `BlogTeaser` | `sections/BlogTeaser.tsx` | 3 cards with CSS-gradient placeholder image block (aspect 16/9), category tag, date + read time, title, excerpt, "Read more →". |
| `Timeline` | `sections/Timeline.tsx` | Centered vertical line, alternating sides on desktop, green dots, gold year pills. Single-column left-aligned ≤760px. |
| `TeamGrid` | `sections/TeamGrid.tsx` | 7 role cards with initial-avatar circles (per-role gradient) — **no invented personal names**. |
| `PricingGrid` | `sections/PricingGrid.tsx` | 3 tiers; `featured` tier is `--navy-card` with gold "Most Popular" badge, `lg:-translate-y-3 lg:scale-[1.02]`. |
| `TabbedShowcase` | `sections/TabbedShowcase.tsx` | Products tab switcher — see §5.3 for the a11y contract. |
| `MockFrame` | `sections/MockFrame.tsx` | CSS-only browser/phone chrome with fake dashboard content (no image assets). |

---

## 3. Motion & Interaction Contract

| Spec item | Implementation | Duration / curve |
|---|---|---|
| Page fade + slide | `app/template.tsx`, `motion.div` `opacity 0→1`, `y 12→0` | `0.45s` `easeOut` |
| Scroll reveal, 70ms stagger | `Reveal` — `whileInView`, `viewport={{ once: true, margin: "-60px" }}`, `delay: index * 0.07` | `0.5s` `easeOut`, `y 16→0` |
| Card hover lift | CSS `transition: transform .25s, box-shadow .25s` + `hover:-translate-y-1` | `250ms` |
| Icon chip scale | `.group:hover & .chip { transform: scale(1.08) }` | `250ms` |
| Button press | `active:scale-[0.98]` | `120ms` |
| Tab panel swap | `AnimatePresence` `mode="wait"`, `opacity 0→1` + `x ±16→0` | `0.3s` `easeOut` |
| Tab indicator | `layoutId="tab-indicator"` on the active pill | spring, `stiffness 380, damping 32` |
| Count-up | `useInView` + `requestAnimationFrame` ease-out | `1400ms` |
| Header border | `scrollY > 8` state swap | `200ms` |
| Hero blob float | 3 blobs, 8–14s alternate infinite translate/scale | `ease-in-out infinite` |
| Accordion | grid-rows `0fr→1fr` transition | `280ms` |

**Reduced motion (`prefers-reduced-motion: reduce`) is mandatory:**
1. `MotionConfig reducedMotion="user"` wraps the app in `app/layout.tsx`.
2. `globals.css` contains a `reduce` block that forces `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `transition-duration: 0.01ms`, and `scroll-behavior: auto` for `*`.
3. Every `Reveal`, `CountUp`, blob, and tab swap checks `useReducedMotion()` and renders the final/static state instead of animating.
4. The page-transition `template.tsx` renders children with no transform when reduced motion is on.

**Client/server boundary:** only these may be `"use client"` — `Header`, `MobileMenu`, `Reveal`, `CountUp`, `ScrollProgress`, `TabbedShowcase`, `ContactForm`, `ProjectTypePills`, `Accordion`, `Toast`, `PricingGrid` (billing toggle). Everything else stays a Server Component. `GradientBlobs` is pure CSS (no hooks) and stays a Server Component — do not add `"use client"` to it.

---

## 4. Content Data Model (`/data`)

All copy lives in typed TS files under `data/`. Adding an entry must be one line. **Do not hardcode page copy in JSX** — import from `/data`.

### 4.1 `data/site.ts`
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
};
```

### 4.2 `data/navigation.ts`
`{ label, href }[]` for header + footer, plus `footerColumns` (4 columns of links) — see §2.6.

### 4.3 `data/home.ts` — Section-by-section

| Export | Content |
|---|---|
| `hero` | eyebrow `"🚀 Welcome to Digital Chautari"` · title parts: plain `"We build "`, gradient-bold `"digital bridges"`, plain `" between ideas and impact"` · lede: `"A Kathmandu-based collective of marketers, storytellers, and engineers. We turn ambitious ideas into brands, content, and software that actually move people."` · primary CTA `"Explore Services"` → `/services` · secondary `"View Products"` → `/products` |
| `heroStats` | `3 Products` · `6+ Team Members` · `100% Commitment` |
| `features` (4, icon chips rotating tint) | **Growth-Driven** (TrendingUp, mint) — "Every decision traced back to a measurable outcome." · **Creative-First** (Sparkles, lilac) — "Design-led thinking on briefs, campaigns, and products." · **Tech-Powered** (Cpu, teal) — "Modern stacks, clean code, and analytics on everything." · **Client-Centric** (HeartHandshake, pink) — "Direct access to the people doing the work." |
| `whoWeAre` | heading `"A Chautari where ideas meet execution"` · 2 paragraphs (chautari meaning + what we do) · checklist 2×2: Creative Strategy, Brand Storytelling, Full-Stack Engineering, Health-Tech Expertise · CTA `"Meet the Team"` → `/about` · teaser cards 2×2: Digital Marketing (Megaphone), Content Creation (Clapperboard), Software Development (Code2), Branding & Design (Palette) |
| `statsBanner` | `250+ Projects Delivered` · `40+ Clients Served` · `1M+ Views Generated` · `98% Client Retention` |
| `productsTeaser` | heading `"Three ventures, one vision"` · lede · 3 entries (see §4.7) each with icon, category label, description, `"Learn more"` → `/products#<slug>` |
| `sectors` (6) | Healthcare (Stethoscope) · E-Commerce (ShoppingCart) · Real Estate (Building2) · Education (GraduationCap) · Tourism & Hospitality (Plane) · Media & Publishing (Radio) |
| `process` (4) | **Discover** — "Workshops, audits, and honest conversations about what you're actually trying to achieve." · **Design** — "Brand, UX, and content direction in one coherent system." · **Develop** — "Agile builds in two-week sprints with a demo at the end of each." · **Deliver** — "Launch, measure, and keep improving every month after." |
| `testimonials` (3) | See §4.9 |
| `blogPosts` (3) | See §4.10 |
| `closingCta` | `"Ready to build something extraordinary together?"` · body `"Tell us what you're working on. We'll come back within one business day with next steps."` · primary `"Start a Project"` → `/contact` · secondary `"View Services"` → `/services` |

### 4.4 `data/services.ts`
Three categories, each with `icon`, `title`, `description`, and exactly 4 sub-services (icon, title, one-line description):

1. **Digital Marketing** (`Megaphone`) — "Full-funnel acquisition across search, social, and paid." · SEO & SEM (Search) · Social Media Marketing (Share2) · Paid Advertising (MousePointerClick) · Analytics & Reporting (BarChart3)
2. **Content Creation** (`Clapperboard`) — "Original video, photography, and copy that people actually watch." · Video Production (Video) · Photography (Camera) · Copywriting (PenLine) · Graphic Design (Palette)
3. **Software Development** (`Code2`) — "Web, mobile, and health-tech products built to be maintained." · Web Applications (Globe) · Mobile Apps (Smartphone) · Health-Tech Software (HeartPulse) · API & Integrations (Plug)

`industries` (6, icon+label only, `/services#industries`): Healthcare, E-Commerce, Real Estate, Education, Tourism & Hospitality, Media & Publishing.

`whyUs` (6 checklist): Dedicated project manager · Agile development cycle · Transparent pricing · Post-launch support · Scalable architecture · Cross-platform expertise.

### 4.5 `data/pricing.ts`
```ts
export const pricing = {
  currency: "Rs",
  tiers: [
    { name: "Starter", price: "15,000", period: "/month", tagline: "For founders validating a new idea.",
      features: ["1 active campaign channel", "SEO audit + monthly reporting", "4 social posts / month", "Email support"], featured: false },
    { name: "Professional", price: "45,000", period: "/month", tagline: "Our most popular plan for growing teams.",
      features: ["Up to 3 channels, fully managed", "Content production (video + photo)", "Landing page build & CRO", "Bi-weekly strategy calls", "Priority support"], featured: true },
    { name: "Enterprise", price: "Custom", period: "", tagline: "For organisations with complex needs.",
      features: ["Dedicated squad", "Custom software development", "Full brand identity system", "SLA & 24/7 escalation", "Quarterly on-site reviews"], featured: false },
  ],
};
```
Billing toggle (extra #5): Monthly / Yearly with **−15%**; yearly shows `/year` and Rs figure ×12×0.85 rounded to nearest 500.

### 4.6 `data/products.ts`
```ts
export type Product = {
  slug: "eco-creative" | "one-content" | "physio-at-home";
  name: string; category: string; tagline: string; description: string;
  tags: string[]; stats: { label: string; value: string }[];
  cta: { label: string; href: string };
  frame: "browser" | "phone" | "browser";
};
```

| slug | name | category | tagline | tags | stats | cta | frame |
|---|---|---|---|---|---|---|---|
| `eco-creative` | Eco Creative Marketing Agency | Marketing Agency | "Sustainable marketing for brands that mean it" | SEO, Paid Social, Content, Analytics | 30+ Campaigns · 12 Industries · 4.9★ Rating | Talk to us → `/contact` | browser |
| `one-content` | One Content Creation Studio | Content Studio | "One team for every format your audience scrolls" | Video, Photo, Copy, Design | 400+ Assets Delivered · 50+ Brands · 3 Studios | Start a project → `/contact` | phone |
| `physio-at-home` | Physio@Home | Health-Tech | "Physiotherapy that comes to your living room" | Booking, Vitals, Plans, Payments | 8 Districts · 25 Physios · 4.9★ Rating | Book a session → `/contact` | browser |

Descriptions are 2–3 sentences each and mention Kathmandu/Nepal context. `data/products.ts` also exports `spotlight` for §5.3 section 3:
`{ eyebrow: "Health-Tech", title: "Physio@Home — healthcare reimagined", body: "Patients book a licensed physiotherapist, share symptoms and vitals, follow a recovery plan, and pay in-app. We built it because waiting rooms in Kathmandu are a barrier, not a formality." }`

### 4.7 `data/team.ts`
7 roles. **Roles only, no invented personal names** (use initial avatars derived from the role, e.g. Founder & CEO → "DC" for the CEO, and a 1–2 letter monogram per role):

| Role | Monogram | Focus | Gradient |
|---|---|---|---|
| Founder & CEO | FC | Vision, fundraising, partnerships | teal→gold |
| Co-Founder & COO | CO | Operations, delivery, hiring | leaf→teal |
| Front-End Developer | FE | React, Next.js, design systems | lilac→teal |
| Back-End Developer | BE | APIs, databases, infrastructure | navy→teal |
| Marketing Lead | ML | Campaigns, SEO, paid media | gold→leaf |
| Sales Executive | SE | Client relationships, pipeline | pink→gold |
| Business Development Officer | BD | Partnerships, vendor network | teal→blue |

Plus `values` (4): Passion (Flame) "We care about the outcome more than the deliverable." · Creativity (Lightbulb) "We look for the idea nobody else tried." · Excellence (Award) "Details are the product." · Collaboration (Users) "Client and agency, one team."

Plus `milestones` for the roadmap timeline:
| Year (gold pill) | Title | Body |
|---|---|---|
| 2025 | The Idea | "Digital Chautari registered. Three problems picked: marketing, content, and access to physiotherapy." |
| 2025 | First Products | "Eco Creative and One Content launched with their first five clients." |
| 2026 | Health-Tech Entry | "Physio@Home MVP shipped across Kathmandu Valley, with eight districts on the roadmap." |
| 2026 | Company Registration | "Formal company registration, expanded team, and first enterprise contracts." |

Plus `trust` (dark band, 4): ISO 9001 Ready · Data Protection (Nepal) · Global Delivery · Pan-Nepal Network.

### 4.8 `data/contact.ts`
- `infoCards` (4): Address "Kathmandu, Nepal" (MapPin, "3rd Floor, Sundhara" is fine as the street line) · Email `hello@digitalchautari.com` · Phone `+977 98XXXXXXXX` · Business Hours `site.hours` (Clock).
- `departments` (4 direct lines, each with a real-looking `mailto:`):
  | Department | Email | Note |
  |---|---|---|
  | Marketing | marketing@digitalchautari.com | Campaigns, SEO, paid media |
  | Content Studio | content@digitalchautari.com | Video, photography, copy |
  | Software Development | dev@digitalchautari.com | Web, mobile, health-tech |
  | Business Development | business@digitalchautari.com | Partnerships, proposals |
- `responseTimes` (3): Email "Within 24 hours" · Proposals "2–3 business days" · Urgent "Same business day".
- `projectTypes` (5, enum values shared with the API): `Digital Marketing`, `Content Creation`, `Software Development`, `Branding & Design`, `Other`.

### 4.9 `data/testimonials.ts`
3 entries. Attributes are clearly labelled illustrative placeholders and must not impersonate real named people — use role-based attribution, e.g. `{ quote, name, title }` with `title` like "Marketing Lead, E-Commerce Client". The user may replace these before launch; add an HTML comment noting that.

### 4.10 `data/blog.ts`
3 teaser posts. Each: `{ slug, title, excerpt, category, date (ISO), readTime, gradient: [from, to] }`.
- `"Why a chautari still beats a conference room"` — Culture — gradient teal→leaf
- `"Physiotherapy at home: what we learned from 200 sessions"` — Health-Tech — gradient navy→teal
- `"Five SEO mistakes Nepalese brands keep making"` — Digital Marketing — gradient gold→leaf

### 4.11 `data/faq.ts`
8 Q/A pairs covering: services offered, engagement length, pricing model, how to start, timeline, payment terms, post-launch support, data/privacy. Used only by `/faq`.

---

## 5. Page Contracts

### 5.1 `/` — Home (10 sections, exact order)
1. Hero (§4.3 hero + heroStats) · 2. Feature strip (4 cards) · 3. Who We Are (2-col: text + 2×2 checklist | 2×2 teaser cards) · 4. Dark stats banner (`DarkBanner` + `CountUp`) · 5. Products teaser (3 cards) · 6. Sectors (6 cards) · 7. Dark 4-step process · 8. Testimonials (3) · 9. Blog teaser (3) · 10. Closing CTA.

### 5.2 `/services` — 6 sections
1. PageHero — eyebrow `"Our Services"`, title `"Services that **drive growth**"`, lede `"From acquisition campaigns to production-ready software, Digital Chautari covers the full digital stack for businesses in Nepal and beyond."`.
2. Categories — 3 rows; left column `IconChip + h2 + description`, right 2×2 sub-service grid. Row separators via `--line`.
3. Pricing — `SectionHeading` + `PricingGrid` (Professional featured).
4. Industries — `id="industries"`, heading `"Who we work with"`, 6 compact icon+label cards.
5. Dark band — `"Why work with us"` + 6-item checklist on `--navy`.
6. Closing CTA — `"Let's find the right service for you"`, primary `"Book a Consultation"` → `/contact`.

### 5.3 `/products` — 3 sections
1. PageHero — `"Our Products"`, `"Three ventures, **one vision**"`, lede `"Each product tackles a different problem, but they share one conviction: technology should make everyday life in Nepal measurably better."`.
2. `TabbedShowcase` — `role="tablist"`, pill tabs, arrow/Home/End key navigation, `aria-selected`, `tabIndex` roving, each tab `aria-controls` its panel; panels `role="tabpanel"` + `tabIndex={0}`. **URL hash sync**: on mount and on `hashchange`, select the tab whose slug matches `#eco-creative | #one-content | #physio-at-home`; selecting a tab updates the hash via `history.replaceState` (no scroll jump). Animated panel swap via `AnimatePresence`.
3. Dark spotlight — `DarkBanner` using `products.spotlight`.

### 5.4 `/about` — 8 sections
1. PageHero — `"About Us"`, `"The people behind **Digital Chautari**"`, lede `"What started as a shared frustration with broken digital experiences in Nepal became a team of seven building brands, content, and health-tech products."`.
2. Story — heading `"From a chautari to a digital powerhouse"` + 2 paragraphs + 2×2 tiles: **2025** Founded (teal tint) · **3** Products (navy tile, white text) · **Kathmandu** HQ (white tile) · **7+** Team Members (gold tint).
3. Mission & Vision — two side-by-side `Card`s.
4. Values — 4 cards (`values`).
5. Dark band — `"Committed to quality & trust"` + 4 trust points.
6. Team roles — `TeamGrid`, 7 cards.
7. Dark roadmap — `Timeline`, 4 milestones, centered line, alternating, green dots, gold year pills.
8. Closing CTA — `"Want to join our journey?"`, primary `"Get in Touch"` → `/contact`.

### 5.5 `/contact` — 4 sections
1. PageHero — `"Contact Us"`, `"Let's start a **conversation**"`, lede `"Tell us about your project and we will get back to you within one business day with honest next steps — no sales pitch required."`.
2. Info cards — 4 `Card`s (address, email, phone, hours). Email and phone are `mailto:`/`tel:` links.
3. Direct lines — `"Reach the right team"` + 4 department cards each with a `mailto:` button.
4. Two-column block — **left**: `ContactForm`; **right**: map card (OpenStreetMap embed iframe with a `title`, `loading="lazy"`, and a styled fallback block underneath) + dark FAQ callout card (`"Need quick answers?"` → `/faq`) + response-time list.

### 5.6 `/faq` — 2 sections
PageHero (`"FAQ"`, `"Questions, **answered**"`, lede `"Everything you need to know before working with us — if your question is not here, reach out and we will get back to you within one business day."`) + `Accordion` over `data/faq.ts` + closing CTA panel.

### 5.7 `not-found.tsx`
Branded: gradient 404 numerals, lede, two buttons (`Back to Home` → `/`, `Contact Us` → `/contact`).

---

## 6. Backend Contract

### 6.1 `lib/schema.ts`
```ts
import { z } from "zod";
export const projectTypes = ["Digital Marketing","Content Creation","Software Development","Branding & Design","Other"] as const;
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  subject: z.string().trim().min(3, "Please add a short subject.").max(120, "Subject must be 120 characters or fewer."),
  projectType: z.enum(projectTypes, { errorMap: () => ({ message: "Choose a project type." }) }),
  message: z.string().trim().min(10, "Tell us a little more — at least 10 characters.").max(2000, "Message must be 2000 characters or fewer."),
  website: z.string().max(0).optional(),          // honeypot: must stay empty
});
export type ContactInput = z.infer<typeof contactSchema>;
```
`ContactInput` is derived from that schema with `z.infer`. The client form uses `useForm<ContactInput>({ resolver: zodResolver(contactSchema) })` — one schema, both sides, so client and server validation can never diverge.

### 6.2 `lib/rateLimit.ts`
Token-bucket / fixed-window in-memory `Map<string, { count: number; resetAt: number }>`, 5 requests / 10 minutes per IP. Document the Vercel caveat (instance-local, not distributed) in a code comment, and note Upstash Redis as the upgrade path.

### 6.3 `app/api/contact/route.ts`
```
POST /api/contact  →  200 { ok: true } | 400 { ok: false, error: string, issues?: {field,message}[] }
                    | 429 { ok: false, error: "Too many requests..." } | 500 { ok: false, error: "..." }
```
Flow, in order:
1. `export const runtime = "nodejs"`.
2. Guard non-JSON/unparseable body → 400.
3. `contactSchema.safeParse` → on failure 400 with per-field `issues`.
4. Honeypot: if `website` is non-empty → **return 200 `{ ok: true }` silently** (never tell a bot it was caught).
5. Rate limit by `request.headers.get("x-forwarded-for")?.split(",")[0]` → 429 on exceed, with `Retry-After`.
6. Send email via Resend if `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set. `from` = `onboarding@resend.dev` (or `RESEND_FROM_EMAIL` when present), `to` = `CONTACT_TO_EMAIL`, `replyTo` = submitter email, subject `"[Digital Chautari] ${subject} — ${name}"`, HTML body escaping all user input.
7. If env vars are absent: log the submission server-side and still return 200 so local/demo deployments don't break. Note this in the README.
8. Never leak stack traces or the API key in responses. `console.error` server-side only.

Also provide `GET /api/health` → `{ ok: true, uptime }`, and **optionally** `GET /api/blog` returning `blogPosts` (mark optional in the phase file so it can't block Phase 7).

### 6.4 `components/forms/ContactForm.tsx` (client)
Fields in order: Name, Email, Subject, Project Type (`ProjectTypePills` — single-select pills, `role="radio"` inside `role="radiogroup"`, or buttons with `aria-pressed`; keyboard arrow navigable), Message (`<textarea rows={6}>` with a live character counter that turns `--gold` at 1800 and `--muted` danger past 2000), hidden honeypot input `name="website"` positioned off-screen but not `display:none`, submit `Button isLoading`.

States: pristine → invalid (inline `aria-describedby` errors, `aria-invalid`, red `#B42318` text, `role="alert"` summary) → submitting (spinner in button, `aria-busy`) → success (replaces the form with a `role="status"` card: "Thanks — we'll reply within 24 hours." + a "Send another message" button that resets the form) → error (`Toast variant="error"` with the server message). A client-side honeypot-filled submit short-circuits to the success state without a network call.

### 6.5 Env vars (`.env.local`, gitignored; `.env.example` committed)
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 7. Project Structure (authoritative)

```
digital-chautari/
├─ app/
│  ├─ layout.tsx              fonts, MotionConfig, Header/Footer, skip-link, metadata
│  ├─ template.tsx            page fade+slide transition
│  ├─ page.tsx                Home
│  ├─ globals.css             tokens, @theme inline, base styles, reduced-motion block
│  ├─ not-found.tsx
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg
│  ├─ services/page.tsx  products/page.tsx  about/page.tsx  contact/page.tsx  faq/page.tsx
│  └─ api/contact/route.ts  api/health/route.ts
├─ components/
│  ├─ ui/         Container, Section, Button, Card, IconChip, Eyebrow, Reveal, SectionHeading, CountUp, GradientBlobs, Accordion, Toast, cn helpers
│  ├─ layout/     Header, Footer, Logo, MobileMenu, ScrollProgress
│  ├─ sections/   PageHero, StatBar, DarkBanner, CTAPanel, ProcessSteps, Testimonials, BlogTeaser, Timeline, TeamGrid, PricingGrid, TabbedShowcase, MockFrame
│  └─ forms/      ContactForm, ProjectTypePills
├─ data/          site, navigation, home, services, pricing, products, team, testimonials, blog, faq, contact
├─ lib/           schema.ts, rateLimit.ts, cn.ts, email.ts
├─ public/        (favicon + og only — no photos; all imagery is CSS gradients)
├─ docs/          SPEC.md, QA_CHECKLIST.md, ASSETS.md, phases/*
└─ .env.example
```

---

## 8. SEO, Accessibility, Performance Requirements

**Metadata** — every page exports a `metadata` object: `title` (template `"%s · Digital Chautari"` from the root layout), `description` (≤160 chars), `openGraph` (title/description/url/type/siteName), `twitter: { card: "summary_large_image" }`. `app/sitemap.ts` lists all 7 routes. `app/robots.ts` allows all, points at the sitemap, disallows `/api/`. `app/opengraph-image.tsx` uses `next/og` `ImageResponse` with the Sora gradient wordmark (1200×630). For fonts in `ImageResponse`, load Sora from a local file via `fetch(new URL("../fonts/Sora-Bold.woff2", import.meta.url))` or use the `font` option — if the font file is not bundled, fall back to a system sans-serif and note the limitation in a code comment. Root layout injects `Organization` + `LocalBusiness` JSON-LD via a `<script type="application/ld+json">`.

**Per-page SEO descriptions (≤160 chars each):**
| Route | `description` |
|---|---|
| `/` | "Digital Chautari is a Kathmandu-based digital agency building brands, content, and software that drive measurable growth." |
| `/services` | "Full-stack digital services — SEO, social media, content production, software development, and branding — from Kathmandu to the world." |
| `/products` | "Three Digital Chautari ventures: Eco Creative marketing, One Content studio, and Physio@Home health-tech." |
| `/about` | "Meet the team behind Digital Chautari — a seven-member Kathmandu agency turning ideas into brands, content, and software." |
| `/contact` | "Get in touch with Digital Chautari — Kathmandu digital agency. We reply within one business day." |
| `/faq` | "Frequently asked questions about working with Digital Chautari — timelines, pricing, support, and data privacy." |

**Accessibility (hard)**
- Landmarks: exactly one `<header>`, one `<main>`, one `<footer>`; `<nav aria-label="Primary">`; skip-to-content link as the first focusable element, visible on focus.
- One `<h1>` per page; no heading-level skips.
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal` on every interactive element. Never `outline: none` without a replacement.
- All form inputs have a visible `<label>` (not placeholder-only) and `aria-describedby` for errors/hints.
- Tabs, menu, accordion follow §5.3 / §2.6 ARIA contracts.
- Text contrast ≥ 4.5:1 (3:1 for ≥24px). Gold only per §2.1.
- `prefers-reduced-motion` fully honoured per §3.
- All decorative blobs/glows `aria-hidden="true"`.

**Performance**
- Server Components by default; the client-component allowlist is exactly §3's list.
- `next/font` for both families with `display: "swap"`.
- No images above 30 KB; the site uses **zero** raster images (all visuals are CSS gradients, lucide icons, and `next/og` output).
- Bundle budget: framer-motion + lucide + react-hook-form/zod are the only runtime deps. No date libraries, no icon sets, no charting libs.
- Targets: Lighthouse **≥95** in Performance, Accessibility, Best Practices, SEO — on both mobile and desktop.
- No console errors or warnings in dev or production.

---

## 9. Responsive Matrix

| Width | Behaviour |
|---|---|
| `≥1280px` | 1120px container centred; 3–4 col grids; full nav |
| `1024–1279px` | Same as above |
| `1024–760px` (i.e. `761–1023px`) | 4-col → 2-col, 3-col → 2-col; nav stays inline; container padding 40px |
| `≤760px` | 22px padding; hamburger nav + dropdown; all grids single-column; `StatBar` stacks 2×2 then 1-col; `Timeline` single-sided; pricing cards stacked (featured first is acceptable); `h1` 36px, `h2` 28px; tap targets ≥44px |
| `360px` | No horizontal scroll anywhere. Verify explicitly. |

---

## 10. Quality Gates (must pass before a phase is "done")

```bash
npm run lint        # zero errors (warnings tolerated but should be zero)
npm run typecheck   # tsc --noEmit, zero errors
npm run build       # production build succeeds
```

Plus per-phase manual gates listed in the phase files. Final gate: `docs/QA_CHECKLIST.md` fully ticked, production contact-form email received, Lighthouse ≥95 on mobile **and** desktop, axe clean.

---

## 11. Definition of Done (per phase)

A phase is done only when:
1. Every file it lists exists with the contracted props/exported names from this spec.
2. Its `npm run lint`, `npm run typecheck`, and `npm run build` gates pass.
3. Its manual verification list has been actually performed (with what was observed written down).
4. Any content it introduces exists in `/data` with types — not inline in JSX.
5. Reduced-motion and keyboard paths work for anything interactive it added.
6. The phase is committed with a message matching the repo's `Phase N: <summary>` convention.
