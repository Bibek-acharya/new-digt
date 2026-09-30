import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/services", "/products", "/about", "/contact", "/faq", "/404"].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: new Date("2026-01-01"),
  }));
}
