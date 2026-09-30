# Phase 1 — Design System Foundation

**Goal:** Implement the canonical UI primitives and accessible layout chrome so every later page can compose the same spacing, typography, interaction, and navigation system.
**Depends on:** Phase 0
**Estimate:** 4–6h
**Ships:**
- All nine `components/ui/` primitives contracted in SPEC §2.5.
- Logo, responsive Header/MobileMenu, Footer, and scroll progress chrome from SPEC §2.6.
- A font-loaded root layout with metadata, skip link, landmarks, MotionConfig, and page transition.
- Reduced-motion, keyboard, focus, menu, and active-route behavior ready for shared sections.

---

## Scope

**In scope**
- Implement `Container`, `Section`, `Button`, `Card`, `IconChip`, `Eyebrow`, `Reveal`, `SectionHeading`, and `CountUp` as strict TypeScript components.
- Implement `Logo`, `Header`, `MobileMenu`, `Footer`, and `ScrollProgress`.
- Replace the Phase 0 layout with the full root layout and add `app/template.tsx`.

**Out of scope (later phases)**
- Page-specific sections and content data — Phase 2.
- Marketing routes and their copy — Phase 3 and subsequent page phases.
- Forms, backend routes, and email delivery — backend phase.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `components/ui/Container.tsx` | Width and horizontal rhythm primitive | `{ children, className?, as?: "div"\|"section"\|"header"\|"footer" }` |
| `components/ui/Section.tsx` | Semantic section with canonical padding and tone | `{ variant?, tone?, className?, children, id? }` |
| `components/ui/Button.tsx` | Link/button CTA with locked variants and loading state | `{ variant?, size?, href?, type?, isLoading?, icon?, children }` |
| `components/ui/Card.tsx` | Flat light/dark/transparent surface | `{ as?, tone?, interactive?, className?, children }` |
| `components/ui/IconChip.tsx` | 44/52/60px icon tile with five tints | `{ icon, tone?, size?, className? }` |
| `components/ui/Eyebrow.tsx` | Light/dark pill label | `{ children, tone?, className? }` |
| `components/ui/Reveal.tsx` | In-view fade/slide wrapper with stagger | `{ children, index?, as?, className?, once? }` |
| `components/ui/SectionHeading.tsx` | Shared eyebrow/title/subtext heading stack | `{ eyebrow?, title, subtext?, align?, tone?, className? }` |
| `components/ui/CountUp.tsx` | Once-visible 1400ms number animation | `{ to, prefix?, suffix?, durationMs?, className? }` |
| `components/ui/Toast.tsx` | Compact form feedback message | `{ variant: "success"\|"error", children, onDismiss? }` |
| `components/layout/Logo.tsx` | DC mark and Digital Chautari wordmark | `Logo` |
| `components/layout/Header.tsx` | Sticky responsive site header | `Header` |
| `components/layout/MobileMenu.tsx` | Focus-trapped mobile navigation panel | `{ open, onClose, triggerRef }` |
| `components/layout/Footer.tsx` | Dark four-column footer | `Footer` |
| `components/layout/ScrollProgress.tsx` | Fixed 2px scroll progress bar | `ScrollProgress` |
| `app/layout.tsx` | Full root layout and metadata | `RootLayout`, `metadata` |
| `app/template.tsx` | Reduced-motion-aware page transition | `Template` |

## Files to modify

| Path | Change |
|---|---|
| `app/globals.css` | Keep Phase 0 tokens and add any component-neutral utility rules only if required; do not change canonical values. |
| `app/page.tsx` | Keep the Phase 0 placeholder until Phase 2's smoke page replaces it. |

## Step-by-step

1. Add each UI primitive using the complete implementations below. Keep components server-side unless this document marks them client-side.
2. Add `Logo`, `Header`, `MobileMenu`, `Footer`, and `ScrollProgress`; import navigation data only when Phase 2 creates `data/navigation.ts`, or temporarily define the same typed links in the header during the transition.
3. Replace `app/layout.tsx` with the full layout below. Confirm that it has exactly one `<header>`, one `<main>`, and one `<footer>` landmark.
4. Add `app/template.tsx`; verify the transition is omitted when `useReducedMotion()` is true.
5. Run Prettier, then the three quality gates. Exercise both keyboard and reduced-motion paths before committing.

## Design & content notes

`Container` and `Section` are not plain `div`s: `Container` centralizes the 1120px content measure and responsive horizontal padding, while `Section` supplies semantic section boundaries, the standard/tight/hero block rhythm, and light/tint/dark background tone. Use the exact contract classes below. **The literal Container contract in SPEC §2.5 says `px-[22px] max-[759px]:px-[40px]`, although SPEC §2.3/§9 describe 40px at ≥760px and 22px at ≤760px; preserve the literal contract until the owner reconciles it.**

### `components/ui/Container.tsx`

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
};

export function Container({ children, className, as = "div" }: ContainerProps) {
  const Component = as as ElementType;

  return (
    <Component className={cn("mx-auto max-w-[1120px] px-[22px] max-[759px]:px-[40px]", className)}>
      {children}
    </Component>
  );
}
```

### `components/ui/Section.tsx`

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  variant?: "standard" | "tight" | "hero" | "none";
  tone?: "light" | "tint" | "dark";
  className?: string;
  children: ReactNode;
  id?: string;
};

const variants = {
  standard: "py-16",
  tight: "py-12",
  hero: "pb-12 pt-[84px]",
  none: "",
} as const;

const tones = {
  light: "bg-paper text-ink",
  tint: "bg-[#EAF6EC] text-ink",
  dark: "bg-navy text-white",
} as const;

export function Section({ variant = "standard", tone = "light", className, children, id }: SectionProps) {
  return (
    <section id={id} className={cn(variants[variant], tones[tone], className)}>
      {children}
    </section>
  );
}
```

### `components/ui/Button.tsx`

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "ghost" | "gold" | "onDark" | "outlineDark";
  size?: "md" | "lg";
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  isLoading?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

const variants = {
  primary: "bg-teal text-white hover:bg-teal-dark",
  ghost: "bg-transparent text-teal-dark hover:bg-chip-teal",
  gold: "bg-gold text-navy hover:bg-[#c99422]",
  onDark: "border border-white/70 bg-transparent text-white hover:bg-white/10",
  outlineDark: "border border-navy-border bg-transparent text-navy hover:bg-navy hover:text-white",
} as const;

const sizes = { md: "min-h-11 px-4 text-sm", lg: "min-h-12 px-5 text-base" } as const;

export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  isLoading = false,
  icon: Icon,
  children,
  className,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
    variants[variant],
    sizes[size],
    className,
  );
  const content = (
    <>
      {isLoading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} aria-disabled={isLoading || undefined}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={isLoading} aria-busy={isLoading || undefined}>
      {content}
    </button>
  );
}
```

### `components/ui/Card.tsx`

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  as?: ElementType;
  tone?: "light" | "dark" | "transparent";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

export function Card({ as: Component = "div", tone = "light", interactive = false, className, children }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-[var(--radius-card)] border p-[22px]",
        tone === "light" && "border-line bg-white text-ink",
        tone === "dark" && "border-navy-border bg-navy-card text-white",
        tone === "transparent" && "border-transparent bg-transparent",
        interactive && "transition duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
```

### `components/ui/IconChip.tsx`

```tsx
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/cn";

type IconChipProps = {
  icon: ComponentType<LucideProps> | string;
  tone?: "mint" | "teal" | "gold" | "lilac" | "pink";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const tones = {
  mint: "bg-chip-mint text-teal-dark",
  teal: "bg-chip-teal text-teal-dark",
  gold: "bg-chip-gold text-[#8a6412]",
  lilac: "bg-chip-lilac text-[#71447b]",
  pink: "bg-chip-pink text-[#9c3f50]",
} as const;

const sizes = { sm: "size-11", md: "size-[52px]", lg: "size-[60px]" } as const;

export function IconChip({ icon: Icon, tone = "mint", size = "md", className }: IconChipProps) {
  return (
    <span className={cn("chip inline-flex items-center justify-center rounded-[var(--radius-chip)] transition duration-250 group-hover:scale-[1.08]", tones[tone], sizes[size], className)} aria-hidden="true">
      {typeof Icon === "string" ? <span>{Icon}</span> : <Icon className="size-1/2" strokeWidth={1.8} />}
    </span>
  );
}
```

### `components/ui/Eyebrow.tsx`

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = { children: ReactNode; tone?: "light" | "dark"; className?: string };

export function Eyebrow({ children, tone = "light", className }: EyebrowProps) {
  return (
    <span className={cn("inline-flex rounded-[var(--radius-pill)] px-3 py-1.5 font-sans text-[13px] font-semibold uppercase tracking-[0.08em]", tone === "light" && "bg-chip-mint text-teal-dark", tone === "dark" && "bg-gold/15 text-gold", className)}>
      {children}
    </span>
  );
}
```

### `components/ui/Reveal.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { createElement } from "react";
import { cn } from "@/lib/cn";

type RevealProps = { children: ReactNode; index?: number; as?: ElementType; className?: string; once?: boolean };

export function Reveal({ children, index = 0, as = "div", className, once: _once = true }: RevealProps) {
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
```

### `components/ui/SectionHeading.tsx`

```tsx
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtext?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtext, align = "left", tone = "light", className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-[720px]", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("mt-3", tone === "dark" ? "text-white" : "text-ink")}>{title}</h2>
      {subtext ? <p className={cn("mt-4 text-lg leading-[1.6]", tone === "dark" ? "text-white/75" : "text-muted")}>{subtext}</p> : null}
    </div>
  );
}
```

### `components/ui/CountUp.tsx`

```tsx
"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type CountUpProps = { to: number; prefix?: string; suffix?: string; durationMs?: number; className?: string };

export function CountUp({ to, prefix = "", suffix = "", durationMs = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, inView, reduced, to]);

  return <span ref={ref} className={cn(className)}>{prefix}{value}{suffix}</span>;
}
```

### `components/ui/Toast.tsx`

```tsx
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastProps = { variant: "success" | "error"; children: ReactNode; onDismiss?: () => void };

export function Toast({ variant, children, onDismiss }: ToastProps) {
  return <div role={variant === "error" ? "alert" : "status"} className={cn("flex items-start justify-between gap-4 rounded-[var(--radius-card)] border p-4 text-sm", variant === "success" ? "border-teal/30 bg-chip-mint text-teal-dark" : "border-[#B42318]/30 bg-[#FDECEC] text-[#B42318]")}><p>{children}</p>{onDismiss ? <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="rounded p-1 focus-visible:outline-2 focus-visible:outline-teal"><X aria-hidden="true" className="size-4" /></button> : null}</div>;
}
```

### Layout chrome

`Logo.tsx`:

```tsx
import { cn } from "@/lib/cn";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <a href="/" className="inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal" aria-label="Digital Chautari home">
      <span className="grid size-9 place-items-center rounded-[var(--radius-card)] bg-[linear-gradient(135deg,var(--teal),var(--gold))] font-[var(--font-sora)] text-sm font-bold text-white">DC</span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-[var(--font-sora)] text-base font-semibold", inverted ? "text-white" : "text-ink")}>Digital Chautari</span>
        <span className={cn("mt-1 font-sans text-xs", inverted ? "text-white/65" : "text-muted")}>Digital. Together.</span>
      </span>
    </a>
  );
}
```

`ScrollProgress.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[linear-gradient(90deg,var(--teal),var(--gold),var(--leaf))]" style={{ transform: `scaleX(${progress})` }} />;
}
```

`MobileMenu.tsx` must be a client component and implement outside click, Escape, route-change close, body scroll lock, and a focus trap:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Item = { label: string; href: string };
type MobileMenuProps = { open: boolean; onClose: () => void; triggerRef: RefObject<HTMLButtonElement | null>; items: Item[] };

export function MobileMenu({ open, onClose, triggerRef, items }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) onClose(); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); triggerRef.current?.focus(); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus());
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKeyDown); document.removeEventListener("pointerdown", onPointerDown); };
  }, [open, onClose, triggerRef]);
  return <AnimatePresence>{open ? <motion.div ref={panelRef} role="dialog" aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-b border-line bg-white p-5 shadow-lg" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onPointerDown={(event) => event.stopPropagation()}>
    <nav aria-label="Primary" className="grid gap-1">{items.map((item) => <a key={item.href} href={item.href} className="rounded-[var(--radius-btn)] px-3 py-3 font-medium text-ink focus-visible:outline-2 focus-visible:outline-teal">{item.label}</a>)}</nav>
  </motion.div> : null}</AnimatePresence>;
}
```

`Header.tsx` is a client component. It uses `usePathname()` for the active route, changes to `border-b border-line bg-white/95` only after `scrollY > 8`, switches at 760px, and supplies `aria-expanded`/`aria-controls`:

```tsx
"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { cn } from "@/lib/cn";

const items = [
  { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Products", href: "/products" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <>
    <header className={cn("sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-colors duration-200", scrolled && "border-b border-line bg-white/95")}>
      <Container className="flex min-h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-6 min-[760px]:flex">{items.map((item) => { const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)); return <a key={item.href} href={item.href} className={cn("relative py-3 text-sm font-medium text-muted after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-teal after:opacity-0 after:content-['']", active && "text-teal-dark after:opacity-100")}>{item.label}</a>; })}</nav>
        <div className="hidden min-[760px]:block"><Button href="/contact">Contact Us</Button></div>
        <button ref={triggerRef} type="button" className="grid size-11 place-items-center rounded-[var(--radius-btn)] text-ink min-[760px]:hidden" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </Container>
      <div id="mobile-navigation" className="min-[760px]:hidden"><MobileMenu open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} items={items} /></div>
    </header>
    <ScrollProgress />
  </>;
}
```

`Footer.tsx` is a server component. Use `--navy`, `border-navy-border`, the exact legal links with `href="#"`, `aria-disabled="true"`, and `tabIndex={-1}`. The footer copy is:

```tsx
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";

const columns = [
  { title: "Company", links: [["About", "/about"], ["Products", "/products"], ["FAQ", "/faq"], ["Contact", "/contact"]] },
  { title: "Services", links: [["Digital Marketing", "/services"], ["Content Creation", "/services"], ["Software Development", "/services"], ["Branding & Design", "/services"]] },
  { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Accessibility", "#"]] },
] as const;

export function Footer() {
  return <footer className="bg-navy text-white"><Container className="grid gap-10 py-14 min-[760px]:grid-cols-2 lg:grid-cols-4"><div><Logo inverted /><p className="mt-5 max-w-xs text-sm leading-6 text-white/70">Digital Chautari is a Kathmandu-based digital agency building brands, content, and software — including Physio@Home, our at-home physiotherapy platform.</p><div className="mt-5 flex gap-4 text-sm text-white/70"><a href="#">LinkedIn</a><a href="#">X</a><a href="#">Instagram</a><a href="#">GitHub</a></div></div>{columns.map((column) => <div key={column.title}><h2 className="font-[var(--font-sora)] text-sm font-semibold text-white">{column.title}</h2><ul className="mt-4 grid gap-3 text-sm text-white/70">{column.links.map(([label, href]) => <li key={label}><a href={href} aria-disabled={href === "#" || undefined} tabIndex={href === "#" ? -1 : undefined}>{label}</a></li>)}</ul></div>)}</Container><div className="border-t border-navy-border"><Container className="flex flex-col gap-1 py-5 text-center text-sm text-white/60"><span>© 2026 Digital Chautari. All rights reserved.</span><span>Built in Kathmandu, Nepal</span></Container></div></footer>;
}
```

`app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-sora", weight: ["400", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter", weight: ["400", "500", "600"] });

export const metadata: Metadata = { title: { default: "Digital Chautari", template: "%s · Digital Chautari" }, description: "Digital Chautari is a Kathmandu-based digital agency building brands, content, and software — including Physio@Home, our at-home physiotherapy platform." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sora.variable} ${inter.variable}`}><body><MotionConfig reducedMotion="user"><a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-btn)] focus:bg-white focus:px-4 focus:py-3 focus:text-teal-dark">Skip to content</a><Header /><main id="content">{children}</main><Footer /></MotionConfig></body></html>;
}
```

`app/template.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>{children}</motion.div>;
}
```

## Acceptance criteria

**Functional**
- [ ] Every primitive in SPEC §2.5 exists with the exact named props and compiles under TypeScript `strict`.
- [ ] `Toast` uses `role="status"` for success and `role="alert"` for errors, with an accessible dismiss control when supplied.
- [ ] `Reveal` uses `motion.div`, `whileInView`, `viewport={{ once: true, margin: "-60px" }}`, and `delay: index * 0.07`; reduced motion returns a static element.
- [ ] `CountUp` uses `useInView`, animates once over 1400ms by default, and renders `to` immediately under reduced motion.
- [ ] Header active state comes from `usePathname`; border state changes after `scrollY > 8`; desktop/mobile switch is pinned to 760px.
- [ ] Mobile menu closes on route change, Escape, outside click, and navigation; traps focus and locks body scroll; trigger exposes `aria-expanded` and `aria-controls`.
- [ ] Layout has one header, one main, one footer, a functioning skip link, Sora/Inter variables, and `MotionConfig reducedMotion="user"`.

**Design fidelity**
- [ ] Container max width is 1120px and uses the exact contract padding until the noted spec ambiguity is resolved.
- [ ] Card rest state is flat; interactive cards lift 4px with `--shadow-hover` over 250ms.
- [ ] Header wordmark, tagline, nav underline dot, CTA, footer copy, colors, radii, and spacing match SPEC §2.6.
- [ ] Page transition is opacity 0→1 and y 12→0 over 0.45s easeOut; reduced motion has no transform.

**Accessibility**
- [ ] All interactive elements have visible focus styling and menu controls have correct ARIA state.
- [ ] Mobile focus remains inside the open panel and returns to the trigger on Escape.
- [ ] Decorative progress UI is `aria-hidden` and the skip link is first focusable content.

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

- [ ] At 759px the hamburger is visible; at 760px the inline nav and Contact Us button are visible.
- [ ] Open the mobile menu, tab repeatedly, press Escape, click outside, and navigate to a route; each path closes correctly and restores focus/scroll.
- [ ] Scroll past 8px and confirm the header border/opacity change and 2px progress bar.
- [ ] In DevTools emulate `prefers-reduced-motion: reduce`; reveal, count-up, blob, and page transition remain static.
- [ ] Keyboard-only traversal reaches the skip link, nav, CTA, and footer links with no focus loss.

## Commit

`git commit -m "Phase 1: design system foundation"`
