export type Product = {
  slug: "eco-creative" | "one-content" | "physio-at-home";
  name: string;
  category: string;
  tagline: string;
  description: string;
  tags: string[];
  stats: { label: string; value: string }[];
  cta: { label: string; href: string };
  frame: "browser" | "phone" | "browser";
};

export const products: Product[] = [
  {
    slug: "eco-creative",
    name: "Eco Creative Marketing Agency",
    category: "Marketing Agency",
    tagline: "Sustainable marketing for brands that mean it",
    description: "Eco Creative helps Kathmandu and Nepal-based brands grow with measurable, responsible marketing. Its team connects search, paid social, content, and analytics into campaigns built for lasting impact.",
    tags: ["SEO", "Paid Social", "Content", "Analytics"],
    stats: [{ label: "Campaigns", value: "30+" }, { label: "Industries", value: "12" }, { label: "Rating", value: "4.9\u2605" }],
    cta: { label: "Talk to us", href: "/contact" },
    frame: "browser",
  },
  {
    slug: "one-content",
    name: "One Content Creation Studio",
    category: "Content Studio",
    tagline: "One team for every format your audience scrolls",
    description: "One Content gives Kathmandu teams one partner for video, photography, copy, and design. The studio turns a single idea into consistent formats for Nepalese audiences and modern channels.",
    tags: ["Video", "Photo", "Copy", "Design"],
    stats: [{ label: "Assets Delivered", value: "400+" }, { label: "Brands", value: "50+" }, { label: "Studios", value: "3" }],
    cta: { label: "Start a project", href: "/contact" },
    frame: "phone",
  },
  {
    slug: "physio-at-home",
    name: "Physio@Home",
    category: "Health-Tech",
    tagline: "Physiotherapy that comes to your living room",
    description: "Physio@Home connects people across Kathmandu with licensed physiotherapists at home. The Nepal-focused platform brings booking, recovery plans, vitals, and payments into one calmer care journey.",
    tags: ["Booking", "Vitals", "Plans", "Payments"],
    stats: [{ label: "Districts", value: "8" }, { label: "Physios", value: "25" }, { label: "Rating", value: "4.9\u2605" }],
    cta: { label: "Book a session", href: "/contact" },
    frame: "browser",
  },
];

export const spotlight = {
  eyebrow: "Health-Tech",
  title: "Physio@Home \u2014 healthcare reimagined",
  body: "Patients book a licensed physiotherapist, share symptoms and vitals, follow a recovery plan, and pay in-app. We built it because waiting rooms in Kathmandu are a barrier, not a formality.",
} as const;
