import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { TrendingNow } from "@/components/home/trending-now";
import { BrandStory } from "@/components/home/brand-story";
import { Newsletter } from "@/components/home/newsletter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STREET/01 — Wear Your Attitude",
  description:
    "Independent streetwear label. Heavyweight tees, structured hoodies, and utility staples — built for everyday, designed for everywhere.",
  openGraph: {
    title: "STREET/01 — Wear Your Attitude",
    description:
      "Independent streetwear label. Built for everyday. Designed for everywhere.",
    url: "/",
    siteName: "STREET/01",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STREET/01 — Wear Your Attitude",
    description:
      "Independent streetwear label. Built for everyday. Designed for everywhere.",
  },
  alternates: { canonical: "/" },
};
export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <FeaturedCollection />
      <ShopByCategory />
      <TrendingNow />
      <BrandStory />
      <Newsletter />
    </>
  );
}