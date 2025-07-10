import { render, screen } from "@testing-library/react";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import React from "react";
import * as localStorage from "@/lib/localStorage";

// Mock localStorage methods
jest.mock("@/lib/localStorage", () => ({
  saveQuizState: jest.fn(),
  loadQuizState: jest.fn(),
  clearQuizState: jest.fn(),
}));

describe("QuizContext Initial State", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test component that exposes the quiz context state
  const TestComponent = () => {
    const { state } = useQuiz();

    return (
      <div>
        <div data-testid="is-open">{String(state.isOpen)}</div>
        <div data-testid="current-question-index">
          {state.currentQuestionIndex}
        </div>
        <div data-testid="is-completed">{String(state.isCompleted)}</div>
        <div data-testid="is-rejected">{String(state.isRejected)}</div>
        <div data-testid="answers-count">{state.answers.length}</div>
      </div>
    );
  };

  test("should initialize with isOpen=false even if localStorage has isOpen=true", () => {
    // Create a state with isOpen=true
    const savedState = {
      isOpen: true,
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      isRejected: false,
      questions: [
        {
          question: "Test Question",
          type: "ChoiceType",
          options: [
            { display: "Option A", value: "a", isRejection: false },
            { display: "Option B", value: "b", isRejection: true },
          ],
        },
      ],
    };

    // Mock localStorage to return the state with isOpen=true
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(savedState);

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Verify isOpen is set to false regardless of localStorage
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
  });

  test("should initialize with valid currentQuestionIndex even if localStorage has out-of-bounds index", () => {
    // Create a state with out-of-bounds currentQuestionIndex
    const savedState = {
      isOpen: false,
      currentQuestionIndex: 5, // Out of bounds (only 1 question)
      answers: [],
      isCompleted: false,
      isRejected: false,
      questions: [
        {
          question: "Test Question",
          type: "ChoiceType",
          options: [
            { display: "Option A", value: "a", isRejection: false },
            { display: "Option B", value: "b", isRejection: true },
          ],
        },
      ],
    };

    // Mock localStorage to return the state with out-of-bounds index
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(savedState);

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Verify currentQuestionIndex is corrected to be within bounds
    expect(screen.getByTestId("current-question-index")).toHaveTextContent("0");
  });

  test("should preserve completed and rejected state from localStorage", () => {
    // Create a state with isCompleted and isRejected true
    const savedState = {
      isOpen: true, // Should be overridden to false
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "b",
          selectedOption: {
            display: "Option B",
            value: "b",
            isRejection: true,
          },
        },
      ],
      isCompleted: true,
      isRejected: true,
      questions: [
        {
          question: "Test Question",
          type: "ChoiceType",
          options: [
            { display: "Option A", value: "a", isRejection: false },
            { display: "Option B", value: "b", isRejection: true },
          ],
        },
      ],
    };

    // Mock localStorage to return the state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(savedState);

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Verify isOpen is false, but isCompleted and isRejected are preserved
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("is-completed")).toHaveTextContent("true");
    expect(screen.getByTestId("is-rejected")).toHaveTextContent("true");
  });

  test("should initialize with empty state if localStorage returns undefined", () => {
    // Mock localStorage to return undefined
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(undefined);

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Verify default initial state
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("current-question-index")).toHaveTextContent("0");
    expect(screen.getByTestId("is-completed")).toHaveTextContent("false");
    expect(screen.getByTestId("is-rejected")).toHaveTextContent("false");
    expect(screen.getByTestId("answers-count")).toHaveTextContent("0");
  });
});
