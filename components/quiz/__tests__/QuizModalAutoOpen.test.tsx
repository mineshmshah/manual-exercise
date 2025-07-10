import { render, screen } from "@testing-library/react";
import { QuizModal } from "@/components/quiz/QuizModal";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import * as localStorage from "@/lib/localStorage";
import React from "react";

// Mock localStorage methods
jest.mock("@/lib/localStorage", () => ({
  saveQuizState: jest.fn(),
  loadQuizState: jest.fn(),
  clearQuizState: jest.fn(),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

describe("QuizModal Auto-Open Prevention", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("quiz should not auto-open on initial render regardless of localStorage state", () => {
    // Mock localStorage to return state with isOpen=true
    (localStorage.loadQuizState as jest.Mock).mockReturnValue({
      isOpen: true,
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      isRejected: false,
      questions: [
        {
          question: "Test Question",
          type: "ChoiceType" as const,
          options: [
            { display: "Option A", value: "a", isRejection: false },
            { display: "Option B", value: "b", isRejection: true },
          ],
        },
      ],
    });

    // Render the component
    render(
      <QuizProvider>
        <QuizModal />
      </QuizProvider>,
    );

    // Modal should not be open
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  test("quiz should always initialize with isOpen=false regardless of localStorage", () => {
    // Create a modal state with isOpen=true
    const mockOpenState = {
      isOpen: true,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a",
          selectedOption: {
            display: "Option A",
            value: "a",
            isRejection: false,
          },
        },
      ],
      isCompleted: true,
      isRejected: false,
      questions: [
        {
          question: "Test Question",
          type: "ChoiceType" as const,
          options: [
            { display: "Option A", value: "a", isRejection: false },
            { display: "Option B", value: "b", isRejection: true },
          ],
        },
      ],
    };

    // Mock localStorage to return state with isOpen=true
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(mockOpenState);

    // Create test component that exposes the quiz context
    const TestComponent = () => {
      const { state } = useQuiz();
      return (
        <div>
          <div data-testid="is-open">{state.isOpen.toString()}</div>
          <QuizModal />
        </div>
      );
    };

    // Render the component
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>,
    );

    // Check that isOpen is false even though localStorage had it as true
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");

    // Modal should not be visible
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  test("saved state should never include isOpen=true", () => {
    // Render the component
    render(
      <QuizProvider>
        <QuizModal />
      </QuizProvider>,
    );

    // Get the calls to saveQuizState from initialization
    const saveQuizStateMock = localStorage.saveQuizState as jest.Mock;

    // Check all calls to ensure none save isOpen=true
    saveQuizStateMock.mock.calls.forEach((call: unknown[]) => {
      if (call && call.length > 0) {
        // Type assertion to make TypeScript happy
        type SavedState = { isOpen?: boolean };
        const savedState = call[0] as SavedState;

        // Verify either isOpen is false or undefined in what's being saved
        if (savedState.isOpen !== undefined) {
          // If isOpen exists, it should be false
          expect(savedState.isOpen).toBe(false);
        }
      }
    });
  });
});
