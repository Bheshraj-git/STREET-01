import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { TrendingNow } from "@/components/home/trending-now";
import { BrandStory } from "@/components/home/brand-story";
import { Newsletter } from "@/components/home/newsletter";

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