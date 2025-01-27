import { Suspense } from "react";
import Dashboard from "../components/ClientDashboard";
import { mockExams } from "../data/mockExams";

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
