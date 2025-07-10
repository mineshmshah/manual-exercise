import { render } from "@testing-library/react";
import Home from "@/app/page";
import { fetchQuizData } from "@/lib/quizService";
import { QuizData } from "@/types/quiz";

// Mock the fetchQuizData function
jest.mock("@/lib/quizService", () => ({
  fetchQuizData: jest.fn(),
}));

// Mock the components that Home renders
jest.mock("@/components/pages/LandingPage", () => {
  return function MockLandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  };
});

jest.mock("@/components/quiz/QuizModal", () => {
  return {
    QuizModal: function MockQuizModal() {
      return <div data-testid="quiz-modal">Quiz Modal</div>;
    },
  };
});

jest.mock("@/contexts/QuizContext", () => ({
  QuizProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="quiz-provider">{children}</div>
  ),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch quiz data and pass it to the QuizProvider", async () => {
    // Mock quiz data
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

    // Mock the fetchQuizData to return the mock data
    (fetchQuizData as jest.Mock).mockResolvedValue(mockQuizData);

    // Render the component by awaiting it first (for React Server Component)
    const Component = await Home();
    const { getByTestId } = render(Component);

    // Verify fetchQuizData was called
    expect(fetchQuizData).toHaveBeenCalled();

    // Verify the components are rendered
    const quizProvider = getByTestId("quiz-provider");
    expect(quizProvider).toBeInTheDocument();
  });

  it("should handle errors during data fetching", async () => {
    // Mock fetchQuizData to throw an error
    (fetchQuizData as jest.Mock).mockRejectedValue(new Error("API error"));

    // Test should still work since component catches the error
    const Component = await Home();
    const { getByTestId } = render(Component);

    // Components should still be rendered
    const quizProvider = getByTestId("quiz-provider");
    expect(quizProvider).toBeInTheDocument();
  });
});
