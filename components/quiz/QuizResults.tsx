"use client";

import { useQuiz } from "@/contexts/QuizContext";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";
import Logo from "@/components/ui/Logo";

export function QuizResults() {
  const { state, closeQuiz, resetQuiz } = useQuiz();

  // Check for rejection

  const isRejected = state.answers.some(
    (answer) => answer.selectedOption.isRejection,
  );

  const handleTryAgain = () => {
    resetQuiz();
  };

  return (
    <div className="fixed inset-0 z-50 bg-(--color-grandfather-lightest) text-black">
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:p-6">
          <div></div>
          <Logo size="small" />
          <button
            onClick={closeQuiz}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        {/* Results Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto flex flex-col items-center gap-6 p-6 text-(--color-father) md:w-120">
            {/* Results Message */}

            {isRejected ? (
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold">
                  {" "}
                  Unfortunately, we are unable to prescribe this medication for
                  you.
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                  This is because finasteride can alter the PSA levels, which
                  may be used to monitor for cancer. You should discuss this
                  further with your GP or specialist if you would still like
                  this medication.{" "}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold"> Great news!</h1>
                <p>
                  We have the perfect treatment for your hair loss. Proceed to{" "}
                  <a
                    href="https://www.manual.co"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.manual.co
                  </a>
                  , and prepare to say hello to your new hair!
                </p>
              </div>
            )}
            {/* Results Summary */}
            {!isRejected && (
              <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">Your Answers:</h2>
                {state.answers.map((answer, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="mb-1 text-sm text-gray-600">
                      Question {answer.questionIndex + 1}
                    </div>
                    <div className="font-medium">
                      {/* Display the alt text for the image if present */}
                      {answer.selectedOption.display.includes("<img")
                        ? answer.selectedOption.display.match(/alt="([^"]*)"/)
                          ? answer.selectedOption.display.match(
                              /alt="([^"]*)"/,
                            )![1]
                          : "Image selected"
                        : answer.selectedOption.display}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <Button variant="outline" onClick={handleTryAgain}>
                Try Again
              </Button>
              <Button variant="primary" onClick={closeQuiz}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
