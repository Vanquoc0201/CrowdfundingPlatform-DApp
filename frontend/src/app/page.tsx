import { HeroSection } from "@/components/custom/home/HeroSection";
import { FeaturedCampaigns } from "@/components/custom/home/FeaturedCampaigns";
import { PlatformStats } from "@/components/custom/home/PlatformStats";
import { HowItWorksSection } from "@/components/custom/home/HowItWorksSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedCampaigns />
      <PlatformStats />
      <HowItWorksSection />
    </div>
  );
}