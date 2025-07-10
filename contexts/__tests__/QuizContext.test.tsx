import { render, screen, fireEvent, act } from "@testing-library/react";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
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
  const {
    state,
    openQuiz,
    closeQuiz,
    answerQuestion,
    previousQuestion,
    resetQuiz,
    getCurrentQuestion,
    getPreviousAnswer,
  } = useQuiz();

  return (
    <div>
      <div data-testid="is-open">{state.isOpen.toString()}</div>
      <div data-testid="current-question-index">
        {state.currentQuestionIndex}
      </div>
      <div data-testid="questions-length">{state.questions.length}</div>
      <div data-testid="current-question-text">
        {getCurrentQuestion()?.question || "No question"}
      </div>
      <div data-testid="previous-answer">
        {JSON.stringify(getPreviousAnswer(0)) || "No answer"}
      </div>

      <button onClick={openQuiz} data-testid="open-quiz">
        Open Quiz
      </button>
      <button onClick={closeQuiz} data-testid="close-quiz">
        Close Quiz
      </button>
      <button
        onClick={() =>
          answerQuestion(0, {
            display: "test-answer",
            value: "test",
            isRejection: false,
          })
        }
        data-testid="answer-question"
      >
        Answer Question
      </button>
      <button onClick={previousQuestion} data-testid="previous-question">
        Previous Question
      </button>
      <button onClick={resetQuiz} data-testid="reset-quiz">
        Reset Quiz
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <QuizProvider>
      <TestComponent />
    </QuizProvider>,
  );
}

describe("QuizContext", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Default to no saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(null);
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      renderWithProvider();

      expect(screen.getByTestId("is-open")).toHaveTextContent("false");
      expect(screen.getByTestId("current-question-index")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("questions-length")).toHaveTextContent("3");
    });

    it("should load quiz questions from data", () => {
      renderWithProvider();

      expect(screen.getByTestId("current-question-text")).toHaveTextContent(
        "Which image best matches your hair loss?",
      );
    });
  });

  describe("quiz actions", () => {
    it("should open quiz", () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId("open-quiz"));

      expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    });

    it("should close quiz", () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId("open-quiz"));
      expect(screen.getByTestId("is-open")).toHaveTextContent("true");

      fireEvent.click(screen.getByTestId("close-quiz"));
      expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    });

    it("should answer question and advance", () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId("open-quiz"));

      act(() => {
        fireEvent.click(screen.getByTestId("answer-question"));
      });

      expect(screen.getByTestId("current-question-index")).toHaveTextContent(
        "1",
      );
      expect(screen.getByTestId("previous-answer")).toContainHTML("test");
    });

    it("should go to previous question", () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId("open-quiz"));

      // Answer first question
      act(() => {
        fireEvent.click(screen.getByTestId("answer-question"));
      });

      expect(screen.getByTestId("current-question-index")).toHaveTextContent(
        "1",
      );

      // Go back to previous question
      act(() => {
        fireEvent.click(screen.getByTestId("previous-question"));
      });

      expect(screen.getByTestId("current-question-index")).toHaveTextContent(
        "0",
      );
    });

    it("should reset quiz", () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId("open-quiz"));
      fireEvent.click(screen.getByTestId("answer-question"));

      expect(screen.getByTestId("current-question-index")).toHaveTextContent(
        "1",
      );

      act(() => {
        fireEvent.click(screen.getByTestId("reset-quiz"));
      });

      expect(screen.getByTestId("current-question-index")).toHaveTextContent(
        "0",
      );
      expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    });
  });

  describe("helper functions", () => {
    it("should get current question", () => {
      renderWithProvider();

      expect(screen.getByTestId("current-question-text")).toHaveTextContent(
        "Which image best matches your hair loss?",
      );
    });

    it("should get previous answer", () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId("open-quiz"));

      act(() => {
        fireEvent.click(screen.getByTestId("answer-question"));
      });

      expect(screen.getByTestId("previous-answer")).toContainHTML("test");
    });
  });

  describe("error handling", () => {
    it("should throw error when used outside provider", () => {
      const TestComponentWithoutProvider = () => {
        const { state } = useQuiz();
        return <div>{state.isOpen}</div>;
      };

      expect(() => render(<TestComponentWithoutProvider />)).toThrow(
        "useQuiz hook must be used within a QuizProvider",
      );
    });
  });
});
