import { QuizState } from "@/types/quiz";
// Key for localStorage
const STORAGE_KEY = "quiz_state";

/**
 * Save quiz state to localStorage
 * We only save the answers and progress, not the UI state
 */
export function saveQuizState(state: QuizState): void {
  try {
    if (typeof window !== "undefined") {
      // Only save specific parts of the state
      // Omit isOpen to prevent modal auto-opening on refresh
      const stateToSave = {
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        isCompleted: state.isCompleted,
        isRejected: state.isRejected,
      };

      // Stringify state and add to the localStorage
      const serializedState = JSON.stringify(stateToSave);
      localStorage.setItem(STORAGE_KEY, serializedState);
    }
  } catch (error) {
    console.error("Could not save quiz state to localStorage:", error);
  }
}

/**
 * Load quiz state from localStorage
 */
export function loadQuizState(): Partial<QuizState> | undefined {
  try {
    if (typeof window !== "undefined") {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (serializedState) {
        // Parse string state into JSON
        return JSON.parse(serializedState) as Partial<QuizState>;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Could not load quiz state from localStorage:", error);
    return undefined;
  }
}

/**
 * Clear quiz state from localStorage
 */
export function clearQuizState(): void {
  try {
    if (typeof window !== "undefined") {
      // Remove key to remove any stored quiz state
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Could not clear quiz state from localStorage:", error);
  }
}
