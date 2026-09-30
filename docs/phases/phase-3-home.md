# Phase 3 — Home Page

**Goal:** Ship the ten-section home page in the exact order and visual language defined by SPEC §5.1.
**Depends on:** Phase 1 (shared shell, tokens, primitives, motion contracts) and Phase 2 (shared layout/data foundations, if present)
**Estimate:** 4–5h
**Ships:**
- A complete `/` route with all 10 sections in the canonical order.
- Typed home copy in `data/home.ts`, with no page copy hardcoded in JSX.
- Responsive layouts for desktop, tablet, the 760px navigation boundary, and 360px.
- Scroll reveals, card hover states, count-up stats, and reduced-motion-safe behavior.
- Page metadata and the manual QA evidence required for this phase.

---

## Scope

**In scope**
- Home page sections 1–10 from SPEC §5.1.
- `data/home.ts` exports and exact copy supplied by SPEC §4.3.
- Home page metadata export.
- CSS-only visual treatment for the blog image placeholders.
- Responsive and accessibility checks specific to the home page.

**Out of scope (later phases)**
- Products detail and tabbed showcase — Phase 5.
- About page — Phase 6.
- Contact form, API, and contact page — Phase 7.
- Global chrome, tokens, and primitive implementation — Phase 1.
- Any testimonial or blog data not supplied by SPEC — resolve before the owning data/page phase.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `app/page.tsx` | Server-rendered Home route containing the 10 sections | `metadata`; `default` page export |
| `data/home.ts` | Typed Home content source | `hero`, `heroStats`, `features`, `whoWeAre`, `statsBanner`, `productsTeaser`, `sectors`, `process`, `testimonials`, `blogPosts`, `closingCta` |

## Files to modify

| Path | Change |
|---|---|
| None required by this phase | Use existing Phase 1 primitives and shared sections. If a missing shared prop contract blocks the page, reconcile it against `SPEC.md` before changing the primitive. |

## Step-by-step

1. Add the typed `data/home.ts` exports using the literal strings and Lucide icon names in SPEC §4.3; do not place copy literals in `app/page.tsx`.
2. Add the Home `metadata` export using title `"Home"`, the exact site description from SPEC §4.1, the site URL, `type: "website"`, `siteName: "Digital Chautari"`, and `twitter.card: "summary_large_image"`.
3. Build the ten sections in the exact order below, using `Container`, `Section`, `Reveal`, and the contracted shared sections.
4. Apply the responsive matrix at `≥1024px`, `761–1023px`, `≤760px`, and explicitly verify `360px`; use the custom 760px boundary rather than replacing it with `md`.
5. Add the home-specific acceptance checks below, including the contrast checks and reduced-motion path.
6. Run the verification commands and record the manual QA observations before committing.

## Section-by-section build plan

### Section 1 — Hero  (`app/page.tsx:hero region`)
- **Component:** `Section variant="hero" tone="tint"` containing `PageHero` and `StatBar`; the title must be passed as JSX because the gradient word is a `ReactNode`.
- **Component call:** `<PageHero eyebrow={hero.eyebrow} title={<>...</>} lede={hero.lede} />`; `<StatBar stats={heroStats} />` inside/below the hero section as one three-segment card.
- **Copy:** eyebrow `"🚀 Welcome to Digital Chautari"`; lede `"A Kathmandu-based collective of marketers, storytellers, and engineers. We turn ambitious ideas into brands, content, and software that actually move people."`; primary CTA `"Explore Services"` → `/services`; secondary CTA `"View Products"` → `/products`.
- **H1 JSX:**
  ```tsx
  <h1>
    <span>We build </span>
    <strong className="gradient-text">digital bridges</strong>
    <span> between ideas and impact</span>
  </h1>
  ```
  The plain text and gradient-bold split must remain exactly as shown; do not make the whole heading gradient.
- **Layout:** at `≥1024px`, the hero content is a single readable text column with the CTA row followed by the three equal `StatBar` segments; at `761–1023px`, keep the content one column and keep the stat bar three segments; at `≤760px`, use the 760px container rule, stack the CTA buttons, and allow `StatBar` to follow its contract (2×2, then 1 column at the narrowest width). Hero padding is `84px` top and `48px` bottom.
- **Motion:** wrap eyebrow, H1, lede, CTA row, and `StatBar` in `Reveal index={0}`, `{1}`, `{2}`, `{3}`, and `{4}` respectively: delays `0ms`, `70ms`, `140ms`, `210ms`, `280ms`. Buttons use the contracted `120ms` press scale; hero blobs use the global reduced-motion-safe contract.
- **Acceptance:** the rendered H1 has exactly the three text spans above; `digital bridges` is bold and `.gradient-text`; both links have the exact hrefs; the stat bar is one bordered card with exactly three segments and the three literal stats; no text or card overflows at 360px.

### Section 2 — Feature strip  (`app/page.tsx:feature strip region`)
- **Component:** `Section variant="standard" tone="light"` with four `Card interactive` items, each containing an `IconChip` and text.
- **Component call:** `Card interactive` + `IconChip icon={feature.icon} tone={feature.tone}` for each entry in `features`; the exact `Card` data prop is not named in SPEC, so keep the page data mapping local without inventing a public primitive prop.
- **Copy:** **Growth-Driven** — `"Every decision traced back to a measurable outcome."`; **Creative-First** — `"Design-led thinking on briefs, campaigns, and products."`; **Tech-Powered** — `"Modern stacks, clean code, and analytics on everything."`; **Client-Centric** — `"Direct access to the people doing the work."`.
- **Layout:** `≥1024px` four columns with `gap-5`; `761–1023px` two columns; `≤760px` one column. Use `22px` card padding and standard `64px` section padding; at 760px, the container switches to the custom 22px mobile padding rule.
- **Motion:** cards receive `Reveal index={0}`, `{1}`, `{2}`, `{3}` with delays `0ms`, `70ms`, `140ms`, `210ms`. Each card is a `group` so its chip scales to `1.08` on hover; interactive cards lift `4px` and show `--shadow-hover` for `250ms`.
- **Acceptance:** four cards render in the data order; icon tones are mint, lilac, teal, and pink respectively; at 761px there are two columns and at 760px there is one; hover produces the specified lift/shadow without changing layout.

### Section 3 — Who We Are  (`app/page.tsx:who-we-are region`)
- **Component:** `Section variant="standard" tone="light"`, a two-column text/checklist block, and a 2×2 teaser-card grid.
- **Component call:** `SectionHeading title={whoWeAre.heading}`; `IconChip` check icons beside the checklist entries; `Button variant="primary" href={whoWeAre.cta.href}`; four `Card interactive` teaser cards with `IconChip`.
- **Copy:** heading `"A Chautari where ideas meet execution"`; include the two `whoWeAre` paragraphs exactly as supplied in the resolved data source; checklist labels `Creative Strategy`, `Brand Storytelling`, `Full-Stack Engineering`, `Health-Tech Expertise`; CTA `"Meet the Team"` → `/about`; teaser labels `Digital Marketing`, `Content Creation`, `Software Development`, `Branding & Design`, with icons `Megaphone`, `Clapperboard`, `Code2`, `Palette`.
- **Layout:** at `≥1024px`, the upper block is a two-column split: text on the left and a 2×2 checklist on the right; the 2×2 teaser cards sit below in four columns or a 2×2 arrangement within the content width, using `gap-5`. At `761–1023px`, keep the upper two-column split if it remains readable and use a 2×2 teaser grid. At `≤760px`, stack text above checklist, then use one teaser card per row. All cards use `22px` padding.
- **Motion:** `SectionHeading`/copy `Reveal index={0}`, checklist `Reveal index={1}`, CTA `Reveal index={2}`, then teaser cards `Reveal index={3}`, `{4}`, `{5}`, `{6}`: delays `0ms`, `70ms`, `140ms`, `210ms`, `280ms`, `350ms`, `420ms`. Checklist check icons are teal and decorative only; the text remains selectable body text.
- **IconChip tones:** SPEC §4.3 names the four teaser icons but does not actually assign their tones. Do not invent a new token or hex value. The implementation must use the reconciled per-card mapping; if the intended positional mapping is confirmed, use mint for Digital Marketing, lilac for Content Creation, teal for Software Development, and pink for Branding & Design. This is an explicit SPEC ambiguity to resolve before implementation.
- **Acceptance:** the upper content is a two-column split on desktop; the checklist is exactly 2×2 with teal check icons; the teaser set is exactly 2×2 before the mobile collapse; the CTA has the exact label and href; no teaser tone is silently guessed if the mapping remains unresolved.

### Section 4 — Dark stats banner  (`app/page.tsx:stats banner region`)
- **Component:** `DarkBanner` with a stat-grid children slot; each value is a `CountUp`.
- **Component call:** `<DarkBanner>...</DarkBanner>` with `CountUp` values `to={250} suffix="+"`, `to={40} suffix="+"`, `to={1} suffix="M+"`, and `to={98} suffix="%"`; labels `Projects Delivered`, `Clients Served`, `Views Generated`, `Client Retention`.
- **Copy:** `250+ Projects Delivered`; `40+ Clients Served`; `1M+ Views Generated`; `98% Client Retention`.
- **Formatting contract:** `CountUp` is defined in SPEC §2.5 as `{ to: number, prefix?, suffix?, durationMs?, className? }`, so it supports the non-integer-friendly display by keeping `to` numeric and rendering the suffix. `250+` is `to={250} suffix="+"`; `1M+` is `to={1} suffix="M+"`; `98%` is `to={98} suffix="%"`. Do not pass `"1M+"` as `to`. If the Phase 1 implementation ignores `suffix` or formats only a bare integer, fix that contract before marking this phase done; the page must not duplicate suffixes in labels.
- **Layout:** `≥1024px` four equal stat columns; `761–1023px` two columns; `≤760px` use the StatBar-like 2×2 then one-column behavior if required by available width. The band is full-bleed with the content inside `Container`; dark text is white or the contracted dark-section color.
- **Motion:** stat cells receive `Reveal index={0}`, `{1}`, `{2}`, `{3}` with `0ms`, `70ms`, `140ms`, `210ms`; each `CountUp` runs once in view for `1400ms` and renders its final value immediately under reduced motion.
- **Acceptance:** the banner background is `--navy`; all four final strings display exactly as `250+`, `40+`, `1M+`, and `98%`; values do not flash as `undefined`, `NaN`, or duplicate suffixes; count-up is disabled/final under reduced motion.

### Section 5 — Products teaser  (`app/page.tsx:products teaser region`)
- **Component:** `Section variant="standard"` with a `SectionHeading` and three interactive product cards.
- **Component call:** `SectionHeading title={productsTeaser.heading} subtext={productsTeaser.lede}` plus three `Card interactive` items from `productsTeaser.entries`; the exact public prop name for the entries is not defined by SPEC.
- **Copy:** heading `"Three ventures, one vision"`; use the exact `productsTeaser` lede once reconciled; each of the three entries uses its §4.6 icon, category label, description, and `"Learn more"` → `/products#<slug>`.
- **Layout:** `≥1024px` three columns with `gap-5`; `761–1023px` two columns with the third wrapped; `≤760px` one column. Cards use `22px` padding and their icon chip remains above the text.
- **Motion:** heading `Reveal index={0}` (`0ms`), cards `Reveal index={1}`, `{2}`, `{3}` (`70ms`, `140ms`, `210ms`). Cards lift `4px` on hover and links retain a visible focus ring.
- **Acceptance:** exactly three cards appear; every `Learn more` href includes the correct product slug; the heading is literal; no product description is invented in JSX. SPEC §4.3 points to “§4.7” for these entries, but the product entries actually live in §4.6; resolve that cross-reference before final data review.

### Section 6 — Sectors  (`app/page.tsx:sectors region`)
- **Component:** `Section variant="tight"` with a `SectionHeading` and six compact interactive cards.
- **Component call:** `IconChip icon={sector.icon}` and `Card interactive` for each `sectors` entry.
- **Copy:** `Healthcare`, `E-Commerce`, `Real Estate`, `Education`, `Tourism & Hospitality`, `Media & Publishing`; icons `Stethoscope`, `ShoppingCart`, `Building2`, `GraduationCap`, `Plane`, `Radio`.
- **Layout:** `≥1024px` three columns; `761–1023px` two columns; `≤760px` one column. Use `gap-5`, 22px card padding, and the custom `max-[759px]` collapse behavior rather than assuming 768px.
- **Motion:** cards use `Reveal index={0}` through `{5}`, yielding `0ms` through `350ms` in `70ms` increments.
- **Acceptance:** all six labels and exact icons render in data order; the grid is 3×2 on desktop, 2 columns at 761–1023px, and one column at 760px; each card has a 44px-or-larger interactive target where applicable.

### Section 7 — Process  (`app/page.tsx:process region`)
- **Component:** `ProcessSteps` with the dark variant, using `--navy-card` step cards and `--navy-border` borders.
- **Component call:** `ProcessSteps` `variant="dark"` with the four `process` entries; the SPEC names the dark variant but does not define the data prop name, so do not add a new prop contract without reconciling the shared component.
- **Copy:** **Discover** — `"Workshops, audits, and honest conversations about what you're actually trying to achieve."`; **Design** — `"Brand, UX, and content direction in one coherent system."`; **Develop** — `"Agile builds in two-week sprints with a demo at the end of each."`; **Deliver** — `"Launch, measure, and keep improving every month after."`.
- **Layout:** `≥1024px` four columns with numbered chips and a connecting hairline between cards; the hairline is desktop-only. `761–1023px` use two columns and no desktop connecting hairline unless it can remain semantically and visually between the row groups. `≤760px` stack one column, keep the numbered chips, and hide the connecting hairline.
- **Motion:** steps use `Reveal index={0}` through `{3}` (`0ms`, `70ms`, `140ms`, `210ms`); the number chips are static and remain visible when motion is reduced.
- **Acceptance:** the section is dark; every card surface is `--navy-card` with a `--navy-border` border; steps are numbered 1–4 in order; the connecting hairline is absent at 760px and below; no body copy uses gold on the dark card.

### Section 8 — Testimonials  (`app/page.tsx:testimonials region`)
- **Component:** `Testimonials` with the three typed entries from `data/home.ts` / the canonical testimonial data.
- **Component call:** `Testimonials` with the three entries; SPEC defines the component and its 3-card content contract but does not define its data prop name.
- **Copy:** use the exact three entries from SPEC §4.9 once supplied, including role-based attribution such as `"Marketing Lead, E-Commerce Client"`; do not invent named people. Each card contains five gold stars, a `<blockquote>`, name, and title/company.
- **Layout:** `≥1024px` three columns; `761–1023px` two columns with one wrapped; `≤760px` one column. Cards are flat at rest, have `22px` padding, and use `--line` borders.
- **Motion:** heading `Reveal index={0}` (`0ms`), cards `Reveal index={1}`, `{2}`, `{3}` (`70ms`, `140ms`, `210ms`).
- **Acceptance:** exactly three quote cards render, each has five decorative gold stars and a semantic blockquote; attribution is role-based and not a fabricated named testimonial; missing §4.9 literal copy is resolved before this section is considered complete.

### Section 9 — Blog teaser  (`app/page.tsx:blog teaser region`)
- **Component:** `BlogTeaser` with three entries from `blogPosts`.
- **Component call:** `BlogTeaser` with the three `blogPosts` entries; SPEC defines the section content but not the public data prop name.
- **Copy:** titles and categories: `"Why a chautari still beats a conference room"` — `Culture`; `"Physiotherapy at home: what we learned from 200 sessions"` — `Health-Tech`; `"Five SEO mistakes Nepalese brands keep making"` — `Digital Marketing`. Include each exact date, read time, and excerpt only after the missing §4.10 fields are reconciled. The link label is exactly `"Read more →"`.
- **Layout:** `≥1024px` three columns; `761–1023px` two columns; `≤760px` one column. Each card begins with a CSS-gradient placeholder image block at `aspect-ratio: 16 / 9`; no raster or remote image asset is introduced.
- **Motion:** cards use `Reveal index={0}`, `{1}`, `{2}` with `0ms`, `70ms`, `140ms`; cards use the standard 4px lift and shadow on hover.
- **Interaction:** `Read more →` is a non-navigating placeholder in this phase (use the documented placeholder behavior, not a fabricated blog route); it must still be keyboard-focusable only if implemented as an interactive control, with a visible focus ring.
- **Acceptance:** all three gradients are CSS-only; image blocks are exactly 16:9; no `<img>` or `next/image` is added; read-more links do not navigate; all available title/category literals match SPEC exactly.

### Section 10 — Closing CTA  (`app/page.tsx:closing CTA region`)
- **Component:** `CTAPanel` in the final `Section variant="standard"`.
- **Component call:** `<CTAPanel title={closingCta.title} body={closingCta.body} primary={closingCta.primary} secondary={closingCta.secondary} />`.
- **Copy:** title `"Ready to build something extraordinary together?"`; body `"Tell us what you're working on. We'll come back within one business day with next steps."`; primary `"Start a Project"` → `/contact`; secondary `"View Services"` → `/services`.
- **Layout:** panel is contained within the 1120px container, with the contracted `--gradient-cta`, rounded panel, and two-button row at `≥1024px`; `761–1023px` keeps the row if both buttons remain at least 44px high; `≤760px` stacks buttons full-width or to the available content width. Keep the panel inside the 22px mobile container at 760px.
- **Motion:** panel content uses `Reveal index={0}` (`0ms`), primary CTA `Reveal index={1}` (`70ms`), and secondary CTA `Reveal index={2}` (`140ms`); buttons use the 120ms press contract.
- **Acceptance:** both button labels and hrefs are exact; the panel uses the CTA gradient rather than a new color; the buttons remain keyboard reachable and visibly focused at 360px.

## Data to add

| Export in `data/home.ts` | Shape | Source |
|---|---|---|
| `hero` | `{ eyebrow, titleParts: { plainBefore, gradientBold, plainAfter }, lede, primary: { label, href }, secondary: { label, href } }` | SPEC §4.3: exact hero strings and hrefs |
| `heroStats` | Three `{ value, label }` entries: `3 Products`, `6+ Team Members`, `100% Commitment` | SPEC §4.3 |
| `features` | Four `{ icon, title, description, tone }` entries | SPEC §4.3; tones: mint, lilac, teal, pink in listed order |
| `whoWeAre` | `{ heading, paragraphs, checklist, cta, teasers }` | SPEC §4.3; paragraph literals are not printed in the current SPEC and must be supplied before finalization |
| `statsBanner` | Four `{ value, label }` entries: `250+ Projects Delivered`, `40+ Clients Served`, `1M+ Views Generated`, `98% Client Retention` | SPEC §4.3 |
| `productsTeaser` | `{ heading, lede, entries }`, with three §4.6 product entries and `Learn more` links | SPEC §4.3 cross-reference is inconsistent; product entries are in §4.6 and lede is not supplied |
| `sectors` | Six `{ icon, label }` entries | SPEC §4.3 |
| `process` | Four `{ title, description }` entries | SPEC §4.3 |
| `testimonials` | Three role-attributed testimonial entries | SPEC §4.9, but the literal entries are missing |
| `blogPosts` | Three `{ slug, title, excerpt, category, date, readTime, gradient }` entries | SPEC §4.10; only titles, categories, and gradient directions are supplied |
| `closingCta` | `{ title, body, primary, secondary }` | SPEC §4.3 |

## Acceptance criteria

**Functional**
- [ ] `/` renders exactly 10 sections in the order Hero, Feature strip, Who We Are, Dark stats banner, Products teaser, Sectors, Process, Testimonials, Blog teaser, Closing CTA.
- [ ] All CTA labels and hrefs match SPEC; the three product teaser links use `/products#<slug>`.
- [ ] Count-up values finish as `250+`, `40+`, `1M+`, and `98%`, and remain static under reduced motion.
- [ ] Blog `Read more →` controls do not navigate during this phase.

**Design fidelity**
- [ ] Tokens are used instead of new hex values; `--navy`, `--navy-card`, `--navy-border`, `--line`, and the specified gradients appear in their contracted roles.
- [ ] Cards are flat at rest and lift 4px with `--shadow-hover` for 250ms on hover.
- [ ] The 760px behavior is explicit: nav/grid collapse rules use the custom 760px boundary, not a 768px substitute.
- [ ] At least one contrast check is recorded: `--ink` on `--paper` and `--muted` on `--paper` must be ≥4.5:1 for body text; large text/UI borders must be ≥3:1. White text on `--navy` must also be checked before sign-off.

**Accessibility**
- [ ] The page has exactly one H1, the three required H1 spans, semantic section landmarks where applicable, and keyboard-visible focus rings.
- [ ] Decorative stars, blobs, and gradient image blocks are `aria-hidden="true"`; testimonial quotes use `<blockquote>`.
- [ ] `Reveal`, `CountUp`, and blob motion honor `prefers-reduced-motion: reduce`.
- [ ] Interactive cards and CTA controls have tap targets of at least 44px at `≤760px`.

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

- [ ] Check the whole scroll: exactly 10 sections, correct order, and no missing section heading/content.
- [ ] Check vertical rhythm against `standard`, `tight`, and `hero` padding; no section collapses into an unintended overlap.
- [ ] At `≥1024px`, verify four-column feature/sectors/process patterns and three-column product/testimonial/blog patterns.
- [ ] At `761–1023px`, verify the documented 4→2 and 3→2 grid changes while the nav remains inline.
- [ ] At `760px` and below, verify 22px container padding, stacked grids, stacked CTA buttons, and hamburger navigation supplied by the shared shell.
- [ ] At 360px, verify no horizontal scroll anywhere, including the H1, stat banner, CTA panel, and blog placeholders.
- [ ] Confirm reveal stagger is visible top-to-bottom and that reduced motion shows final/static states.
- [ ] Confirm card hover lift/shadow, icon-chip scale, button press, and focus rings.
- [ ] Record the contrast-ratio results for `--ink`/`--paper`, `--muted`/`--paper`, and white/`--navy`.

## Commit

`git commit -m "Phase 3: Home page"`
