import { Exam } from "../types/dashboard";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface DetailedExam extends Exam {
  questions: Question[];
}

export const mockExam: DetailedExam = {
  id: 1,
  title: "Sample Certification Exam",
  totalQuestions: 3,
  timeLimit: 60,
  questions: [
    {
      id: 1,
      text: "What is the primary purpose of a RESTful API?",
      options: [
        "To provide a standardized way for applications to communicate",
        "To create user interfaces",
        "To store data in a database",
        "To manage server hardware",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      text: "Which HTTP method is used to retrieve data from a server?",
      options: ["POST", "GET", "PUT", "DELETE"],
      correctAnswer: 1,
    },
    {
      id: 3,
      text: "What does JWT stand for?",
      options: [
        "Java Web Token",
        "JavaScript Web Token",
        "JSON Web Token",
        "JSON With Type",
      ],
      correctAnswer: 2,
    },
  ],
};

export const mockExams: Exam[] = [
  {
    id: 1,
    title: "Sample Certification Exam",
    totalQuestions: 3,
    timeLimit: 60,
  },
  {
    id: 2,
    title: "Advanced Web Development",
    totalQuestions: 5,
    timeLimit: 90,
  },
];
