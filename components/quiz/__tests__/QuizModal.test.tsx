import { render, screen, fireEvent } from "@testing-library/react";
import { QuizModal } from "@/components/quiz/QuizModal";
import { QuizProvider } from "@/contexts/QuizContext";
import { useQuiz } from "@/contexts/QuizContext";
import React from "react";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

// Simple test component that can open the quiz
function TestComponentWithOpenButton() {
  const { openQuiz } = useQuiz();

  return (
    <div>
      <button onClick={openQuiz} data-testid="open-quiz">
        Open Quiz
      </button>
      <QuizModal />
    </div>
  );
}

// Test helper to render QuizModal with provider
function renderQuizModal() {
  return render(
    <QuizProvider>
      <TestComponentWithOpenButton />
    </QuizProvider>,
  );
}

describe("QuizModal", () => {
  describe("when quiz is closed", () => {
    it("should not render anything", () => {
      renderQuizModal();

      expect(screen.queryByText("Quiz")).not.toBeInTheDocument();
      expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    });
  });

  describe("when quiz is open", () => {
    it("should render the modal", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      expect(screen.getByText("Quiz")).toBeInTheDocument();
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
      expect(
        screen.getByText("Basic quiz modal - opens and closes"),
      ).toBeInTheDocument();
    });

    it("should have correct CSS classes for full-page layout", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const modal = screen
        .getByText("Quiz")
        .closest("div[class*='fixed inset-0']");
      expect(modal).toHaveClass(
        "fixed",
        "inset-0",
        "z-50",
        "bg-white",
        "text-black",
      );
    });

    it("should render header with title and close button", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      expect(screen.getByText("Quiz")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });

    it("should close modal when close button is clicked", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));
      expect(screen.getByText("Quiz")).toBeInTheDocument();

      // Close the quiz
      const closeButton = screen.getByRole("button", { name: /x/i });
      fireEvent.click(closeButton);

      expect(screen.queryByText("Quiz")).not.toBeInTheDocument();
    });

    it("should apply black text styling", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const header = screen.getByText("Quiz");
      const content = screen.getByText("Basic quiz modal - opens and closes");

      expect(header).toHaveClass("text-black");
      expect(content).toHaveClass("text-black");
    });

    it("should have full-height layout", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const container = screen
        .getByText("Quiz")
        .closest("div[class*='h-full']");
      expect(container).toHaveClass("h-full", "w-full");
    });

    it("should have proper border styling", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const headerContainer = screen
        .getByText("Quiz")
        .closest("div[class*='border-b']");
      expect(headerContainer).toHaveClass("border-b", "border-gray-200");
    });
  });

  describe("modal state management", () => {
    it("should access quiz state correctly", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      // The modal should render, indicating it has access to quiz state
      expect(screen.getByText("Quiz")).toBeInTheDocument();
    });

    it("should have access to all required quiz functions", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const closeButton = screen.getByRole("button", { name: /x/i });
      expect(() => fireEvent.click(closeButton)).not.toThrow();
    });
  });

  describe("accessibility", () => {
    it("should have proper button role for close button", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const closeButton = screen.getByRole("button", { name: /x/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("should have hover states on close button", () => {
      renderQuizModal();

      // Open the quiz
      fireEvent.click(screen.getByTestId("open-quiz"));

      const closeButton = screen.getByRole("button", { name: /x/i });
      expect(closeButton).toHaveClass("hover:bg-gray-100");
    });
  });
});
