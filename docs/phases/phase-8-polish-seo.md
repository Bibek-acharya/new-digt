# Phase 8 — Motion, Responsive, Accessibility, SEO & Performance Polish

**Goal:** Verify and polish every route against the canonical motion, responsive, accessibility, SEO, and Lighthouse contracts without changing the approved content or token values.
**Depends on:** Phase 7
**Estimate:** 5–7h
**Ships:**
- Every route behaves consistently at 360px, the 760px navigation switch, tablet widths, and desktop widths.
- Reduced-motion users receive static equivalents for every animation and interaction.
- Metadata, structured data, robots, sitemap, OG image, keyboard behavior, console cleanliness, and Lighthouse targets are verified.

---

## Scope

**In scope**
- A top-to-bottom motion audit, optional-extra triage, SEO implementation/audit, accessibility sweep, responsive sweep, performance audit, and console-error sweep.
- The files needed for sitemap, robots, OG image, and root JSON-LD if they are not already present.
- Observable evidence for Lighthouse, axe, keyboard, reduced-motion, and narrow-screen checks.

**Out of scope (later phases)**
- Deployment-specific verification, production inbox delivery, and Vercel rollback — Phase 9.
- New product features, new imagery, or changes to the approved copy and design tokens.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `app/sitemap.ts` | Seven-route sitemap. | default `sitemap` function |
| `app/robots.ts` | Allow all, disallow `/api/`, point to sitemap. | default `robots` function |
| `app/opengraph-image.tsx` | Dynamic 1200×630 OG image. | default `ImageResponse` function |

## Files to modify

| Path | Change |
|---|---|
| `app/layout.tsx` | Confirm title template, fonts, `MotionConfig`, skip link, landmarks, and Organization/LocalBusiness JSON-LD. |
| `app/template.tsx` | Confirm reduced-motion-safe page fade and slide. |
| `app/globals.css` | Confirm exact tokens, 760px custom breakpoint, focus ring, and reduced-motion block. |
| `app/page.tsx`, `app/services/page.tsx`, `app/products/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/faq/page.tsx`, `app/not-found.tsx` | Complete metadata and run the route-by-route motion, heading, responsive, and console audit. |
| `components/layout/Header.tsx`, `components/layout/MobileMenu.tsx` | Verify scroll state, menu focus trap, Escape/outside-close, and reduced motion. |
| `components/ui/Reveal.tsx`, `CountUp.tsx`, `GradientBlobs.tsx`, `Accordion.tsx`, `Toast.tsx`, `components/sections/TabbedShowcase.tsx`, `components/sections/PricingGrid.tsx`, `components/layout/ScrollProgress.tsx` | Verify allowlist, animation contract, keyboard behavior, and static fallback. |

## Step-by-step

1. Run the motion audit below with DevTools `prefers-reduced-motion: reduce` enabled and disabled; record failures before editing.
2. Verify each client component against the exact §3 allowlist. Remove accidental client boundaries from server components.
3. Add or correct `app/sitemap.ts`, `app/robots.ts`, and `app/opengraph-image.tsx`; confirm all seven routes have metadata.
4. Add root Organization and LocalBusiness JSON-LD using values from `data/site.ts`, not duplicate inline business copy.
5. Complete the accessibility keyboard matrix, contrast checks, skip-link check, and axe pass at every route.
6. Test the full responsive matrix, including explicit 360px no-horizontal-scroll and the 760px navigation transition.
7. Check bundle composition, raster-image count, font loading, console output, and Lighthouse mobile/desktop scores.
8. Mark each optional extra as shipped or cut using the ranking below. Do not let an extra reduce Lighthouse below 95.

## Implementation detail

### Motion audit checklist

Walk from the header to the footer on every route. For each item, verify the normal animation and then the exact static reduced-motion fallback.

| Element | Normal animation | Duration / delay | Reduced-motion fallback |
|---|---|---|---|
| Page transition (`app/template.tsx`) | `motion.div` opacity `0→1`, `y: 12→0` | `0.45s`, `easeOut` | Children render at opacity 1 and `y: 0`; no transform. |
| Header border state | `scrollY > 8` swaps border and stronger opacity | `200ms` | Immediate state swap; no transition. |
| PageHero blobs | Three blurred radial blobs float/scale | 8–14s, alternate infinite, `ease-in-out` | Static positioned blobs, or no blob animation; `aria-hidden="true"`. |
| PageHero content / section content | `Reveal` opacity and `y: 16→0` while in view | `0.5s`, `easeOut`, `delay = index * 0.07`; viewport margin `-60px` | Content is immediately visible with no transform. |
| Icon chips | Group-hover scale `1→1.08` | `250ms` | No scale; retain the static chip. |
| Buttons | Active press scale `0.98→1` | `120ms` | No scale; keep focus/pressed feedback. |
| Card hover | `translateY(-4px)` plus `--shadow-hover` | `250ms` ease | Flat static card; no lift or shadow transition. |
| Product tabs | `AnimatePresence`, panel opacity and `x: ±16→0` | `0.3s`, `easeOut`, `mode="wait"` | Replace panel immediately, no opacity or transform. |
| Tab indicator | Active pill `layoutId="tab-indicator"` spring | stiffness 380, damping 32 | Indicator is placed directly under active tab. |
| Home stats / any `CountUp` | In-view `requestAnimationFrame` ease-out to final number | `1400ms` | Render final value immediately. |
| Accordion | Grid rows `0fr→1fr` | `280ms` | Expanded/collapsed state changes immediately, with correct `aria-expanded`. |
| Toast | Entrance opacity and `y: 12→0` | `250ms` | Mount at final position; retain auto-dismiss and manual dismiss. |
| Scroll progress | Teal→gold→leaf 2px bar tracks scroll | Scroll-linked, no decorative animation | Render static current width or disable the bar; never continuously animate. |
| Pricing toggle | Billing content switches; optional indicator transition only | Follow tab contract if shipped | Immediate monthly/yearly content swap. |
| Mobile menu | Dropdown enter/exit panel transition | Use the existing reduced-motion-safe transition | Open/close instantly; preserve focus trap and body lock. |

Trap list: explicitly test that the hero blob is not infinite under reduced motion, `CountUp` does not count up, a sector-name marquee (if present) is stopped, card hover lifts are removed, tab springs become immediate, page transitions have no transform, and the header scroll state does not animate. `MotionConfig reducedMotion="user"` must wrap the app, and the global reduced block must force `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `transition-duration: 0.01ms`, and `scroll-behavior: auto` for `*`.

### Optional extras and cut order

All items below are optional. Build in this order only after the required contract is green; if time is short, cut in the reverse priority order shown. No extra may compromise the Lighthouse ≥95 target.

| Build order | Extra | Status / guardrail | Cut ranking |
|---:|---|---|---:|
| 1 | Consistent hover states | **Optional**; use the existing 250ms lift/icon scale contract only. | Cut 8th (keep if free). |
| 2 | Custom 404 | **Optional**; use the required branded `not-found.tsx` contract. | Cut 7th. |
| 3 | `/faq` | **Optional for the original extras list, but already built in Phase 7**; this phase only verifies it. | Cut 6th from polish work; do not delete the Phase 7 requirement. |
| 4 | Submit toasts | **Optional for the original extras list, but already built in Phase 7**; verify roles and reduced motion only. | Cut 5th from polish work; do not remove required error handling. |
| 5 | Sliding tab indicator | **Optional**; use `layoutId="tab-indicator"` and the specified spring. | Cut 4th. |
| 6 | Hero gradient blobs + grain | **Optional**; CSS-only, `aria-hidden`, static under reduced motion. | Cut 3rd. |
| 7 | Animated count-ups | **Optional**; use `CountUp`, final value under reduced motion. | Cut 2nd. |
| 8 | Sector-name marquee | **Optional**; finite/static fallback, never an accessibility requirement. | Cut 1st. |
| 9 | Pricing billing toggle | **Optional**; use exact monthly/yearly data, −15%, and nearest-500 rounding. | Cut before required QA if it adds bundle or layout risk. |
| 10 | Scroll progress bar | **Optional**; 2px teal→gold→leaf bar under the header. | Cut before any Lighthouse regression. |

If time is short, the ranking determines the cut order. `/faq` and submit toasts remain because Phase 7 made them required deliverables even though they were optional extras in the original brief.

### SEO implementation

Use the root title template `"%s · Digital Chautari"`. Every page exports `metadata` with a page title, a description of 160 characters or fewer, `openGraph: { title, description, url, type, siteName }`, and `twitter: { card: "summary_large_image" }`. Audit these URLs and titles:

| Route | Required metadata title source | Required URL |
|---|---|---|
| `/` | Home/site metadata | `site.url` |
| `/services` | `Our Services` | `${site.url}/services` |
| `/products` | `Our Products` | `${site.url}/products` |
| `/about` | `About Us` | `${site.url}/about` |
| `/contact` | `Contact Us` | `${site.url}/contact` |
| `/faq` | `FAQ` | `${site.url}/faq` |
| `404` | Branded not-found title | `${site.url}/404` |

Create `app/sitemap.ts` with all seven routes, using `site.url` and stable `lastModified` values. Use this complete route list:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/services", "/products", "/about", "/contact", "/faq", "/404"].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: new Date("2026-01-01"),
  }));
}
```

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site.url}/sitemap.xml` };
}
```

Create `app/opengraph-image.tsx` with `next/og` `ImageResponse`, exact 1200×630 dimensions, and a Sora gradient wordmark. Do not fetch a font from an external URL at build time. Use a local `ArrayBuffer` loaded from a checked-in local font file only if the project already has one; otherwise let `ImageResponse` use its fallback sans-serif and reproduce the Sora treatment with the gradient wordmark CSS. No remote font request is an acceptable build-time dependency.

```tsx
import { ImageResponse } from "next/og";

export const alt = "Digital Chautari — Digital. Together.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, background: "#FBFBF9", color: "#101826" }}>
      <div style={{ fontSize: 30, fontWeight: 600, color: "#0B6F66" }}>Digital. Together.</div>
      <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, background: "linear-gradient(90deg, #0F9488, #E0A930, #7FAE3A)", backgroundClip: "text", color: "transparent" }}>Digital Chautari</div>
      <div style={{ fontSize: 30, marginTop: 20, color: "#5B6472" }}>A Kathmandu-based digital agency.</div>
    </div>,
    { ...size },
  );
}
```

In `app/layout.tsx`, retain `next/font/google` Sora (400, 600, 700, 800) and Inter (400, 500, 600), both `display: "swap"`, and inject JSON-LD from `site`:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: site.name, url: site.url, description: site.description, email: site.email },
    { "@type": "LocalBusiness", name: site.name, url: site.url, email: site.email, telephone: site.phone, address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" } },
  ],
};
```

Render it as `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`; all values are controlled `data/site.ts` values.

Verify `/opengraph-image` renders by pasting the production URL into a chat app or an OG validator; inspect the 1200×630 preview rather than accepting a 200 response alone.

### Accessibility sweep

Verify exactly one header, one main, and one footer; the primary navigation is `<nav aria-label="Primary">`; the skip-to-content link is the first focusable element and is visible on focus; and each route has one `h1` with no heading-level skips. Every interactive element uses `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal` or an equally visible replacement.

Contrast audit (use a contrast checker and record pass/fail):

| Pair | Required result |
|---|---:|
| `--ink #101826` on `--paper #FBFBF9` | ≥4.5:1 |
| `--muted #5B6472` on `--paper #FBFBF9` | ≥4.5:1 |
| `--teal-dark #0B6F66` on `--paper #FBFBF9` | ≥4.5:1 |
| `#FFFFFF` on `--teal #0F9488` | ≥4.5:1 |
| `#FFFFFF` on `--teal-dark #0B6F66` | ≥4.5:1 |
| `--gold #E0A930` on `--navy #0B1220` | ≥4.5:1 for text; use only the approved large-text/non-text roles |
| `#FFFFFF` on `--navy #0B1220` | ≥4.5:1 |
| `#FFFFFF` on `--navy-card #101D2B` | ≥4.5:1 |
| `#B42318` on `--paper #FBFBF9` | ≥4.5:1 |
| Focus teal outline against each tested background | ≥3:1 non-text contrast |

Keyboard walkthrough: skip link → Header nav → hamburger/mobile menu → Contact Us → products tabs (Arrow/Home/End) → form labels/fields/project radio/message/submit → FAQ accordion (Enter/Space and focus movement) → footer links. Test Escape and outside click for the mobile menu, route-change close, focus trap, and body scroll lock.

Interactive-component matrix:

| Component | Expected keyboard behavior |
|---|---|
| Skip link | Tab focuses it first; Enter moves focus to `main`. |
| Header links and CTA | Tab order follows visual order; Enter activates. |
| Hamburger | Enter/Space toggles; `aria-expanded` changes; Escape closes and restores focus. |
| Mobile menu links | Tab stays trapped while open; route change closes. |
| Buttons/links | Enter activates; Space activates buttons; visible focus ring. |
| Product tabs | Roving tab index; Left/Right, Home, End select; `aria-selected` and `aria-controls` match. |
| Project type pills | Radio group; Arrow keys select and move; Home/End select extremes. |
| Contact inputs | Tab order is Name, Email, Subject, Project Type, Message, Submit; errors are described. |
| Accordion | Enter/Space toggles; button exposes `aria-expanded` and controls its panel. |
| Toast dismiss | Tab to Dismiss; Enter/Space closes; status/alert is announced. |
| Footer links | Tab and Enter; `aria-disabled` legal placeholders are excluded from tab order. |

Run axe DevTools on all seven routes at desktop and mobile widths. The pass requires zero critical and serious violations.

### Responsive sweep

Use the SPEC §9 matrix exactly:

| Width | Check |
|---|---|
| ≥1280px | 1120px centered container; 3–4 column grids; full nav. |
| 1024–1279px | Same container and full nav; no clipped cards. |
| 761–1023px | 4→2 and 3→2 grids; nav remains inline; 40px container padding. |
| ≤760px | 22px padding; hamburger/dropdown; one-column grids; StatBar 2×2 then one column; Timeline single-sided; pricing stacked; h1 36px; h2 28px; tap targets ≥44px. |
| 360px | No horizontal scroll anywhere. |

At exactly 760px verify the hamburger is active, container padding is 22px, grids have collapsed, and all tap targets remain at least 44px. At exactly 761px verify inline navigation and 40px container padding. Check all seven routes at 360px, including `/products#physio-at-home`, and record `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

### Performance and console sweep

- Audit the Server/Client boundary against the exact §3 allowlist: only `Header`, `MobileMenu`, `Reveal`, `CountUp`, `ScrollProgress`, `GradientBlobs` (static may remain server), `TabbedShowcase`, `ContactForm`, `ProjectTypePills`, `Accordion`, `Toast`, and `PricingGrid` (billing toggle) may be client components.
- Run `npm run build`; inspect the build output for unexpected client bundles and large dependencies. Runtime dependencies remain framer-motion, lucide-react, react-hook-form, zod, Resend, clsx, and tailwind-merge.
- Confirm zero raster images and no remote `next/image` use. Visuals are CSS gradients, lucide icons, and OG output.
- Confirm Sora and Inter use `next/font` with `display: "swap"`; do not add a font loader or remote OG font fetch.
- Run Lighthouse on mobile and desktop, locally or against the production URL, with CI-style flags:

```bash
npx lighthouse http://localhost:3000 --preset=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --output=html --output-path=./artifacts/lighthouse-mobile.html
npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --output=html --output-path=./artifacts/lighthouse-desktop.html
```

The target is ≥95 in Performance, Accessibility, Best Practices, and SEO on both runs. Re-run against the production URL in Phase 9. Open every route in a clean browser, navigate, submit the intended form test, open menus/accordions/tabs, and require zero console errors or warnings in development and production.

## Data to add

| Export in `<file>` | Shape | Source |
|---|---|---|
| `sitemap` in `app/sitemap.ts` | `MetadataRoute.Sitemap` containing all seven routes | SPEC §8 and §9 |
| `robots` in `app/robots.ts` | Allow all, disallow `/api/`, sitemap URL | SPEC §8 |
| OG image default export | `ImageResponse` 1200×630 | SPEC §8 |
| Root `jsonLd` value | Organization and LocalBusiness graph from `data/site.ts` | SPEC §8 |

## Acceptance criteria

**Functional**
- [ ] All seven routes have metadata and are present in the sitemap.
- [ ] Robots allows all, disallows `/api/`, and points to `${site.url}/sitemap.xml`.
- [ ] The OG image produces a 1200×630 preview without an external font fetch.
- [ ] Root JSON-LD contains Organization and LocalBusiness entries.

**Design fidelity**
- [ ] Motion matches every duration, delay, curve, and fallback in the motion audit.
- [ ] Optional extras are explicitly shipped or cut using the cut ranking; no token or approved copy was changed.

**Accessibility**
- [ ] Skip link, landmarks, heading structure, focus rings, labels, keyboard behavior, and reduced-motion behavior pass manual walkthrough.
- [ ] Contrast table passes and axe reports zero critical/serious violations on all seven routes.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds
- [ ] Lighthouse is ≥95 in all four categories on mobile and desktop.
- [ ] Console-error sweep is clean in development and production.

## Verification commands

```bash
npm run lint
npm run typecheck
npm run build
npx lighthouse http://localhost:3000 --preset=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
```

## Manual QA

- [ ] Run the motion audit once with normal motion and once with `prefers-reduced-motion: reduce`.
- [ ] Keyboard-walk Header → mobile menu → tabs → form → accordion → footer on every relevant route.
- [ ] Run axe DevTools on all seven routes at desktop and mobile widths; record zero critical/serious violations.
- [ ] Check all seven routes at 360px and exactly 760px/761px; record no horizontal scroll at 360px.
- [ ] Paste the OG URL into a chat app or validator and inspect the preview.
- [ ] Inspect sitemap and robots responses and verify no `/api/` URL is indexable.
- [ ] Run Lighthouse mobile and desktop; record each category score and preserve the reports.
- [ ] Browse all routes with the console open and record zero errors or warnings.

## Commit

`git commit -m "Phase 8: polish accessibility SEO and performance"`
