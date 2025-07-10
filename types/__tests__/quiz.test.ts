// Serves as documenation, contract validation and Type Safety Verification

import {
  QuizOptionType,
  QuizQuestion,
  QuizAnswer,
  QuizState,
  QuizAction,
  QuizData,
} from "@/types/quiz";

describe("Quiz Types", () => {
  describe("QuizOption", () => {
    it("should have correct structure", () => {
      const option: QuizOptionType = {
        display: "Test Display",
        value: "test_value",
        isRejection: false,
      };

      expect(option.display).toBe("Test Display");
      expect(option.value).toBe("test_value");
      expect(option.isRejection).toBe(false);
    });

    it("should support boolean values", () => {
      const option: QuizOptionType = {
        display: "Yes",
        value: true,
        isRejection: true,
      };

      expect(option.value).toBe(true);
      expect(option.isRejection).toBe(true);
    });

    it("should support HTML content in display", () => {
      const option: QuizOptionType = {
        display: '<img alt="Test" src="test.png" />',
        value: "image_option",
        isRejection: false,
      };

      expect(option.display).toContain("<img");
      expect(option.display).toContain('alt="Test"');
    });
  });

  describe("QuizQuestion", () => {
    it("should have correct structure", () => {
      const question: QuizQuestion = {
        question: "What is your preference?",
        type: "ChoiceType",
        options: [
          {
            display: "Option 1",
            value: "option1",
            isRejection: false,
          },
          {
            display: "Option 2",
            value: "option2",
            isRejection: true,
          },
        ],
      };

      expect(question.question).toBe("What is your preference?");
      expect(question.type).toBe("ChoiceType");
      expect(question.options).toHaveLength(2);
      expect(question.options[0].display).toBe("Option 1");
      expect(question.options[1].isRejection).toBe(true);
    });
  });

  describe("QuizAnswer", () => {
    it("should have correct structure", () => {
      const option: QuizOptionType = {
        display: "Selected Option",
        value: "selected",
        isRejection: false,
      };

      const answer: QuizAnswer = {
        questionIndex: 1,
        selectedValue: "selected",
        selectedOption: option,
      };

      expect(answer.questionIndex).toBe(1);
      expect(answer.selectedValue).toBe("selected");
      expect(answer.selectedOption).toEqual(option);
    });

    it("should support boolean selectedValue", () => {
      const option: QuizOptionType = {
        display: "No",
        value: false,
        isRejection: false,
      };

      const answer: QuizAnswer = {
        questionIndex: 0,
        selectedValue: false,
        selectedOption: option,
      };

      expect(answer.selectedValue).toBe(false);
    });
  });

  describe("QuizState", () => {
    it("should have correct initial structure", () => {
      const state: QuizState = {
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        isOpen: false,
        isCompleted: false,
        isRejected: false,
      };

      expect(state.questions).toEqual([]);
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.answers).toEqual([]);
      expect(state.isOpen).toBe(false);
      expect(state.isCompleted).toBe(false);
      expect(state.isRejected).toBe(false);
    });

    it("should support populated state", () => {
      const question: QuizQuestion = {
        question: "Test question?",
        type: "ChoiceType",
        options: [
          {
            display: "Test option",
            value: "test",
            isRejection: false,
          },
        ],
      };

      const answer: QuizAnswer = {
        questionIndex: 0,
        selectedValue: "test",
        selectedOption: question.options[0],
      };

      const state: QuizState = {
        questions: [question],
        currentQuestionIndex: 1,
        answers: [answer],
        isOpen: true,
        isCompleted: true,
        isRejected: false,
      };

      expect(state.questions).toHaveLength(1);
      expect(state.currentQuestionIndex).toBe(1);
      expect(state.answers).toHaveLength(1);
      expect(state.isOpen).toBe(true);
      expect(state.isCompleted).toBe(true);
      expect(state.isRejected).toBe(false);
    });
  });

  describe("QuizAction", () => {
    it("should support OPEN_QUIZ action", () => {
      const action: QuizAction = { type: "OPEN_QUIZ" };
      expect(action.type).toBe("OPEN_QUIZ");
    });

    it("should support CLOSE_QUIZ action", () => {
      const action: QuizAction = { type: "CLOSE_QUIZ" };
      expect(action.type).toBe("CLOSE_QUIZ");
    });

    it("should support ANSWER_QUESTION action with payload", () => {
      const option: QuizOptionType = {
        display: "Test",
        value: "test",
        isRejection: false,
      };

      const action: QuizAction = {
        type: "ANSWER_QUESTION",
        payload: { questionIndex: 1, option },
      };

      expect(action.type).toBe("ANSWER_QUESTION");
      expect(action.payload.questionIndex).toBe(1);
      expect(action.payload.option).toEqual(option);
    });

    it("should support PREVIOUS_QUESTION action", () => {
      const action: QuizAction = { type: "PREVIOUS_QUESTION" };
      expect(action.type).toBe("PREVIOUS_QUESTION");
    });

    it("should support RESET_QUIZ action", () => {
      const action: QuizAction = { type: "RESET_QUIZ" };
      expect(action.type).toBe("RESET_QUIZ");
    });
  });

  describe("QuizData", () => {
    it("should have correct structure", () => {
      const quizData: QuizData = {
        questions: [
          {
            question: "First question?",
            type: "ChoiceType",
            options: [
              {
                display: "Option 1",
                value: "opt1",
                isRejection: false,
              },
            ],
          },
          {
            question: "Second question?",
            type: "ChoiceType",
            options: [
              {
                display: "Yes",
                value: true,
                isRejection: true,
              },
              {
                display: "No",
                value: false,
                isRejection: false,
              },
            ],
          },
        ],
      };

      expect(quizData.questions).toHaveLength(2);
      expect(quizData.questions[0].question).toBe("First question?");
      expect(quizData.questions[1].options).toHaveLength(2);
      expect(quizData.questions[1].options[0].value).toBe(true);
    });
  });
});
