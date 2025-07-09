"use client";

import HeroSection from "@/components/sections/HeroSection";
import FooterSection from "@/components/sections/FooterSection";
import MultiRowContent from "@/components/sections/MultiRowContent";
import contentBlocksData from "@/data/contentBlocks.json";
import heroSectionData from "@/data/heroSection.json";
import { ContentBlockData } from "@/types/contentBlock";
import { HeroSectionData } from "@/types/heroSection";
import { useQuiz } from "@/contexts/QuizContext";

export default function Home() {
  const { openQuiz } = useQuiz();

  // Type assertions to ensure proper typing from JSON imports
  const typedContentBlocks = contentBlocksData as ContentBlockData[];
  const typedHeroData = heroSectionData as HeroSectionData;

  // Create hero data with openQuiz function for the button
  const heroDataWithQuizAction: HeroSectionData = {
    ...typedHeroData,
    button: {
      ...typedHeroData.button,
      action: openQuiz, // Pass the function instead of string
    },
  };

  return (
    <>
      <main>
        <HeroSection {...heroDataWithQuizAction} />
        <MultiRowContent
          title="What can we help with"
          contentBlocks={typedContentBlocks}
        />
      </main>
      <FooterSection />
    </>
  );
}
