import {
  TrendingUp,
  Sparkles,
  Cpu,
  HeartHandshake,
  Megaphone,
  Clapperboard,
  Code2,
  Palette,
  Stethoscope,
  ShoppingCart,
  Building2,
  GraduationCap,
  Plane,
  Radio,
} from "lucide-react";

export const hero = {
  eyebrow: "\ud83d\ude80 Welcome to Digital Chautari",
  titleParts: {
    plainBefore: "We build ",
    gradientBold: "digital bridges",
    plainAfter: " between ideas and impact",
  },
  lede: "A Kathmandu-based collective of marketers, storytellers, and engineers. We turn ambitious ideas into brands, content, and software that actually move people.",
  primary: { label: "Explore Services", href: "/services" },
  secondary: { label: "View Products", href: "/products" },
};

export const heroStats = [
  { value: "3", label: "Products" },
  { value: "6", label: "Team Members", suffix: "+" },
  { value: "100", label: "Commitment", suffix: "%" },
];

export const features = [
  { icon: TrendingUp, title: "Growth-Driven", description: "Every decision traced back to a measurable outcome.", tone: "mint" as const },
  { icon: Sparkles, title: "Creative-First", description: "Design-led thinking on briefs, campaigns, and products.", tone: "lilac" as const },
  { icon: Cpu, title: "Tech-Powered", description: "Modern stacks, clean code, and analytics on everything.", tone: "teal" as const },
  { icon: HeartHandshake, title: "Client-Centric", description: "Direct access to the people doing the work.", tone: "pink" as const },
];

export const whoWeAre = {
  heading: "A Chautari where ideas meet execution",
  paragraphs: [
    "In Nepal, a chautari is more than a meeting place \u2014 it is where honest conversations happen, where ideas take shape, and where trust is built over time.",
    "Digital Chautari brings that same spirit to the digital world. We are a small, focused team of marketers, storytellers, and engineers based in Kathmandu, turning ambitious ideas into brands, content, and software that actually move people.",
  ],
  checklist: [
    "Creative Strategy",
    "Brand Storytelling",
    "Full-Stack Engineering",
    "Health-Tech Expertise",
  ],
  cta: { label: "Meet the Team", href: "/about" },
  teasers: [
    { icon: Megaphone, title: "Digital Marketing", tone: "mint" as const },
    { icon: Clapperboard, title: "Content Creation", tone: "lilac" as const },
    { icon: Code2, title: "Software Development", tone: "teal" as const },
    { icon: Palette, title: "Branding & Design", tone: "pink" as const },
  ],
};

export const statsBanner = [
  { value: "250", suffix: "+", label: "Projects Delivered" },
  { value: "40", suffix: "+", label: "Clients Served" },
  { value: "1", suffix: "M+", label: "Views Generated" },
  { value: "98", suffix: "%", label: "Client Retention" },
];

export const productsTeaser = {
  heading: "Three ventures, one vision",
  lede: "Each product tackles a different problem, but they share one conviction: technology should make everyday life in Nepal measurably better.",
  entries: [
    { slug: "eco-creative", icon: Megaphone, category: "Marketing Agency", title: "Eco Creative Marketing Agency", description: "Sustainable marketing for brands that mean it. SEO, paid social, content, and analytics \u2014 connected into campaigns that last.", tone: "mint" as const },
    { slug: "one-content", icon: Clapperboard, category: "Content Studio", title: "One Content Creation Studio", description: "One team for every format your audience scrolls. Video, photography, copy, and design from a single partner.", tone: "lilac" as const },
    { slug: "physio-at-home", icon: Stethoscope, category: "Health-Tech", title: "Physio@Home", description: "Physiotherapy that comes to your living room. Booking, recovery plans, vitals, and payments in one calmer care journey.", tone: "teal" as const },
  ],
};

export const sectors = [
  { icon: Stethoscope, label: "Healthcare" },
  { icon: ShoppingCart, label: "E-Commerce" },
  { icon: Building2, label: "Real Estate" },
  { icon: GraduationCap, label: "Education" },
  { icon: Plane, label: "Tourism & Hospitality" },
  { icon: Radio, label: "Media & Publishing" },
];

export const process = [
  { title: "Discover", body: "Workshops, audits, and honest conversations about what you\u2019re actually trying to achieve." },
  { title: "Design", body: "Brand, UX, and content direction in one coherent system." },
  { title: "Develop", body: "Agile builds in two-week sprints with a demo at the end of each." },
  { title: "Deliver", body: "Launch, measure, and keep improving every month after." },
];

export const closingCta = {
  title: "Ready to build something extraordinary together?",
  body: "Tell us what you\u2019re working on. We\u2019ll come back within one business day with next steps.",
  primary: { label: "Start a Project", href: "/contact" },
  secondary: { label: "View Services", href: "/services" },
};
