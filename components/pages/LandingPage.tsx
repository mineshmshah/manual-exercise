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
  // Get quiz state and openQuiz function
  const { openQuiz, state } = useQuiz();
  const hasMounted = useHasMounted();

  // Determine button text based on quiz state - but only after client-side hydration
  const getButtonText = () => {
    if (!hasMounted) {
      // During server-side rendering or before hydration, use the default text
      return "Take the Quiz";
    }

    if (state.isCompleted) {
      return "Show Results";
    } else if (state.answers?.length > 0) {
      return "Continue Quiz";
    }
    return "Take the Quiz";
  };

  // Type assertions to ensure proper typing from JSON imports
  const typedContentBlocks = contentBlocksData as ContentBlockData[];
  const typedHeroData = heroSectionData as HeroSectionData;

  // Create hero data with openQuiz function for the button
  const heroDataWithQuizAction: HeroSectionData = {
    ...typedHeroData,
    button: {
      ...typedHeroData.button,
      text: getButtonText(),
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
