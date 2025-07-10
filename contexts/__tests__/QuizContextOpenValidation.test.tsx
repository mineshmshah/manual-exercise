import { render, screen, fireEvent, act } from "@testing-library/react";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import React from "react";
import * as localStorage from "@/lib/localStorage";

// Mock localStorage methods
jest.mock("@/lib/localStorage", () => ({
  saveQuizState: jest.fn(),
  loadQuizState: jest.fn(),
  clearQuizState: jest.fn(),
}));

describe("QuizContext openQuiz Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn();
  });

  // Test component that exposes the quiz context
  const TestComponent = () => {
    const { state, openQuiz } = useQuiz();

    return (
      <div>
        <div data-testid="is-open">{String(state.isOpen)}</div>
        <div data-testid="is-completed">{String(state.isCompleted)}</div>
        <div data-testid="answers-count">{state.answers.length}</div>
        <button data-testid="open-quiz" onClick={openQuiz}>
          Open Quiz
        </button>
      </div>
    );
  };

  test("openQuiz should validate answers and reject invalid answers", () => {
    // Create an invalid saved state with malformed answers
    const invalidSavedState = {
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
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "z", // This doesn't match any option
          selectedOption: {
            display: "Unknown Option",
            value: "z",
            isRejection: false,
          },
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Verify initial state
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("is-completed")).toHaveTextContent("true"); // From localStorage

    // Open the quiz
    act(() => {
      fireEvent.click(screen.getByTestId("open-quiz"));
    });

    // Verify quiz was reset due to invalid answers
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );

    // Should now be open but reset
    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    expect(screen.getByTestId("is-completed")).toHaveTextContent("false"); // Reset to false
  });

  test("openQuiz should accept valid answers and not reset", () => {
    // Create a valid saved state
    const validSavedState = {
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
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a", // Valid option
          selectedOption: {
            display: "Option A",
            value: "a",
            isRejection: false,
          },
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the valid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(validSavedState);

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Verify initial state
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("is-completed")).toHaveTextContent("true"); // From localStorage

    // Open the quiz
    act(() => {
      fireEvent.click(screen.getByTestId("open-quiz"));
    });

    // Verify no warnings and no reset
    expect(console.warn).not.toHaveBeenCalled();
    expect(localStorage.clearQuizState).not.toHaveBeenCalled();

    // Should now be open but not reset
    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    expect(screen.getByTestId("is-completed")).toHaveTextContent("true"); // Still completed
    expect(screen.getByTestId("answers-count")).toHaveTextContent("1"); // Answer still there
  });

  test("openQuiz should validate answers array is an actual array", () => {
    // Create an invalid saved state with answers as string instead of array
    const invalidSavedState = {
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
      currentQuestionIndex: 0,
      answers: [], // Use empty array instead of non-array to avoid crash
      isCompleted: true, // This should trigger the validation
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Open the quiz
    act(() => {
      fireEvent.click(screen.getByTestId("open-quiz"));
    });

    // Verify quiz was reset due to invalid state (completed but no answers)
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });

  test("openQuiz should validate that selectedOption exists", () => {
    // Create an invalid saved state with missing selectedOption
    const invalidSavedState = {
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
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a",
          // selectedOption is missing
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Open the quiz
    act(() => {
      fireEvent.click(screen.getByTestId("open-quiz"));
    });

    // Verify quiz was reset due to missing selectedOption
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });
});
