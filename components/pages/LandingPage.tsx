"use client";

import HeroSection from "@/components/sections/HeroSection";
import FooterSection from "@/components/sections/FooterSection";
import MultiRowContent from "@/components/sections/MultiRowContent";
import contentBlocksData from "@/data/contentBlocks.json";
import heroSectionData from "@/data/heroSection.json";
import { ContentBlockData } from "@/types/contentBlock";
import { HeroSectionData } from "@/types/heroSection";
import { useQuiz } from "@/contexts/QuizContext";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function Home() {
  const { openQuiz, state } = useQuiz();
  const hasMounted = useHasMounted();

  // Get dynamic button text based on quiz state
  const buttonText = hasMounted
    ? state.isCompleted
      ? "Show Results"
      : state.answers?.length > 0
        ? "Continue Quiz"
        : "Take the Quiz"
    : "Take the Quiz";

  // Create an action map for the hero section
  const actionMap = {
    quiz: openQuiz,
  };

  // Prepare data with proper typing
  const heroData: HeroSectionData = {
    ...(heroSectionData as HeroSectionData),
    button: {
      ...(heroSectionData as HeroSectionData).button,
      text: buttonText,
      // Keep the original action from JSON - will be resolved via actionMap
    },
  };

  return (
    <>
      <main>
        <HeroSection {...heroData} actionMap={actionMap} />
        <MultiRowContent
          title="What can we help with"
          contentBlocks={contentBlocksData as ContentBlockData[]}
        />
      </main>
      <FooterSection />
    </>
  );
}
