"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  QuizState,
  QuizAction,
  QuizOptionType,
  QuizQuestion,
  QuizAnswer,
  QuizData,
} from "@/types/quiz";
import { quizReducer, initialQuizState } from "@/lib/quizReducer";
import {
  saveQuizState,
  loadQuizState,
  clearQuizState,
} from "@/lib/localStorage";

// Export the interface for use in tests
export interface QuizContextProps {
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
  const getInitialState = (): QuizState => {
    // Try to load from localStorage first
    const savedState = loadQuizState();

    if (savedState) {
      // If we have saved state, use it but ensure we have the latest questions and UI state
      const questions =
        initialQuizData?.questions ||
        savedState.questions ||
        initialQuizState.questions;

      // Ensure currentQuestionIndex is valid (not out of bounds)
      const validCurrentQuestionIndex =
        savedState.currentQuestionIndex !== undefined
          ? Math.min(savedState.currentQuestionIndex, questions.length - 1)
          : 0;

      // Merge with initialQuizState to ensure we have all properties
      // but always set isOpen to false to prevent auto-opening on refresh
      return {
        ...initialQuizState,
        ...savedState,
        isOpen: false, // Always ensure modal is closed on page load
        questions: questions,
        currentQuestionIndex: validCurrentQuestionIndex,
      };
    }

    // If no saved state, use initialQuizData or default state
    return initialQuizData
      ? { ...initialQuizState, questions: initialQuizData.questions }
      : initialQuizState;
  };

  const [state, dispatch] = useReducer(quizReducer, getInitialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveQuizState(state);
  }, [state]);

  // Open the quiz modal, handling different states appropriately
  const openQuiz = () => {
    // First check if answers is an array
    const isAnswersArray = Array.isArray(state.answers);

    // Only proceed with validation if answers is an array
    const hasValidAnswers =
      isAnswersArray &&
      state.answers.length > 0 &&
      state.answers.every((answer) => {
        // Check that each answer has required properties
        const basicValidation =
          typeof answer.questionIndex === "number" &&
          answer.questionIndex >= 0 &&
          answer.questionIndex < state.questions.length &&
          answer.selectedOption &&
          typeof answer.selectedOption.value !== "undefined";

        if (!basicValidation) return false;

        // Check that the answer corresponds to an actual question and option
        const question = state.questions[answer.questionIndex];
        if (!question) return false;

        // Verify the selected option exists in the question's options
        const optionExists = question.options.some(
          (option) => option.value === answer.selectedOption.value,
        );

        return optionExists;
      });

    // Reset the quiz if it's completed but has invalid answers or answers is not an array
    if ((state.isCompleted && !hasValidAnswers) || !isAnswersArray) {
      console.warn("Invalid quiz state detected, resetting quiz");
      // Clear the localStorage state before resetting
      clearQuizState();
      dispatch({ type: "RESET_QUIZ" });
    }

    // Open the quiz in all cases
    dispatch({ type: "OPEN_QUIZ" });
  };

  const closeQuiz = () => dispatch({ type: "CLOSE_QUIZ" });
  const answerQuestion = (questionIndex: number, option: QuizOptionType) =>
    dispatch({ type: "ANSWER_QUESTION", payload: { questionIndex, option } });
  const previousQuestion = () => dispatch({ type: "PREVIOUS_QUESTION" });
  const nextQuestion = () => dispatch({ type: "NEXT_QUESTION" });

  // Function to reset quiz state and clear localStorage
  const resetQuiz = () => {
    // Clear quiz data from localStorage
    clearQuizState();
    // Reset the in-memory state
    dispatch({ type: "RESET_QUIZ" });
  };

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
