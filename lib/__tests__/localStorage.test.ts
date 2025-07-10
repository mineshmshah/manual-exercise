import {
  saveQuizState,
  loadQuizState,
  clearQuizState,
} from "@/lib/localStorage";
import { QuizState } from "@/types/quiz";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("localStorage utility functions", () => {
  beforeEach(() => {
    // Clear mock storage and function calls before each test
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  // Sample quiz state for testing
  const testQuizState: QuizState = {
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
        selectedOption: { display: "Option A", value: "a", isRejection: false },
      },
    ],
    isOpen: true,
    isCompleted: false,
    isRejected: false,
  };

  test("saveQuizState should save state to localStorage", () => {
    // Call saveQuizState once
    saveQuizState(testQuizState);

    // Verify localStorage.setItem was called with the right key
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "quiz_state",
      expect.any(String),
    );

    // Get the mock function
    const setItemMock = localStorageMock.setItem as jest.Mock;

    // Type assertion for the calls property
    const mockCalls = setItemMock.mock.calls as Array<[string, string]>;

    // Get the JSON string from the first call's second argument
    const savedJSON = mockCalls[0][1];

    // Parse the JSON for validation
    const savedData = JSON.parse(savedJSON) as Record<string, unknown>;

    // Verify we saved the expected properties
    expect(savedData).toHaveProperty("questions");
    expect(savedData).toHaveProperty("currentQuestionIndex");
    expect(savedData).toHaveProperty("answers");
    expect(savedData).toHaveProperty("isCompleted");
    expect(savedData).toHaveProperty("isRejected");

    // Verify we did NOT save isOpen property (to prevent auto-opening on refresh)
    expect(savedData.isOpen).toBeUndefined();
  });

  test("loadQuizState should return data from localStorage", () => {
    // Set up data in localStorage
    const stateToSave = {
      questions: testQuizState.questions,
      currentQuestionIndex: testQuizState.currentQuestionIndex,
      answers: testQuizState.answers,
      isCompleted: testQuizState.isCompleted,
      isRejected: testQuizState.isRejected,
    };
    localStorage.setItem("quiz_state", JSON.stringify(stateToSave));

    // Call loadQuizState
    const loadedState = loadQuizState();

    // Verify localStorage.getItem was called
    expect(localStorageMock.getItem).toHaveBeenCalledWith("quiz_state");

    // Verify the returned state matches what we saved
    expect(loadedState).toEqual(stateToSave);
  });

  test("loadQuizState should return undefined if no data in localStorage", () => {
    // Ensure no data in localStorage
    localStorage.removeItem("quiz_state");

    // Call loadQuizState
    const loadedState = loadQuizState();

    // Verify localStorage.getItem was called
    expect(localStorageMock.getItem).toHaveBeenCalledWith("quiz_state");

    // Verify undefined is returned
    expect(loadedState).toBeUndefined();
  });

  test("clearQuizState should remove quiz state from localStorage", () => {
    // Set up data in localStorage
    localStorage.setItem("quiz_state", JSON.stringify(testQuizState));

    // Call clearQuizState
    clearQuizState();

    // Verify localStorage.removeItem was called
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("quiz_state");
  });

  test("saveQuizState should handle errors gracefully", () => {
    // Mock console.error
    console.error = jest.fn();

    // Force setItem to throw error
    (localStorageMock.setItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Storage error");
    });

    // Should not throw
    expect(() => saveQuizState(testQuizState)).not.toThrow();

    // Should log error
    expect(console.error).toHaveBeenCalled();
  });

  test("loadQuizState should handle errors gracefully", () => {
    // Mock console.error
    console.error = jest.fn();

    // Force getItem to throw error
    (localStorageMock.getItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Storage error");
    });

    // Should not throw
    expect(() => loadQuizState()).not.toThrow();

    // Should log error
    expect(console.error).toHaveBeenCalled();

    // Should return undefined on error
    expect(loadQuizState()).toBeUndefined();
  });

  test("clearQuizState should handle errors gracefully", () => {
    // Mock console.error
    console.error = jest.fn();

    // Force removeItem to throw error
    (localStorageMock.removeItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Storage error");
    });

    // Should not throw
    expect(() => clearQuizState()).not.toThrow();

    // Should log error
    expect(console.error).toHaveBeenCalled();
  });

  test("loadQuizState should handle malformed JSON", () => {
    // Mock console.error
    console.error = jest.fn();

    // Set invalid JSON in localStorage
    localStorage.setItem("quiz_state", "not-valid-json");

    // Should not throw and return undefined
    expect(loadQuizState()).toBeUndefined();

    // Should log error
    expect(console.error).toHaveBeenCalled();
  });
});
