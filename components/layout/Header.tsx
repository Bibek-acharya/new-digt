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
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-colors duration-200", scrolled && "border-b border-line bg-white/95")}>
        <Container className="flex min-h-[72px] items-center justify-between gap-4">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-6 min-[760px]:flex">
            {items.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-3 text-sm font-medium text-muted after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-teal after:opacity-0 after:content-['']",
                    active && "text-teal-dark after:opacity-100",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="hidden min-[760px]:block">
            <Button href="/contact">Contact Us</Button>
          </div>
          <button
            ref={triggerRef}
            type="button"
            className="grid size-11 place-items-center rounded-[var(--radius-btn)] text-ink min-[760px]:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </Container>
        <div id="mobile-navigation" className="min-[760px]:hidden">
          <MobileMenu open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} items={items} />
        </div>
      </header>
      <ScrollProgress />
    </>
  );
}
