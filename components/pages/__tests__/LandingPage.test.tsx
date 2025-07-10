import { render, screen, fireEvent } from "@testing-library/react";
import { QuizProvider } from "@/contexts/QuizContext";
import LandingPage from "@/components/pages/LandingPage";
import { QuizData } from "@/types/quiz";
import { HeroSectionData } from "@/types/heroSection";

// Mock for capturing action calls
const mockActionFn = jest.fn();

// Mock the components used by LandingPage
jest.mock("@/components/sections/HeroSection", () => {
  return function MockHeroSection({
    button,
    actionMap = {},
  }: {
    button?: HeroSectionData["button"];
    actionMap?: Record<string, () => void>;
  }) {
    const handleClick = () => {
      mockActionFn(); // Record that the action was called

      if (typeof button?.action === "function") {
        (button.action as () => void)();
      } else if (
        typeof button?.action === "string" &&
        actionMap[button.action]
      ) {
        actionMap[button.action]();
      }
    };

    return (
      <div data-testid="hero-section">
        <button data-testid="quiz-button" onClick={handleClick}>
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

  // Custom render function
  const renderComponent = () => {
    return render(
      <QuizProvider initialQuizData={mockQuizData}>
        <LandingPage />
      </QuizProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockActionFn.mockClear();
  });

  it("renders the landing page correctly", () => {
    renderComponent();

    // Check that all sections are rendered
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("multi-row-content")).toBeInTheDocument();
    expect(screen.getByTestId("footer-section")).toBeInTheDocument();
  });

  it("provides a clickable button in the hero section", () => {
    renderComponent();

    // Find the quiz button
    const quizButton = screen.getByTestId("quiz-button");
    expect(quizButton).toBeInTheDocument();

    // Click the button
    fireEvent.click(quizButton);

    // Verify the action function was called
    expect(mockActionFn).toHaveBeenCalledTimes(1);
  });
});
