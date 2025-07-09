export interface QuizOption {
  display: string;
  value: string | boolean;
  isRejection: boolean;
}

export interface QuizQuestion {
  question: string;
  type: "ChoiceType";
  options: QuizOption[];
}

export interface QuizAnswer {
  questionIndex: number;
  selectedValue: string | boolean;
  selectedOption: QuizOption;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isOpen: boolean;
  isCompleted: boolean;
  isRejected: boolean;
}

export type QuizAction =
  | { type: "OPEN_QUIZ" }
  | { type: "CLOSE_QUIZ" }
  | {
      type: "ANSWER_QUESTION";
      payload: { questionIndex: number; option: QuizOption };
    }
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "RESET_QUIZ" };

export interface QuizData {
  questions: QuizQuestion[];
}
