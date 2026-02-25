import { HomeFooter } from "@/modules/home/ui/components/home-footer";
import { HomeHeader } from "@/modules/home/ui/components/home-header";
import { DocsSection } from "@/modules/home/ui/sections/docs-section";
import { HeroSection } from "@/modules/home/ui/sections/hero-section";
import { FeaturesSection } from "@/modules/home/ui/sections/features-section";

export const HomeView = () => {
  return (
    <>
      <HomeHeader />
      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-112 bg-linear-to-b from-muted/50 via-background to-background" />
        <HeroSection />
        <FeaturesSection />
        <DocsSection />
      </main>
      <HomeFooter />
    </>
  );
};
