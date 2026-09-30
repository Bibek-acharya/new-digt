import { CTAPanel } from "@/components/sections/CTAPanel";
import { DarkBanner } from "@/components/sections/DarkBanner";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Timeline } from "@/components/sections/Timeline";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { IconChip } from "@/components/ui/IconChip";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/data/about";
import { team, values, milestones, trust } from "@/data/team";
import { cn } from "@/lib/cn";
import { Flame, Lightbulb, Award, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind Digital Chautari \u2014 a seven-member Kathmandu agency turning ideas into brands, content, and software.",
};

const valueIcons = { Flame, Lightbulb, Award, Users };
const valueTones = ["mint", "lilac", "gold", "pink"] as const;

const tileStyles: Record<string, string> = {
  teal: "bg-chip-teal text-teal-dark",
  navy: "bg-navy text-white",
  white: "bg-white text-ink border border-line",
  gold: "bg-chip-gold text-ink",
};

export default function AboutPage() {
  return (
    <>
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="About Us"
        title={<>The people behind <span className="gradient-text">Digital Chautari</span></>}
        lede={about.hero.lede}
      />

      {/* 2. Story */}
      <Section variant="standard" tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <Reveal index={0}>
                <SectionHeading title="From a chautari to a digital powerhouse" />
              </Reveal>
              <Reveal index={1}>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                  {about.story.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {about.story.tiles.map((tile, index) => (
                <Reveal key={tile.label} index={index + 2}>
                  <div className={cn("rounded-[var(--radius-card)] p-6 text-center", tileStyles[tile.tone])}>
                    <p className="font-[var(--font-sora)] text-2xl font-bold">{tile.value}</p>
                    <p className="mt-1 text-sm">{tile.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Mission & Vision */}
      <Section variant="standard" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading eyebrow="Purpose" title="Mission & Vision" align="center" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Reveal index={1}>
              <Card className="h-full">
                <h3 className="text-base font-semibold text-ink">Mission</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{about.mission}</p>
              </Card>
            </Reveal>
            <Reveal index={2}>
              <Card className="h-full">
                <h3 className="text-base font-semibold text-ink">Vision</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{about.vision}</p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 4. Values */}
      <Section variant="standard" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading eyebrow="Values" title="What drives us" align="center" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, index) => {
              const Icon = valueIcons[v.icon as keyof typeof valueIcons];
              return (
                <Reveal key={v.title} index={index + 1}>
                  <Card interactive className="group text-center">
                    <div className="mx-auto">
                      <IconChip icon={Icon} tone={valueTones[index]} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted">{v.body}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. Dark trust band */}
      <DarkBanner eyebrow="Trust" title="Committed to quality & trust">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item, index) => (
            <Reveal key={item} index={index}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-teal">{"\u2713"}</span>
                <span className="text-sm text-white/80">
                  {/* "Ready" describes readiness, not ISO certification. */}
                  {item}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </DarkBanner>

      {/* 6. Team roles */}
      <Section variant="standard" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading eyebrow="Team" title="The people behind the work" align="center" />
          </Reveal>
          <div className="mt-8">
            <TeamGrid team={team} />
          </div>
        </Container>
      </Section>

      {/* 7. Roadmap timeline */}
      <Section variant="standard" tone="dark">
        <Container>
          <Reveal index={0}>
            <SectionHeading eyebrow="Journey" title="Our roadmap" align="center" tone="dark" />
          </Reveal>
          <div className="mt-8">
            <Timeline milestones={milestones} />
          </div>
        </Container>
      </Section>

      {/* 8. Closing CTA */}
      <Section variant="standard" tone="light">
        <CTAPanel
          title="Want to join our journey?"
          primary={{ label: "Get in Touch", href: "/contact" }}
        />
      </Section>
    </>
  );
}
