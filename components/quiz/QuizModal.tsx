"use client";

import { useQuiz } from "@/contexts/QuizContext";
import { X } from "lucide-react";
import { useState } from "react";

export function QuizModal() {
  const {
    state,
    closeQuiz,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    answerQuestion,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousQuestion,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetQuiz,
    getCurrentQuestion,
    getPreviousAnswer,
  } = useQuiz();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  const currentQuestion = getCurrentQuestion();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentAnswer = getPreviousAnswer(state.currentQuestionIndex);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const progress =
    ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  if (!state.isOpen || !currentQuestion) {
    return null;
  }

  const handleClose = () => {
    closeQuiz();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white text-black">
      <div className="flex h-full w-full">
        <div className="relative h-full w-full overflow-y-auto bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 md:p-6">
            <h2 className="text-xl font-semibold text-black">Quiz</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            <p className="text-black">Basic quiz modal - opens and closes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
