import { QuizState, QuizAction, QuizData } from "@/types/quiz";
import quizDataJson from "@/data/quizData.json";

const quizData = quizDataJson as QuizData;

export const initialQuizState: QuizState = {
  questions: quizData.questions,
  currentQuestionIndex: 0,
  answers: [],
  isOpen: false,
  isCompleted: false,
  isRejected: false,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "OPEN_QUIZ":
      return {
        ...state,
        isOpen: true,
      };

    case "CLOSE_QUIZ":
      return {
        ...state,
        isOpen: false,
      };

    case "ANSWER_QUESTION": {
      const { questionIndex, option } = action.payload;

      const filteredAnswers = state.answers.filter(
        (answer) => answer.questionIndex < questionIndex,
      );

      const newAnswer = {
        questionIndex,
        selectedValue: option.value,
        selectedOption: option,
      };

      const updatedAnswers = [...filteredAnswers, newAnswer];
      const hasRejection = updatedAnswers.some(
        (answer) => answer.selectedOption.isRejection,
      );
      const isLastQuestion = questionIndex === state.questions.length - 1;

      const allQuestionsAnswered =
        updatedAnswers.length === state.questions.length;

      const isCompleted = isLastQuestion && allQuestionsAnswered;

      return {
        ...state,
        answers: updatedAnswers,
        currentQuestionIndex: hasRejection
          ? state.currentQuestionIndex
          : state.currentQuestionIndex + 1,
        isCompleted: hasRejection || isCompleted,
        isRejected: hasRejection,
      };
    }
    case "NEXT_QUESTION":
      if (state.currentQuestionIndex < state.questions.length - 1) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        };
      }
      return state;
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case "RESET_QUIZ":
      return {
        ...initialQuizState,
      };

    default:
      return state;
  }
}
