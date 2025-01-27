"use client";

import React from "react";

interface ExamTimerProps {
  timeRemaining: number;
  isWarning?: boolean;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
  timeRemaining,
  isWarning = false,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      data-testid="exam-timer"
      className={`text-lg font-mono px-4 py-2 rounded-md flex items-center gap-2 ${
        isWarning ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
      }`}
      role="timer"
      aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      {formatTime(timeRemaining)}
    </div>
  );
};

export default ExamTimer;
