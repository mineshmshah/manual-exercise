import { render, screen } from "@testing-library/react";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import { QuizData } from "@/types/quiz";
import React from "react";
import * as localStorage from "@/lib/localStorage";

// Mock localStorage module
jest.mock("@/lib/localStorage", () => ({
  saveQuizState: jest.fn(),
  loadQuizState: jest.fn(() => null), // Default to returning null (no saved state)
  clearQuizState: jest.fn(),
}));

// Test component that uses the quiz context
function TestComponent() {
  const { state } = useQuiz();

  return (
    <div>
      <div data-testid="questions-length">{state.questions.length}</div>
      <div data-testid="first-question">
        {state.questions.length > 0
          ? state.questions[0].question
          : "No questions"}
      </div>
    </div>
  );
}

describe("QuizProvider with initialQuizData", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Default to no saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(null);
  });

  it("should initialize with provided quiz data", () => {
    // Create mock quiz data
    const mockQuizData: QuizData = {
      questions: [
        {
          question: "Mock Question 1",
          type: "ChoiceType",
          options: [
            {
              display: "Mock Option 1",
              value: "mock1",
              isRejection: false,
            },
          ],
        },
        {
          question: "Mock Question 2",
          type: "ChoiceType",
          options: [
            {
              display: "Mock Option 2",
              value: "mock2",
              isRejection: false,
            },
          ],
        },
      ],
    };

    // Render with mock data
    render(
      <QuizProvider initialQuizData={mockQuizData}>
        <TestComponent />
      </QuizProvider>,
    );

    // Check that the quiz state was initialized with the mock data
    expect(screen.getByTestId("questions-length")).toHaveTextContent("2");
    expect(screen.getByTestId("first-question")).toHaveTextContent(
      "Mock Question 1",
    );
  });

  it("should use default state when no initialQuizData is provided", () => {
    // Render without mock data
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Check that the quiz state was initialized with the default data
    // This test assumes your initialQuizState has questions from quizData.json
    expect(screen.getByTestId("questions-length")).toHaveTextContent("3");
    expect(screen.getByTestId("first-question")).toHaveTextContent(
      "Which image best matches your hair loss?",
    );
  });
});
