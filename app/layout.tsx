import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/data/site";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-sora", weight: ["400", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Digital Chautari", template: "%s \u00b7 Digital Chautari" },
  description: site.description,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: site.name, url: site.url, description: site.description, email: site.email },
    { "@type": "LocalBusiness", name: site.name, url: site.url, email: site.email, telephone: site.phone, address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-btn)] focus:bg-white focus:px-4 focus:py-3 focus:text-teal-dark"
          >
            Skip to content
          </a>
          <Header />
          <main id="content">{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
