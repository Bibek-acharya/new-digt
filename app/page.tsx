import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { CTAPanel } from "@/components/sections/CTAPanel";
import { DarkBanner } from "@/components/sections/DarkBanner";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatBar } from "@/components/sections/StatBar";
import { Testimonials } from "@/components/sections/Testimonials";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { IconChip } from "@/components/ui/IconChip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { blogPosts } from "@/data/blog";
import { hero, heroStats, features, whoWeAre, statsBanner, productsTeaser, sectors, process, closingCta } from "@/data/home";
import { testimonials } from "@/data/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Digital Chautari is a Kathmandu-based digital agency building brands, content, and software that drive measurable growth.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Section variant="hero" tone="tint">
        <Container>
          <Reveal index={0}>
            <span className="inline-flex rounded-full bg-chip-mint px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-teal-dark">
              {hero.eyebrow}
            </span>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-5 max-w-[720px]">
              <span>{hero.titleParts.plainBefore}</span>
              <strong className="gradient-text">{hero.titleParts.gradientBold}</strong>
              <span>{hero.titleParts.plainAfter}</span>
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-[720px] text-lg leading-[1.6] text-muted">{hero.lede}</p>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} variant="ghost">{hero.secondary.label}</Button>
            </div>
          </Reveal>
        </Container>
      </Section>
      <StatBar stats={heroStats} />

      {/* 2. Feature strip */}
      <Section variant="standard" tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} index={index}>
                <Card interactive className="group">
                  <IconChip icon={feature.icon} tone={feature.tone} />
                  <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Who We Are */}
      <Section variant="standard" tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Left: text + checklist */}
            <div>
              <Reveal index={0}>
                <SectionHeading title={whoWeAre.heading} />
              </Reveal>
              <Reveal index={1}>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                  {whoWeAre.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
              <Reveal index={2}>
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {whoWeAre.checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink">
                      <span className="text-teal-dark">{"\u2713"}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal index={3}>
                <div className="mt-7">
                  <Button href={whoWeAre.cta.href}>{whoWeAre.cta.label}</Button>
                </div>
              </Reveal>
            </div>
            {/* Right: teaser cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {whoWeAre.teasers.map((teaser, index) => (
                <Reveal key={teaser.title} index={index + 4}>
                  <Card interactive className="group">
                    <IconChip icon={teaser.icon} tone={teaser.tone} />
                    <h3 className="mt-4 text-base font-semibold text-ink">{teaser.title}</h3>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Dark stats banner */}
      <DarkBanner eyebrow="Our Impact" title="Numbers that speak for themselves">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {statsBanner.map((stat, index) => (
            <Reveal key={stat.label} index={index}>
              <div className="text-center">
                <p className="font-[var(--font-sora)] text-3xl font-bold text-white">
                  <CountUp to={parseInt(stat.value)} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/70">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </DarkBanner>

      {/* 5. Products teaser */}
      <Section variant="standard" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading title={productsTeaser.heading} subtext={productsTeaser.lede} align="center" />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {productsTeaser.entries.map((entry, index) => (
              <Reveal key={entry.slug} index={index + 1}>
                <Card interactive className="group">
                  <IconChip icon={entry.icon} tone={entry.tone} />
                  <span className="mt-4 inline-block rounded-full bg-chip-mint px-3 py-1 text-xs font-semibold text-teal-dark">
                    {entry.category}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-ink">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{entry.description}</p>
                  <a
                    href={`/products#${entry.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-teal-dark"
                  >
                    Learn more &rarr;
                  </a>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Sectors */}
      <Section variant="tight" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading title="Industries we serve" align="center" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, index) => (
              <Reveal key={sector.label} index={index + 1}>
                <Card interactive className="group flex items-center gap-4">
                  <IconChip icon={sector.icon} tone="mint" size="sm" />
                  <span className="text-sm font-medium text-ink">{sector.label}</span>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 7. Process */}
      <ProcessSteps steps={process} tone="dark" />

      {/* 8. Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* 9. Blog teaser */}
      <BlogTeaser posts={blogPosts} />

      {/* 10. Closing CTA */}
      <Section variant="standard" tone="light">
        <CTAPanel
          title={closingCta.title}
          body={closingCta.body}
          primary={closingCta.primary}
          secondary={closingCta.secondary}
        />
      </Section>
    </>
  );
}
