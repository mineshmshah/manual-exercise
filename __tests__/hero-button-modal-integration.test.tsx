import { render, screen, fireEvent } from "@testing-library/react";
import { QuizProvider } from "@/contexts/QuizContext";
import LandingPage from "@/components/pages/LandingPage";
import { QuizModal } from "@/components/quiz/QuizModal";
import * as localStorage from "@/lib/localStorage";

// Mock localStorage methods
jest.mock("@/lib/localStorage", () => ({
  saveQuizState: jest.fn(),
  loadQuizState: jest.fn(() => null), // Start with no saved state
  clearQuizState: jest.fn(),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

describe("Hero Button to Quiz Modal Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens the quiz modal when hero button is clicked", () => {
    // Render both the landing page and quiz modal with the quiz provider
    render(
      <QuizProvider>
        <LandingPage />
        <QuizModal />
      </QuizProvider>,
    );

    // Initially, the quiz modal content should not be visible
    // We'll look for the quiz title element which should be in the modal
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Find and click the quiz button in the hero section
    const quizButton = screen.getByText("Take the Quiz");
    fireEvent.click(quizButton);

    // Verify the quiz modal is now visible by checking for quiz content
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays the appropriate button text based on quiz state", () => {
    // Mock a completed quiz state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue({
      questions: [{ question: "Test", options: [] }],
      currentQuestionIndex: 0,
      isCompleted: true,
      isOpen: false,
      answers: [{ questionIndex: 0, selectedOption: { value: "test" } }],
    });

    render(
      <QuizProvider>
        <LandingPage />
      </QuizProvider>,
    );

    // Check that the button text reflects the completed state
    expect(screen.getByText("Show Results")).toBeInTheDocument();

    // Reset mock for next test
    (localStorage.loadQuizState as jest.Mock).mockReturnValue({
      questions: [{ question: "Test", options: [] }],
      currentQuestionIndex: 0,
      isCompleted: false,
      isOpen: false,
      answers: [{ questionIndex: 0, selectedOption: { value: "test" } }],
    });

    // Re-render with in-progress state
    render(
      <QuizProvider>
        <LandingPage />
      </QuizProvider>,
    );

    // Check that the button text reflects the in-progress state
    expect(screen.getByText("Continue Quiz")).toBeInTheDocument();
  });
});
