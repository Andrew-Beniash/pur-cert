import { Suspense } from "react";
import Dashboard from "../components/ClientDashboard";
import { SessionProvider } from "next-auth/react";

const mockExams = [
  {
    id: 1,
    title: "AWS Certified Cloud Practitioner",
    totalQuestions: 65,
    timeLimit: 90,
  },
  {
    id: 2,
    title: "Azure Fundamentals AZ-900",
    totalQuestions: 60,
    timeLimit: 85,
  },
];

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <Dashboard exams={mockExams} />
    </Suspense>
  );
}
