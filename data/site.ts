export const site = {
  name: "Digital Chautari",
  tagline: "Digital. Together.",
  description: "Digital Chautari is a Kathmandu-based digital agency building brands, content, and software \u2014 including Physio@Home, our at-home physiotherapy platform.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digital-chautari.vercel.app",
  founded: 2025,
  location: "Kathmandu, Nepal",
  email: "hello@digitalchautari.com",
  phone: "+977 98XXXXXXXX",
  hours: "Sunday\u2013Friday, 10:00\u201318:00 NPT",
  social: [{ label: "LinkedIn", href: "#" }, { label: "X", href: "#" }, { label: "Instagram", href: "#" }, { label: "GitHub", href: "#" }],
} as const;
