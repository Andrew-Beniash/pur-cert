"use client";

import React, { useState, useMemo } from "react";
import { DetailedExam, mockExam } from "../../data/mockExams";
import { Exam, ExamResult } from "../../types/dashboard";
import ExamPractice from "./ExamPractice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface DashboardProps {
  exams: Exam[];
}

const Dashboard: React.FC<DashboardProps> = ({ exams }) => {
  const [selectedExam, setSelectedExam] = useState<DetailedExam | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(mockExam);
    setExamResult(null);
  };

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result);
  };

  const handleReturnToDashboard = () => {
    setSelectedExam(null);
    setExamResult(null);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) =>
      exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exams, searchQuery]);

  if (selectedExam && !examResult) {
    return <ExamPractice exam={selectedExam} onComplete={handleExamComplete} />;
  }

  if (examResult && selectedExam) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6"
          data-testid="exam-summary"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Exam Complete: {selectedExam.title}
            </h1>
            <button
              onClick={handleReturnToDashboard}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>

          <div className="grid gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">
                Performance Summary
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                  <p className="text-2xl font-medium">
                    {examResult.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
                  <p className="text-2xl font-medium">
                    {examResult.correctAnswers}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Spent</p>
                  <p className="text-2xl font-medium">
                    {formatTime(examResult.timeSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Final Score</p>
                  <p className="text-2xl font-medium" data-testid="exam-score">
                    {examResult.score}%
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Question Review</h2>
              {selectedExam.questions.map((question, index) => {
                const userAnswer = examResult.answers.find(
                  (answer) => answer.questionId === question.id
                );
                const isCorrect =
                  userAnswer?.selectedOption === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className="p-6 border border-gray-200 rounded-lg"
                    data-testid={`question-${question.id}-result`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-4">
                          Question {index + 1}: {question.text}
                        </p>
                        <div className="space-y-2 ml-4">
                          <div
                            className={`p-3 rounded-lg ${
                              isCorrect ? "bg-green-50" : "bg-red-50"
                            }`}
                          >
                            <p
                              className={`font-medium ${
                                isCorrect ? "text-green-700" : "text-red-700"
                              }`}
                            >
                              Your Answer:{" "}
                              {
                                question.options[
                                  userAnswer?.selectedOption || 0
                                ]
                              }
                            </p>
                          </div>
                          {!isCorrect && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="font-medium text-green-700">
                                Correct Answer:{" "}
                                {question.options[question.correctAnswer]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Available Certification Exams
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {filteredExams.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">
                {searchQuery
                  ? "No exams found matching your search"
                  : "No exams available at the moment"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {exam.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <span className="mr-2">•</span>
                          {exam.totalQuestions} questions
                        </span>
                        <span className="flex items-center">
                          <span className="mr-2">•</span>
                          {exam.timeLimit} minutes
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
