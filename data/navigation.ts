export const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerColumns = [
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Products", href: "/products" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }] },
  { title: "Services", links: [{ label: "Digital Marketing", href: "/services" }, { label: "Content Creation", href: "/services" }, { label: "Software Development", href: "/services" }, { label: "Branding & Design", href: "/services" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Accessibility", href: "#" }] },
] as const;
