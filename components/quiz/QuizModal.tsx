"use client";

import { useQuiz } from "@/contexts/QuizContext";
import { X } from "lucide-react";
import { useState } from "react";
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
    // resetQuiz, // Removing unused variable
    getCurrentQuestion,
    getPreviousAnswer,
  } = useQuiz();

  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getPreviousAnswer(state.currentQuestionIndex);
  const progress =
    ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  if (!state.isOpen || !currentQuestion) {
    return null;
  }

  if (state.isCompleted) {
    return <QuizResults />;
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

    setTimeout(() => {
      setIsAutoAdvancing(false);
      if (!state.isCompleted && !state.isRejected) {
        nextQuestion();
      }
    }, 300);
  };
  return (
    <div className="fixed inset-0 z-50 bg-(--color-grandfather-lightest) text-black">
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
            />
          </div>
        </div>
        {/* Content - scrollable middle section */}
        <div className="scrollbar-hide no-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto flex flex-col items-center gap-4 text-(--color-father) md:w-120">
            {/* Question */}
            <div className="m-6 text-2xl font-bold">
              <h1>{currentQuestion.question}</h1>
            </div>
            {/* Options */}
            <div className={`w-full p-6 ${containerClass}`}>
              {currentQuestion.options.map((option, index) => (
                <QuizOption
                  key={index}
                  option={option}
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
              onClick={() => previousQuestion()}
              disabled={state.currentQuestionIndex === 0}
              size="small"
            >
              Previous
            </Button>

            <Button
              variant="primary"
              onClick={() => nextQuestion()}
              disabled={!currentAnswer || isAutoAdvancing}
              size="small"
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
