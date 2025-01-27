"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Exam } from "../../types/dashboard";

interface DashboardProps {
  exams: Exam[];
}

const Dashboard = ({ exams }: DashboardProps) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      data-testid="dashboard-container"
      className="min-h-screen bg-gray-50 px-4 md:px-8 py-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Available Certifications
          </h1>

          {!session && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700">
                Sign in to track your progress and save your results
              </p>
            </div>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search certifications..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {exam.title}
              </h3>
              <div className="text-sm text-gray-600">
                <p>Questions: {exam.totalQuestions}</p>
                <p>Time Limit: {exam.timeLimit} minutes</p>
              </div>
              <button className="mt-4 w-full btn-primary">
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
