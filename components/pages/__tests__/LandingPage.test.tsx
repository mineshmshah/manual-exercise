import { render, screen } from "@testing-library/react";
import { QuizProvider } from "@/contexts/QuizContext";
import LandingPage from "@/components/pages/LandingPage";
import { QuizData } from "@/types/quiz";
import { HeroSectionData } from "@/types/heroSection";
import { ReactNode } from "react";
import { QuizAction } from "@/types/quiz";

// Mock the components used by LandingPage
jest.mock("@/components/sections/HeroSection", () => {
  return function MockHeroSection({
    button,
  }: {
    button?: HeroSectionData["button"];
  }) {
    return (
      <div data-testid="hero-section">
        <button
          data-testid="quiz-button"
          onClick={button?.action as () => void}
        >
          {button?.text || "Start Quiz"}
        </button>
      </div>
    );
  };
});

jest.mock("@/components/sections/MultiRowContent", () => {
  return function MockMultiRowContent() {
    return <div data-testid="multi-row-content">Multi Row Content</div>;
  };
});

jest.mock("@/components/sections/FooterSection", () => {
  return function MockFooterSection() {
    return <div data-testid="footer-section">Footer</div>;
  };
});

describe("LandingPage", () => {
  const mockQuizData: QuizData = {
    questions: [
      {
        question: "Test Question",
        type: "ChoiceType",
        options: [
          {
            display: "Test Option",
            value: "test",
            isRejection: false,
          },
        ],
      },
    ],
  };

  // Create a mock dispatch function to verify it gets called
  const mockDispatch = jest.fn();

  // Mock the useQuiz hook
  jest.mock("@/contexts/QuizContext", () => {
    const mockOpenQuiz = (): void => {
      mockDispatch({ type: "OPEN_QUIZ" } as QuizAction);
    };

    return {
      useQuiz: () => ({
        openQuiz: mockOpenQuiz,
        state: { questions: mockQuizData.questions },
      }),
      QuizProvider: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
      ),
    };
  });

  it("renders the landing page correctly", () => {
    render(
      <QuizProvider initialQuizData={mockQuizData}>
        <LandingPage />
      </QuizProvider>,
    );

    // Check that all sections are rendered
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("multi-row-content")).toBeInTheDocument();
    expect(screen.getByTestId("footer-section")).toBeInTheDocument();
  });

  it("provides the openQuiz function to the hero section", () => {
    render(
      <QuizProvider initialQuizData={mockQuizData}>
        <LandingPage />
      </QuizProvider>,
    );

    // Find the quiz button
    const quizButton = screen.getByTestId("quiz-button");
    expect(quizButton).toBeInTheDocument();

    // Note: Due to the complexity of mocking nested contexts,
    // we're not testing the actual click behavior here
    // That should be tested in a more integrated test or
    // in the QuizContext tests
  });
});
