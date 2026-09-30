import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { projectTypes } from "@/lib/schema";

export const infoCards = [
  { icon: MapPin, title: "Address", value: "Kathmandu, Nepal", detail: "3rd Floor, Sundhara" },
  { icon: Mail, title: "Email", value: "hello@digitalchautari.com", href: "mailto:hello@digitalchautari.com" },
  { icon: Phone, title: "Phone", value: "+977 98XXXXXXXX", href: "tel:+97798XXXXXXXX" },
  { icon: Clock, title: "Business Hours", value: "Sunday\u2013Friday, 10:00\u201318:00 NPT" },
];

export const departments = [
  { title: "Marketing", email: "marketing@digitalchautari.com", note: "Campaigns, SEO, paid media" },
  { title: "Content Studio", email: "content@digitalchautari.com", note: "Video, photography, copy" },
  { title: "Software Development", email: "dev@digitalchautari.com", note: "Web, mobile, health-tech" },
  { title: "Business Development", email: "business@digitalchautari.com", note: "Partnerships, proposals" },
];

export const responseTimes = [
  { label: "Email", value: "Within 24 hours" },
  { label: "Proposals", value: "2\u20133 business days" },
  { label: "Urgent", value: "Same business day" },
];

export { projectTypes };
