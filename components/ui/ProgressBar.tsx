"use client";

import React from "react";

export interface ProgressBarProps {
  questionNumber: number; // Current question number
  questionCount: number; // Total number of questions
  progress: number; // Progress value between 0 and 100
}

export function ProgressBar({
  questionNumber,
  questionCount,
  progress,
}: ProgressBarProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Question {questionNumber} of {questionCount}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-(--color-grandfather-dark) transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
