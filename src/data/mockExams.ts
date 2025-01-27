// src/data/mockExams.ts
import type { Exam } from "../types/dashboard";

export const mockExams: Exam[] = [
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
  {
    id: 3,
    title: "CompTIA A+",
    totalQuestions: 90,
    timeLimit: 90,
  },
  {
    id: 4,
    title: "CISSP",
    totalQuestions: 100,
    timeLimit: 180,
  },
  {
    id: 5,
    title: "PMP Certification",
    totalQuestions: 180,
    timeLimit: 230,
  },
  {
    id: 6,
    title: "Google Cloud Associate Engineer",
    totalQuestions: 50,
    timeLimit: 120,
  },
];
