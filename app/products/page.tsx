import { DarkBanner } from "@/components/sections/DarkBanner";
import { PageHero } from "@/components/sections/PageHero";
import { TabbedShowcase } from "@/components/sections/TabbedShowcase";
import { products, spotlight } from "@/data/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Three Digital Chautari ventures: Eco Creative marketing, One Content studio, and Physio@Home health-tech.",
};

export default function ProductsPage() {
  return (
    <>
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="Our Products"
        title={<>Three ventures, <span className="gradient-text">one vision</span></>}
        lede="Each product tackles a different problem, but they share one conviction: technology should make everyday life in Nepal measurably better."
      />

      {/* 2. Tabbed Showcase */}
      <TabbedShowcase products={products} />

      {/* 3. Dark Spotlight */}
      <DarkBanner eyebrow={spotlight.eyebrow} title={spotlight.title}>
        <p className="text-[#C9D2DC]">{spotlight.body}</p>
      </DarkBanner>
    </>
  );
}
