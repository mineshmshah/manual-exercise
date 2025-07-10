/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render, act } from "@testing-library/react";
import React from "react";
import { QuizProvider, useQuiz, QuizContextProps } from "../QuizContext";
import { QuizState } from "@/types/quiz";
import * as localStorage from "@/lib/localStorage";

// Mock localStorage methods
jest.mock("@/lib/localStorage", () => ({
  saveQuizState: jest.fn(),
  loadQuizState: jest.fn(),
  clearQuizState: jest.fn(),
}));

// Create a test component that exposes the quiz context
const TestComponent = ({
  onMount,
}: {
  onMount: (value: QuizContextProps) => void;
}) => {
  const quizContext = useQuiz();

  // Call onMount with the quiz context when the component mounts
  React.useEffect(() => {
    onMount(quizContext);
  }, [onMount, quizContext]);

  return null;
};

describe("QuizContext validation", () => {
  // Create a sample quiz state with valid data
  const validQuizData = {
    questions: [
      {
        question: "Question 1",
        type: "ChoiceType" as const,
        options: [
          { display: "Option A", value: "a", isRejection: false },
          { display: "Option B", value: "b", isRejection: true },
        ],
      },
      {
        question: "Question 2",
        type: "ChoiceType" as const,
        options: [
          { display: "Option C", value: "c", isRejection: false },
          { display: "Option D", value: "d", isRejection: false },
        ],
      },
    ],
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn();
  });

  test("should initialize with default state when no localStorage data", () => {
    // Mock localStorage to return undefined (no saved state)
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(undefined);

    // Using any for contextValue to work around TypeScript complexities in tests
    let contextValue: any = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Verify the initial state
    expect(contextValue?.state).toEqual(
      expect.objectContaining({
        questions: validQuizData.questions,
        currentQuestionIndex: 0,
        answers: [],
        isOpen: false,
        isCompleted: false,
        isRejected: false,
      }),
    );
  });

  test("should load valid state from localStorage", () => {
    // Create a valid saved state
    const validSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 1,
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
      isCompleted: false,
      isRejected: false,
    };

    // Mock localStorage to return the valid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(validSavedState);

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Verify the state was loaded from localStorage
    expect((contextValue as any)?.state).toEqual(
      expect.objectContaining({
        questions: validQuizData.questions,
        currentQuestionIndex: 1,
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
        isOpen: false, // Should always be false initially
        isCompleted: false,
        isRejected: false,
      }),
    );
  });

  test("should reset quiz if isCompleted is true but answers are empty", () => {
    // Create an invalid saved state
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [], // Empty answers
      isCompleted: true, // But completed is true
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );

    // Verify that clearQuizState was called as part of resetQuiz
    expect(localStorage.clearQuizState).toHaveBeenCalled();
  });

  test("should detect invalid questionIndex in answers", () => {
    // Create a saved state with invalid questionIndex
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 5, // Invalid index, only 2 questions exist
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
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });

  test("should detect option that does not exist in question", () => {
    // Create a saved state with an option that doesn't exist in the question
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "x", // This option doesn't exist
          selectedOption: {
            display: "Option X",
            value: "x",
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

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });

  test("should accept valid completed quiz with answers", () => {
    // Create a valid completed quiz state
    const validCompletedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 1,
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
        {
          questionIndex: 1,
          selectedValue: "c",
          selectedOption: {
            display: "Option C",
            value: "c",
            isRejection: false,
          },
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the valid completed state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      validCompletedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was NOT dispatched (no warning)
    expect(console.warn).not.toHaveBeenCalled();

    // Verify that clearQuizState was NOT called
    expect(localStorage.clearQuizState).not.toHaveBeenCalled();
  });

  test("should save state to localStorage when state changes", () => {
    // Mock localStorage to return undefined (no saved state)
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(undefined);

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Clear the saveQuizState mock calls from initialization
    (localStorage.saveQuizState as jest.Mock).mockClear();

    // Update the state
    act(() => {
      contextValue?.dispatch({ type: "OPEN_QUIZ" });
    });

    // Verify saveQuizState was called with the updated state
    expect(localStorage.saveQuizState).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
      }),
    );
  });

  test("resetQuiz should clear localStorage and reset state", () => {
    // Mock localStorage to return a saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue({
      questions: validQuizData.questions,
      currentQuestionIndex: 1,
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
    });

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Clear the mock calls from initialization
    (localStorage.clearQuizState as jest.Mock).mockClear();

    // Call resetQuiz
    act(() => {
      contextValue?.resetQuiz();
    });

    // Verify clearQuizState was called
    expect(localStorage.clearQuizState).toHaveBeenCalled();

    // Verify the state was reset
    expect((contextValue as any)?.state).toEqual(
      expect.objectContaining({
        questions: validQuizData.questions, // Questions should be preserved
        currentQuestionIndex: 0,
        answers: [],
        isCompleted: false,
        isRejected: false,
      }),
    );
  });

  // Additional test cases for more comprehensive validation coverage

  test("should handle null or undefined selectedOption in answers", () => {
    // Create a saved state with invalid answer structure (missing selectedOption)
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a",
          selectedOption: undefined as any, // Invalid: missing selectedOption
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
    expect(localStorage.clearQuizState).toHaveBeenCalled();
  });

  test("should handle corrupted answer structure with missing properties", () => {
    // Create a saved state with corrupted answer structure
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          // Missing questionIndex property
          selectedValue: "a",
          selectedOption: {
            display: "Option A",
            value: "a",
            isRejection: false,
          },
        } as any,
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });

  test("should handle negative questionIndex in answers", () => {
    // Create a saved state with negative questionIndex
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: -1, // Invalid negative index
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
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });

  test("should validate currentQuestionIndex is within bounds during initialization", () => {
    // Create a saved state with out-of-bounds currentQuestionIndex
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 10, // Out of bounds (only 2 questions)
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
      isCompleted: false,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Verify currentQuestionIndex was corrected to be within bounds
    expect((contextValue as any)?.state.currentQuestionIndex).toBe(1); // Should be set to the last valid index (questions.length - 1)
  });

  test("should handle malformed option values in localStorage", () => {
    // Create a saved state with malformed option values
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: "a",
          selectedOption: {
            display: "Option A",
            // Missing value property
            isRejection: false,
          } as any,
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });

  test("should handle completely corrupted localStorage data", () => {
    // Mock localStorage to return invalid JSON data
    (localStorage.loadQuizState as jest.Mock).mockReturnValue({
      // Completely invalid structure
      random: "data",
      something: true,
      anotherThing: 123,
    } as any);

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Verify initial state is still valid even with corrupted localStorage
    expect((contextValue as any)?.state).toEqual(
      expect.objectContaining({
        questions: validQuizData.questions,
        isOpen: false,
      }),
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify modal opens correctly
    expect((contextValue as any)?.state.isOpen).toBe(true);
  });

  test("should work correctly with boolean option values", () => {
    // Create quiz data with boolean option values
    const booleanQuizData = {
      questions: [
        {
          question: "Boolean Question",
          type: "ChoiceType" as const,
          options: [
            { display: "Yes", value: true, isRejection: false },
            { display: "No", value: false, isRejection: true },
          ],
        },
      ],
    };

    // Create a valid saved state with boolean values
    const validSavedState: Partial<QuizState> = {
      questions: booleanQuizData.questions,
      currentQuestionIndex: 0,
      answers: [
        {
          questionIndex: 0,
          selectedValue: true,
          selectedOption: { display: "Yes", value: true, isRejection: false },
        },
      ],
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the valid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(validSavedState);

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={booleanQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify no reset was called
    expect(console.warn).not.toHaveBeenCalled();
    expect((contextValue as any)?.state.answers[0].selectedValue).toBe(true);
  });

  test("should handle answers array as non-array in localStorage", () => {
    // Create a saved state with invalid answers (not an array)
    const invalidSavedState: Partial<QuizState> = {
      questions: validQuizData.questions,
      currentQuestionIndex: 0,
      answers: "not an array" as any, // Invalid: answers should be an array
      isCompleted: true,
      isRejected: false,
    };

    // Mock localStorage to return the invalid saved state
    (localStorage.loadQuizState as jest.Mock).mockReturnValue(
      invalidSavedState,
    );

    let contextValue: ReturnType<typeof useQuiz> | null = null;

    render(
      <QuizProvider initialQuizData={validQuizData}>
        <TestComponent
          onMount={(value) => {
            contextValue = value;
          }}
        />
      </QuizProvider>,
    );

    // Call openQuiz
    act(() => {
      contextValue?.openQuiz();
    });

    // Verify RESET_QUIZ was dispatched
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid quiz state detected, resetting quiz",
    );
  });
});
