import { CTAPanel } from "@/components/sections/CTAPanel";
import { DarkBanner } from "@/components/sections/DarkBanner";
import { PricingGrid } from "@/components/sections/PricingGrid";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { IconChip } from "@/components/ui/IconChip";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, industries, whyUs } from "@/data/services";
import { pricing } from "@/data/pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Full-stack digital services \u2014 SEO, social media, content production, software development, and branding \u2014 from Kathmandu to the world.",
};

export default function ServicesPage() {
  return (
    <>
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="Our Services"
        title={<>Services that <span className="gradient-text">drive growth</span></>}
        lede="From acquisition campaigns to production-ready software, Digital Chautari covers the full digital stack for businesses in Nepal and beyond."
      />

      {/* 2. Categories */}
      <Section variant="standard" tone="light">
        <Container>
          <div className="space-y-12">
            {categories.map((category, rowIndex) => (
              <div key={category.title}>
                {rowIndex > 0 && <div className="mb-12 border-t border-line" />}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Category info */}
                  <Reveal index={rowIndex * 5}>
                    <div className={rowIndex % 2 === 1 ? "lg:order-2" : ""}>
                      <IconChip icon={category.icon} tone="mint" size="lg" />
                      <h2 className="mt-4 text-2xl font-bold text-ink">{category.title}</h2>
                      <p className="mt-2 text-muted">{category.description}</p>
                    </div>
                  </Reveal>
                  {/* Sub-services grid */}
                  <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${rowIndex % 2 === 1 ? "lg:order-1" : ""}`}>
                    {category.subServices.map((sub, subIndex) => (
                      <Reveal key={sub.title} index={rowIndex * 5 + subIndex + 1}>
                        <Card interactive className="group">
                          <IconChip icon={sub.icon} tone="teal" size="sm" />
                          <h3 className="mt-3 text-base font-semibold text-ink">{sub.title}</h3>
                          <p className="mt-1 text-sm text-muted">{sub.description}</p>
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Pricing */}
      <Section variant="standard" tone="light">
        <PricingGrid pricing={pricing} />
      </Section>

      {/* 4. Industries */}
      <Section id="industries" variant="tight" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading title="Who we work with" align="center" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, index) => (
              <Reveal key={industry.label} index={index + 1}>
                <Card interactive className="group flex items-center gap-4">
                  <IconChip icon={industry.icon} tone="mint" size="sm" />
                  <span className="text-sm font-medium text-ink">{industry.label}</span>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Why work with us */}
      <DarkBanner eyebrow="Why Us" title="Why work with us">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, index) => (
            <Reveal key={item} index={index}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-teal">{"\u2713"}</span>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </DarkBanner>

      {/* 6. Closing CTA */}
      <Section variant="standard" tone="light">
        <CTAPanel
          title="Let\u2019s find the right service for you"
          primary={{ label: "Book a Consultation", href: "/contact" }}
        />
      </Section>
    </>
  );
}
