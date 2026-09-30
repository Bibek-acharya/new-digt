import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Products", "/products"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
    ] as const,
  },
  {
    title: "Services",
    links: [
      ["Digital Marketing", "/services"],
      ["Content Creation", "/services"],
      ["Software Development", "/services"],
      ["Branding & Design", "/services"],
    ] as const,
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "#"],
      ["Terms", "#"],
      ["Accessibility", "#"],
    ] as const,
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="grid gap-10 py-14 min-[760px]:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
            Digital Chautari is a Kathmandu-based digital agency building brands, content, and software — including Physio@Home, our at-home physiotherapy platform.
          </p>
          <div className="mt-5 flex gap-4 text-sm text-white/70">
            <a href="#">LinkedIn</a>
            <a href="#">X</a>
            <a href="#">Instagram</a>
            <a href="#">GitHub</a>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-[var(--font-sora)] text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 grid gap-3 text-sm text-white/70">
              {column.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} aria-disabled={href === "#" || undefined} tabIndex={href === "#" ? -1 : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-navy-border">
        <Container className="flex flex-col gap-1 py-5 text-center text-sm text-white/60">
          <span>&copy; 2026 Digital Chautari. All rights reserved.</span>
          <span>Built in Kathmandu, Nepal</span>
        </Container>
      </div>
    </footer>
  );
}
