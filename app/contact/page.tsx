import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { infoCards, departments, responseTimes } from "@/data/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Digital Chautari \u2014 Kathmandu digital agency. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <>
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="Contact Us"
        title={<>Let&apos;s start a <span className="gradient-text">conversation</span></>}
        lede="Tell us about your project and we will get back to you within one business day with honest next steps \u2014 no sales pitch required."
      />

      {/* 2. Info cards */}
      <Section variant="standard" tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((card, index) => (
              <Reveal key={card.title} index={index}>
                <Card>
                  <card.icon aria-hidden="true" className="size-5 text-teal-dark" />
                  <h3 className="mt-3 text-sm font-semibold text-ink">{card.title}</h3>
                  {card.href ? (
                    <a href={card.href} className="mt-1 block text-sm text-teal-dark hover:underline">{card.value}</a>
                  ) : (
                    <p className="mt-1 text-sm text-muted">{card.value}</p>
                  )}
                  {card.detail ? <p className="mt-0.5 text-xs text-muted">{card.detail}</p> : null}
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Direct lines */}
      <Section variant="tight" tone="light">
        <Container>
          <Reveal index={0}>
            <SectionHeading title="Reach the right team" align="center" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept, index) => (
              <Reveal key={dept.title} index={index + 1}>
                <Card interactive className="group text-center">
                  <h3 className="text-base font-semibold text-ink">{dept.title}</h3>
                  <p className="mt-1 text-xs text-muted">{dept.note}</p>
                  <a href={`mailto:${dept.email}`} className="mt-3 inline-block text-sm font-medium text-teal-dark">
                    {dept.email}
                  </a>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Two-column: form + info */}
      <Section variant="standard" tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Left: Form */}
            <div>
              <Reveal index={0}>
                <SectionHeading title="Send us a message" />
              </Reveal>
              <Reveal index={1}>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </Reveal>
            </div>
            {/* Right: Map, FAQ, Response times */}
            <div className="space-y-6">
              {/* Map */}
              <Reveal index={2}>
                <Card>
                  <div className="aspect-video overflow-hidden rounded-[var(--radius-card)] bg-chip-teal">
                    <iframe
                      title="Digital Chautari location"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=85.315%2C27.695%2C85.335%2C27.715&layer=mapnik&marker=27.705%2C85.325"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0"
                    />
                  </div>
                </Card>
              </Reveal>

              {/* FAQ callout */}
              <Reveal index={3}>
                <div className="rounded-[var(--radius-card)] bg-navy p-6">
                  <h3 className="text-base font-semibold text-white">Need quick answers?</h3>
                  <p className="mt-2 text-sm text-white/70">Check our frequently asked questions.</p>
                  <a href="/faq" className="mt-3 inline-block text-sm font-medium text-gold">
                    Visit FAQ page &rarr;
                  </a>
                </div>
              </Reveal>

              {/* Response times */}
              <Reveal index={4}>
                <Card>
                  <h3 className="text-base font-semibold text-ink">Response times</h3>
                  <dl className="mt-3 space-y-2">
                    {responseTimes.map((rt) => (
                      <div key={rt.label} className="flex items-center justify-between text-sm">
                        <dt className="text-muted">{rt.label}</dt>
                        <dd className="font-medium text-ink">{rt.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
