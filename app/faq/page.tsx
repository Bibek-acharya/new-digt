import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { CTAPanel } from "@/components/sections/CTAPanel";
import { faq } from "@/data/faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about working with Digital Chautari \u2014 timelines, pricing, support, and data privacy.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={<>Questions, <span className="gradient-text">answered</span></>}
        lede="Everything you need to know before working with us \u2014 if your question is not here, reach out and we will get back to you within one business day."
      />
      <Section variant="standard" tone="light">
        <Container>
          <Reveal index={0}>
            <div className="mx-auto max-w-[720px]">
              <Accordion items={faq} />
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section variant="standard" tone="light">
        <CTAPanel
          title="Still have questions?"
          primary={{ label: "Contact Us", href: "/contact" }}
        />
      </Section>
    </>
  );
}
