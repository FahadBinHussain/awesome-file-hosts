import { getSiteData } from "@/lib/site-data";
import { AppFrame } from "@/components/app-frame";
import { HomeHero } from "./home-hero";
import { HomeFeatures } from "./home-features";
import { HomeCTA } from "./home-cta";

export default function HomePage() {
  const data = getSiteData();
  
  return (
    <AppFrame current="home">
      <HomeHero stats={data.stats} />
      <HomeFeatures />
      <HomeCTA />
    </AppFrame>
  );
}
