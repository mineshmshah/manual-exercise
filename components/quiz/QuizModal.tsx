"use client";

import { useQuiz } from "@/contexts/QuizContext";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import { QuizOption } from "./QuizOption";
import Button from "@/components/ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { QuizResults } from "./QuizResults";
import { QuizOptionType } from "@/types/quiz";

export function QuizModal() {
  const {
    state,
    closeQuiz,
    answerQuestion,
    previousQuestion,
    nextQuestion,
    getCurrentQuestion,
    getPreviousAnswer,
  } = useQuiz();

  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  // Control animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev">(
    "next",
  );

  // Track question changes for animation

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getPreviousAnswer(state.currentQuestionIndex);
  const progress =
    ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  useEffect(() => {
    if (currentQuestion) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match your animation duration

      return () => clearTimeout(timer);
    }
  }, [state.currentQuestionIndex, currentQuestion]);

  if (!state.isOpen) {
    return null;
  }

  // If the quiz is completed, show the results
  if (state.isCompleted) {
    return <QuizResults />;
  }

  // If there's no current question, return null
  if (!currentQuestion) {
    return null;
  }

  // Determine if the current question has images in options - used for layout
  const hasImages = currentQuestion.options.some((option) =>
    option.display.includes("<img"),
  );
  const containerClass = hasImages
    ? "grid grid-cols-2 gap-4 lg:grid-cols-3"
    : "flex flex-col space-y-4";

  const handleClose = () => {
    closeQuiz();
  };

  const handleOptionSelect = (option: QuizOptionType) => {
    answerQuestion(state.currentQuestionIndex, option);
    setIsAutoAdvancing(true);
    setAnimationDirection("next");

    setTimeout(() => {
      setIsAutoAdvancing(false);
      // Auto-advance is handled by the useEffect
    }, 300);
  };
  return (
    <div
      className="fixed inset-0 z-50 bg-(--color-grandfather-lightest) text-black"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      <div className="flex h-full w-full flex-col">
        {/* Header - stays at top */}
        <div className="border-b border-gray-200 bg-white p-4 md:p-6">
          {/* Top row with logo and close button */}
          <div className="flex items-center justify-between">
            <div></div>
            <Logo size="small" />
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          {/* Progress section */}
          <div className="box-border md:mx-6">
            <ProgressBar
              questionNumber={state.currentQuestionIndex + 1}
              questionCount={state.questions.length}
              progress={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            />
          </div>
        </div>
        {/* Content - scrollable middle section */}
        <div className="scrollbar-hide no-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto flex flex-col items-center gap-4 text-(--color-father) md:w-120">
            {/* Question */}
            <div
              className={`m-6 text-2xl font-bold ${
                isAnimating
                  ? animationDirection === "next"
                    ? "animate-slide-in-right"
                    : "animate-slide-in-left"
                  : ""
              }`}
              key={`question-${state.currentQuestionIndex}`}
            >
              <h1 id="quiz-title">{currentQuestion.question}</h1>
            </div>
            {/* Options */}
            <div
              className={`w-full p-6 ${containerClass} ${
                isAnimating
                  ? animationDirection === "next"
                    ? "animate-slide-in-right"
                    : "animate-slide-in-left"
                  : ""
              }`}
              role="radiogroup"
              aria-labelledby="quiz-title"
              key={`options-${state.currentQuestionIndex}`}
            >
              {currentQuestion.options.map((option, index) => (
                <QuizOption
                  key={index}
                  option={option}
                  total={currentQuestion.options.length}
                  index={index}
                  isSelected={
                    currentAnswer?.selectedOption.value === option.value
                  }
                  onSelect={() => handleOptionSelect(option)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation - stuck to bottom */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="mx-auto flex w-full max-w-md justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setAnimationDirection("prev");
                previousQuestion();
              }}
              disabled={state.currentQuestionIndex === 0}
              size="small"
              aria-label="Go to previous question"
            >
              Previous
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setAnimationDirection("next");
                nextQuestion();
              }}
              disabled={!currentAnswer || isAutoAdvancing}
              size="small"
              aria-label={
                state.currentQuestionIndex === state.questions.length - 1
                  ? "Finish quiz"
                  : "Go to next question"
              }
            >
              {state.currentQuestionIndex === state.questions.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
