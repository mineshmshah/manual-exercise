import HeroSection from "@/components/sections/HeroSection";
import FooterSection from "@/components/sections/FooterSection";
import MultiRowContent from "@/components/sections/MultiRowContent";
import contentBlocksData from "@/data/contentBlocks.json";
import heroSectionData from "@/data/heroSection.json";
import { ContentBlockData } from "@/types/contentBlock";
import { HeroSectionData } from "@/types/heroSection";

export default function Home() {
  // Type assertions to ensure proper typing from JSON imports
  const typedContentBlocks = contentBlocksData as ContentBlockData[];
  const typedHeroData = heroSectionData as HeroSectionData;

  return (
    <>
      <main>
        <HeroSection {...typedHeroData} />
        <MultiRowContent
          title="What can we help with"
          contentBlocks={typedContentBlocks}
        />
      </main>
      <FooterSection />
    </>
  );
}
