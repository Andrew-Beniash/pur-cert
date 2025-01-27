"use client";

import Dashboard from "./client/Dashboard";
import type { Exam } from "../types/dashboard";

interface ClientDashboardProps {
  exams: Exam[];
}

export default function ClientDashboard({ exams }: ClientDashboardProps) {
  return <Dashboard exams={exams} />;
}
