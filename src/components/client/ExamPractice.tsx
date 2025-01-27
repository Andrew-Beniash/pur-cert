"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DetailedExam, Question } from "../../data/mockExams";
import { ExamResult, ExamAnswer } from "../../types/dashboard";
import ExamTimer from "./ExamTimer";

interface ExamPracticeProps {
  exam: DetailedExam;
  onComplete: (result: ExamResult) => void;
}

const ExamPractice: React.FC<ExamPracticeProps> = ({ exam, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<ExamAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(exam.timeLimit * 60);
  const [isExamComplete, setIsExamComplete] = useState(false);

  const currentQuestion: Question = exam.questions[currentQuestionIndex];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateExamScore = useCallback(() => {
    const correctAnswers = selectedAnswers.filter((answer) => {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      return question && question.correctAnswer === answer.selectedOption;
    }).length;

    const totalQuestions = exam.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    return {
      correctAnswers,
      totalQuestions,
      score: Math.round(score),
    };
  }, [exam.questions, selectedAnswers]);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      const existingAnswerIndex = newAnswers.findIndex(
        (answer) => answer.questionId === currentQuestion.id
      );

      const newAnswer: ExamAnswer = {
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
      };

      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = newAnswer;
      } else {
        newAnswers.push(newAnswer);
      }

      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleExamComplete();
    }
  };

  const handleExamComplete = useCallback(() => {
    if (!isExamComplete) {
      setIsExamComplete(true);
      const { correctAnswers, totalQuestions, score } = calculateExamScore();

      const result: ExamResult = {
        examId: exam.id,
        answers: selectedAnswers,
        timeSpent: exam.timeLimit * 60 - timeRemaining,
        completedAt: new Date(),
        correctAnswers,
        totalQuestions,
        score,
      };
      onComplete(result);
    }
  }, [
    exam.id,
    exam.timeLimit,
    isExamComplete,
    onComplete,
    selectedAnswers,
    timeRemaining,
    calculateExamScore,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExamComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleExamComplete]);

  const getCurrentAnswerIndex = () => {
    const currentAnswer = selectedAnswers.find(
      (answer) => answer.questionId === currentQuestion.id
    );
    return currentAnswer?.selectedOption;
  };

  if (isExamComplete) {
    const { correctAnswers, totalQuestions, score } = calculateExamScore();

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6"
          data-testid="exam-summary"
        >
          <h1 className="text-2xl font-bold mb-6">Exam Complete</h1>

          <div className="grid gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Total Questions</p>
                  <p className="text-xl font-medium">{totalQuestions}</p>
                </div>
                <div>
                  <p className="text-gray-600">Correct Answers</p>
                  <p className="text-xl font-medium">{correctAnswers}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time Spent</p>
                  <p className="text-xl font-medium">
                    {formatTime(exam.timeLimit * 60 - timeRemaining)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Score</p>
                  <p className="text-xl font-medium" data-testid="exam-score">
                    {score}%
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Detailed Review</h2>
              {exam.questions.map((question, index) => {
                const userAnswer = selectedAnswers.find(
                  (answer) => answer.questionId === question.id
                );
                const isCorrect =
                  userAnswer?.selectedOption === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className="p-4 border rounded-lg"
                    data-testid={`question-${question.id}-result`}
                  >
                    <p className="font-medium mb-2">
                      Question {index + 1}: {question.text}
                    </p>
                    <div className="ml-4">
                      <p
                        className={`font-medium ${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        Your Answer:{" "}
                        {question.options[userAnswer?.selectedOption || 0]}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600 mt-1">
                          Correct Answer:{" "}
                          {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                (
                {Math.round(
                  ((currentQuestionIndex + 1) / exam.questions.length) * 100
                )}
                % complete)
              </span>
            </div>
            <ExamTimer
              timeRemaining={timeRemaining}
              isWarning={timeRemaining < 300}
            />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / exam.questions.length) * 100
                }%`,
              }}
              role="progressbar"
              aria-valuenow={currentQuestionIndex + 1}
              aria-valuemin={0}
              aria-valuemax={exam.questions.length}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">{currentQuestion.text}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  getCurrentAnswerIndex() === index
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            className="btn-secondary px-6 py-2"
            disabled={currentQuestionIndex === 0}
            aria-label="Go to previous question"
          >
            Previous
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleNext}
              className="btn-primary px-6 py-2"
              aria-label={
                currentQuestionIndex === exam.questions.length - 1
                  ? "Finish exam"
                  : "Go to next question"
              }
            >
              {currentQuestionIndex === exam.questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPractice;
