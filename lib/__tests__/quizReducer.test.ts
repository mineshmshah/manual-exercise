import { quizReducer, initialQuizState } from "@/lib/quizReducer";
import { QuizAction, QuizState, QuizOptionType } from "@/types/quiz";

describe("quizReducer", () => {
  let initialState: QuizState;

  beforeEach(() => {
    initialState = { ...initialQuizState };
  });

  describe("OPEN_QUIZ action", () => {
    it("should set isOpen to true", () => {
      const action: QuizAction = { type: "OPEN_QUIZ" };
      const result = quizReducer(initialState, action);

      expect(result.isOpen).toBe(true);
      expect(result.currentQuestionIndex).toBe(0);
    });
  });

  describe("CLOSE_QUIZ action", () => {
    it("should set isOpen to false", () => {
      const openState = { ...initialState, isOpen: true };
      const action: QuizAction = { type: "CLOSE_QUIZ" };
      const result = quizReducer(openState, action);

      expect(result.isOpen).toBe(false);
    });
  });

  describe("ANSWER_QUESTION action", () => {
    it("should add answer and advance to next question", () => {
      const openState = { ...initialState, isOpen: true };
      const option: QuizOptionType = {
        display: "Test Option",
        value: "test",
        isRejection: false,
      };
      const action: QuizAction = {
        type: "ANSWER_QUESTION",
        payload: { questionIndex: 0, option },
      };

      const result = quizReducer(openState, action);

      expect(result.answers).toHaveLength(1);
      expect(result.answers[0]).toEqual({
        questionIndex: 0,
        selectedValue: "test",
        selectedOption: option,
      });
      expect(result.currentQuestionIndex).toBe(1);
    });

    it("should set isRejected to true for rejection options", () => {
      const openState = { ...initialState, isOpen: true };
      const rejectionOption: QuizOptionType = {
        display: "Rejection Option",
        value: "reject",
        isRejection: true,
      };
      const action: QuizAction = {
        type: "ANSWER_QUESTION",
        payload: { questionIndex: 0, option: rejectionOption },
      };

      const result = quizReducer(openState, action);

      expect(result.isRejected).toBe(true);
    });

    it("should replace existing answer for same question", () => {
      const stateWithAnswer = {
        ...initialState,
        isOpen: true,
        answers: [
          {
            questionIndex: 0,
            selectedValue: "old",
            selectedOption: {
              display: "Old Option",
              value: "old",
              isRejection: false,
            },
          },
        ],
      };

      const newOption: QuizOptionType = {
        display: "New Option",
        value: "new",
        isRejection: false,
      };
      const action: QuizAction = {
        type: "ANSWER_QUESTION",
        payload: { questionIndex: 0, option: newOption },
      };

      const result = quizReducer(stateWithAnswer, action);

      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].selectedValue).toBe("new");
    });

    it("should set isCompleted when answering last question", () => {
      // Create a state with 3 questions where we've already answered 0 and 1
      const nearEndState = {
        ...initialState,
        isOpen: true,
        currentQuestionIndex: 2, // Last question index (in a 3-question quiz)
        questions: [
          { question: "Q1", options: [], type: "ChoiceType" },
          { question: "Q2", options: [], type: "ChoiceType" },
          { question: "Q3", options: [], type: "ChoiceType" },
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
      };

      const option: QuizOptionType = {
        display: "Final Option",
        value: "final",
        isRejection: false,
      };

      const action: QuizAction = {
        type: "ANSWER_QUESTION",
        payload: { questionIndex: 2, option },
      };

      const result = quizReducer(nearEndState, action);

      expect(result.isCompleted).toBe(true);
    });
  });

  describe("PREVIOUS_QUESTION action", () => {
    it("should go back to previous question", () => {
      const advancedState = {
        ...initialState,
        isOpen: true,
        currentQuestionIndex: 1,
      };

      const action: QuizAction = { type: "PREVIOUS_QUESTION" };
      const result = quizReducer(advancedState, action);

      expect(result.currentQuestionIndex).toBe(0);
    });

    it("should not go below 0", () => {
      const action: QuizAction = { type: "PREVIOUS_QUESTION" };
      const result = quizReducer(initialState, action);

      expect(result.currentQuestionIndex).toBe(0);
    });
  });

  describe("RESET_QUIZ action", () => {
    it("should reset to initial state", () => {
      const modifiedState: QuizState = {
        ...initialState,
        isOpen: true,
        currentQuestionIndex: 2,
        answers: [
          {
            questionIndex: 0,
            selectedValue: "test",
            selectedOption: {
              display: "Test",
              value: "test",
              isRejection: false,
            },
          },
        ],
        isCompleted: true,
        isRejected: true,
      };

      const action: QuizAction = { type: "RESET_QUIZ" };
      const result = quizReducer(modifiedState, action);

      expect(result).toEqual(initialQuizState);
    });
  });

  describe("unknown action", () => {
    it("should return current state for unknown action", () => {
      const unknownAction = { type: "UNKNOWN_ACTION" } as unknown as QuizAction;
      const result = quizReducer(initialState, unknownAction);

      expect(result).toBe(initialState);
    });
  });
});
