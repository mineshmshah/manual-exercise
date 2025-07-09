import { render, screen } from "@testing-library/react";
import { QuizResults } from "../QuizResults";
// Remove unused import
import React from "react";

// Mock the entire context module
jest.mock("@/contexts/QuizContext", () => ({
  // Mock the hook
  useQuiz: jest.fn(),
}));

import { useQuiz } from "@/contexts/QuizContext";
const mockUseQuiz = useQuiz as jest.MockedFunction<typeof useQuiz>;

function renderWithProvider(stateOverrides = {}) {
  // Set up mock implementation for the test
  mockUseQuiz.mockReturnValue({
    state: {
      isCompleted: true,
      isRejected: false,
      currentQuestionIndex: 0,
      isOpen: true,
      questions: [
        { question: "Q1", type: "ChoiceType", options: [] },
        { question: "Q2", type: "ChoiceType", options: [] },
      ],
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a",
          selectedOption: { display: "A", value: "a", isRejection: false },
        },
        {
          questionIndex: 1,
          selectedValue: "b",
          selectedOption: { display: "B", value: "b", isRejection: false },
        },
      ],
      ...stateOverrides,
    },
    dispatch: jest.fn(),
    openQuiz: jest.fn(),
    closeQuiz: jest.fn(),
    answerQuestion: jest.fn(),
    previousQuestion: jest.fn(),
    nextQuestion: jest.fn(),
    resetQuiz: jest.fn(),
    getCurrentQuestion: jest.fn(),
    getPreviousAnswer: jest.fn(),
  });
  return render(<QuizResults />);
}

describe("QuizResults", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows success message if not rejected", () => {
    renderWithProvider();
    expect(screen.getByText(/great news/i)).toBeInTheDocument();
    expect(screen.getByText(/your answers/i)).toBeInTheDocument();
  });

  it("shows rejection message if rejected", () => {
    renderWithProvider({
      isRejected: true,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a",
          selectedOption: { display: "A", value: "a", isRejection: true },
        },
      ],
    });
    expect(
      screen.getByText(/unfortunately, we are unable to prescribe/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/your answers/i)).not.toBeInTheDocument();
  });
});
