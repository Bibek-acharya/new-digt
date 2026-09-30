import {
  Megaphone,
  Clapperboard,
  Code2,
  Search,
  Share2,
  MousePointerClick,
  BarChart3,
  Video,
  Camera,
  PenLine,
  Palette,
  Globe,
  Smartphone,
  HeartPulse,
  Plug,
  Stethoscope,
  ShoppingCart,
  Building2,
  GraduationCap,
  Plane,
  Radio,
} from "lucide-react";

export const categories = [
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Full-funnel acquisition across search, social, and paid.",
    subServices: [
      { icon: Search, title: "SEO & SEM", description: "Search optimisation and paid search campaigns." },
      { icon: Share2, title: "Social Media Marketing", description: "Organic and paid social strategies." },
      { icon: MousePointerClick, title: "Paid Advertising", description: "Targeted ad campaigns across platforms." },
      { icon: BarChart3, title: "Analytics & Reporting", description: "Data-driven insights and performance tracking." },
    ],
  },
  {
    icon: Clapperboard,
    title: "Content Creation",
    description: "Original video, photography, and copy that people actually watch.",
    subServices: [
      { icon: Video, title: "Video Production", description: "Professional video for web and social." },
      { icon: Camera, title: "Photography", description: "Brand and product photography." },
      { icon: PenLine, title: "Copywriting", description: "Web copy, blogs, and campaign content." },
      { icon: Palette, title: "Graphic Design", description: "Visual identity and marketing assets." },
    ],
  },
  {
    icon: Code2,
    title: "Software Development",
    description: "Web, mobile, and health-tech products built to be maintained.",
    subServices: [
      { icon: Globe, title: "Web Applications", description: "Modern web apps with React and Next.js." },
      { icon: Smartphone, title: "Mobile Apps", description: "Cross-platform mobile experiences." },
      { icon: HeartPulse, title: "Health-Tech Software", description: "Healthcare platforms and patient tools." },
      { icon: Plug, title: "API & Integrations", description: "Backend services and third-party connections." },
    ],
  },
];

export const industries = [
  { icon: Stethoscope, label: "Healthcare" },
  { icon: ShoppingCart, label: "E-Commerce" },
  { icon: Building2, label: "Real Estate" },
  { icon: GraduationCap, label: "Education" },
  { icon: Plane, label: "Tourism & Hospitality" },
  { icon: Radio, label: "Media & Publishing" },
];

export const whyUs = [
  "Dedicated project manager",
  "Agile development cycle",
  "Transparent pricing",
  "Post-launch support",
  "Scalable architecture",
  "Cross-platform expertise",
];
