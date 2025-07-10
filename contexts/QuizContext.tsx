"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  QuizState,
  QuizAction,
  QuizOptionType,
  QuizQuestion,
  QuizAnswer,
  QuizData,
} from "@/types/quiz";
import { quizReducer, initialQuizState } from "@/lib/quizReducer";

interface QuizContextProps {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  // Helper functions for client
  openQuiz: () => void;
  closeQuiz: () => void;
  answerQuestion: (questionIndex: number, option: QuizOptionType) => void;
  previousQuestion: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  getCurrentQuestion: () => QuizQuestion;
  getPreviousAnswer: (questionIndex: number) => QuizAnswer | undefined;
}

interface QuizProviderProps {
  children: ReactNode;
  initialQuizData?: QuizData;
}

// Create context

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export function QuizProvider({ children, initialQuizData }: QuizProviderProps) {
  const customInitialState = initialQuizData
    ? {
        ...initialQuizState,
        questions: initialQuizData.questions,
      }
    : initialQuizState;

  const [state, dispatch] = useReducer(quizReducer, customInitialState);

  const openQuiz = () => dispatch({ type: "OPEN_QUIZ" });
  const closeQuiz = () => dispatch({ type: "CLOSE_QUIZ" });
  const answerQuestion = (questionIndex: number, option: QuizOptionType) =>
    dispatch({ type: "ANSWER_QUESTION", payload: { questionIndex, option } });
  const previousQuestion = () => dispatch({ type: "PREVIOUS_QUESTION" });
  const nextQuestion = () => dispatch({ type: "NEXT_QUESTION" });
  const resetQuiz = () => dispatch({ type: "RESET_QUIZ" });

  const getCurrentQuestion = () => state.questions[state.currentQuestionIndex];
  const getPreviousAnswer = (questionIndex: number) =>
    state.answers.find((answer) => answer.questionIndex === questionIndex);

  const value: QuizContextProps = {
    state,
    dispatch,
    openQuiz,
    closeQuiz,
    answerQuestion,
    previousQuestion,
    nextQuestion,
    resetQuiz,
    getCurrentQuestion,
    getPreviousAnswer,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz hook must be used within a QuizProvider");
  }
  return context;
}
