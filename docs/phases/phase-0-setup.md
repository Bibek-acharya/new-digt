# Phase 0 — Project Setup & Scaffold

**Goal:** Create a clean Next.js 15 App Router workspace with the locked dependencies, design tokens, utility helpers, and repository scaffolding required by later phases.
**Depends on:** none
**Estimate:** 1–2h
**Ships:**
- A bootable Next.js 15 TypeScript application using the App Router, Tailwind CSS v4, ESLint, and npm.
- The canonical dependency set, npm scripts, Prettier configuration, and strict typecheck command.
- The complete project directory tree from SPEC §7, with placeholder files only where Phase 0 needs them.
- `globals.css`, `lib/cn.ts`, `.env.example`, and `.gitignore` aligned with SPEC §2 and §6.5.
- An initial Git commit and, when authenticated, a GitHub repository named `digital-chautari-nextjs`.

---

## Scope

**In scope**
- Bootstrap the repository with the exact Next.js CLI options below.
- Install and pin the runtime and development dependencies required by the canonical spec.
- Establish CSS tokens, Tailwind v4 theme aliases, typography defaults, focus styling, and reduced-motion behavior.
- Establish the directory tree and a minimal root layout/page so the dev server can be smoke-tested.

**Out of scope (later phases)**
- UI primitives and layout chrome — Phase 1.
- Shared sections and typed content data — Phase 2.
- Marketing page implementations — Phase 3 and subsequent page phases.
- Contact API, schema, email delivery, and health endpoint — backend phase (SPEC §6).

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `app/globals.css` | Canonical tokens, Tailwind v4 theme aliases, base rules, and motion fallback | CSS custom properties, `.gradient-text` |
| `app/layout.tsx` | Minimal Phase 0 root layout; expanded in Phase 1 | `default function RootLayout` |
| `app/page.tsx` | Temporary boot placeholder; replaced in Phase 3 | Default page component |
| `lib/cn.ts` | `clsx` + `tailwind-merge` helper | `cn(...inputs)` |
| `.env.example` | Committed names for local and Vercel environment variables | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` |
| `.prettierrc.json` | Prettier configuration with Tailwind plugin | `plugins: ["prettier-plugin-tailwindcss"]` |
| `docs/phases/.gitkeep` | Keeps the phases directory in a freshly generated repository until phase docs are copied in | none |
| `components/ui/.gitkeep`, `components/layout/.gitkeep`, `components/sections/.gitkeep`, `components/forms/.gitkeep`, `data/.gitkeep`, `public/.gitkeep` | Preserve otherwise-empty SPEC §7 directories; remove each `.gitkeep` when its first real file is added | none |

## Files to modify

| Path | Change |
|---|---|
| `package.json` | Add the canonical scripts and dependencies; retain the generated Next/React versions compatible with Next.js 15. |
| `.gitignore` | Ensure `.env.local`, `.env*.local`, `.next`, `out`, `node_modules`, and build/debug output are ignored. |

## Step-by-step

1. From the directory that should contain the project, run this exact non-interactive command:

   ```bash
   npx create-next-app@15 digital-chautari --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
   ```

   This is the current Next.js 15 CLI shape. If the installed CLI rejects a flag, drop only the rejected flag and rerun; do not substitute a different framework, `src/` layout, alias, or bundler without recording the reason. If the working directory is already the generated project, use the generated files rather than nesting a second app.

2. Enter the generated `digital-chautari` directory and install the pinned runtime dependencies:

   ```bash
   npm install --save-exact framer-motion@11 lucide-react react-hook-form @hookform/resolvers zod@3 resend clsx tailwind-merge
   ```

3. Install the formatter and Tailwind Prettier plugin as development dependencies:

   ```bash
   npm install --save-dev --save-exact prettier prettier-plugin-tailwindcss
   ```

   Keep the generated Next.js, React, Tailwind v4, and ESLint versions unless the CLI selected an incompatible major; do not add a UI library, icon font, CMS, ORM, or alternate animation library.

4. Set the scripts without hand-editing unrelated generated scripts:

   ```bash
   npm pkg set scripts.dev="next dev" scripts.build="next build" scripts.start="next start" scripts.lint="next lint" scripts.typecheck="tsc --noEmit" scripts.format="prettier --write ."
   ```

5. Write `.prettierrc.json` with exactly this configuration:

   ```json
   {
     "plugins": ["prettier-plugin-tailwindcss"]
   }
   ```

6. Create the full SPEC §7 tree. Preserve generated files where they exist and add `.gitkeep` only to folders with no implementation file yet:

   ```bash
   mkdir -p app/api/contact app/api/health components/ui components/layout components/sections components/forms data lib public docs/phases
   touch components/ui/.gitkeep components/layout/.gitkeep components/sections/.gitkeep components/forms/.gitkeep data/.gitkeep public/.gitkeep docs/phases/.gitkeep
   ```

7. Replace `app/globals.css` with the complete CSS in **Design & content notes** below. The project uses Tailwind v4's `@import "tailwindcss"`; do not create a Tailwind config file.

8. Add `lib/cn.ts` exactly as shown below and add the four environment variable names to `.env.example`. Never commit `.env.local` or a real key.

9. Add the `.gitignore` entries below, then verify that the generated TypeScript config remains strict (`"strict": true`) and uses the `@/*` alias.

10. Initialize and make the first commit:

    ```bash
    git init
    git add .
    git commit -m "Phase 0: project setup and scaffold"
    ```

11. If GitHub CLI is authenticated, create and push the repository. Choose exactly one visibility flag according to the project owner’s decision:

    ```bash
    gh repo create digital-chautari-nextjs --private --source=. --push
    # or
    gh repo create digital-chautari-nextjs --public --source=. --push
    ```

    If `gh auth status` is not authenticated, stop after the local commit and report that repository creation was skipped; never put a token in a file or command argument.

12. Keep `app/page.tsx` as a minimal placeholder only. No content pages exist yet; it is acceptable for this phase to render `Digital Chautari — setup complete`. It is replaced by the Home page in Phase 3.

## Design & content notes

Use these exact tokens and values from SPEC §2.1:

```css
@import "tailwindcss";

:root {
  --teal: #0F9488;
  --teal-dark: #0B6F66;
  --gold: #E0A930;
  --leaf: #7FAE3A;
  --ink: #101826;
  --navy: #0B1220;
  --navy-card: #101D2B;
  --navy-border: #223140;
  --paper: #FBFBF9;
  --line: #E7E5DF;
  --muted: #5B6472;
  --chip-mint: #E7F5EA;
  --chip-teal: #E7F2F4;
  --chip-gold: #FDF1DE;
  --chip-lilac: #F4E9F6;
  --chip-pink: #FDEEF0;
  --gradient-text: linear-gradient(90deg, #0F9488, #E0A930, #7FAE3A);
  --gradient-cta: linear-gradient(135deg, #0F9488 0%, #0B6F66 45%, #0F4C9E 100%);
  --gradient-page-hero: linear-gradient(180deg, #EAF6EC 0%, #FBFBF9 100%);
  --radius-chip: 10px;
  --radius-card: 12px;
  --radius-btn: 8px;
  --radius-pill: 20px;
  --shadow-hover: 0 16px 30px -18px rgba(16, 24, 38, 0.2);
  --shadow-panel: 0 24px 60px -30px rgba(11, 18, 32, 0.35);
}

@theme inline {
  --color-teal: var(--teal);
  --color-teal-dark: var(--teal-dark);
  --color-gold: var(--gold);
  --color-leaf: var(--leaf);
  --color-ink: var(--ink);
  --color-navy: var(--navy);
  --color-navy-card: var(--navy-card);
  --color-navy-border: var(--navy-border);
  --color-paper: var(--paper);
  --color-line: var(--line);
  --color-muted: var(--muted);
  --color-chip-mint: var(--chip-mint);
  --color-chip-teal: var(--chip-teal);
  --color-chip-gold: var(--chip-gold);
  --color-chip-lilac: var(--chip-lilac);
  --color-chip-pink: var(--chip-pink);
  --breakpoint-nav: 760px;
}

* {
  border-color: var(--line);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-inter), Inter, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

h1,
h2,
h3,
h4 {
  font-family: var(--font-sora), Sora, sans-serif;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.08;
}

h2 {
  font-size: 2.375rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.15;
}

h3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
}

h4 {
  font-size: 16px;
  font-weight: 600;
}

a,
button,
input,
textarea,
select {
  -webkit-tap-highlight-color: transparent;
}

:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}

.gradient-text {
  background: var(--gradient-text);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 759px) {
  h1 {
    font-size: 36px;
  }

  h2 {
    font-size: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Use `max-[759px]:` directly for the pinned navigation boundary. A custom variant is not necessary with Tailwind v4 arbitrary variants; if the generated Tailwind version does not parse it, define this once instead of changing the breakpoint:

```css
@custom-variant max-nav (@media (max-width: 759px));
```

The canonical `lib/cn.ts` implementation is:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Until Phase 1 adds fonts and layout chrome, the minimal root files may be:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Digital Chautari" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><main id="content">{children}</main></body></html>;
}
```

```tsx
// app/page.tsx — temporary, replaced in Phase 3
export default function SetupPage() {
  return <p>Digital Chautari — setup complete</p>;
}
```

`.env.example` must contain exactly:

```dotenv
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Append these to `.gitignore` if the generated file does not already cover them:

```gitignore
node_modules/
.next/
out/
.env.local
.env*.local
*.tsbuildinfo
```

## Acceptance criteria

**Functional**
- [ ] The exact Next.js 15 CLI invocation (or only its rejected flag removed) creates a bootable App Router project.
- [ ] `npm install` completes with the specified runtime and development dependencies.
- [ ] `app/globals.css` loads Tailwind v4 and exposes every named color utility in SPEC §2.1.
- [ ] No content pages exist yet; the root placeholder renders without data or page-specific copy.
- [ ] `git status` is clean after the initial commit, excluding intentionally untracked local environment files.

**Design fidelity**
- [ ] All hex values, gradients, radii, shadows, typography sizes, and the `760px` breakpoint match SPEC §2 exactly.
- [ ] Body uses Inter and headings use Sora variables when Phase 1 wires the fonts.
- [ ] `.gradient-text` uses the exact 90° teal/gold/leaf gradient and transparent text fill.

**Accessibility**
- [ ] Global `:focus-visible` styling is present and visible.
- [ ] Reduced-motion CSS forces the exact fallback durations and `scroll-behavior: auto`.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds

## Verification commands

```bash
npm run lint
npm run typecheck
npm run build
npm run dev
```

With the dev server running, open `http://localhost:3000` and confirm the root layout renders the Phase 0 placeholder. Stop the server after the smoke test.

## Manual QA

- [ ] `http://localhost:3000` boots with no console errors and renders the temporary setup placeholder.
- [ ] View source confirms no real secret is present and `.env.local` remains ignored.
- [ ] At 360px wide, the placeholder has no horizontal overflow.
- [ ] GitHub repository creation was performed with `--private` or `--public`, or the unauthenticated skip was recorded.

## Commit

`git commit -m "Phase 0: project setup and scaffold"`
