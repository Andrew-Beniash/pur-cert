import { Exam } from "../types/dashboard";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
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
      explanation:
        "RESTful APIs provide a standardized architectural style for web services. They use HTTP methods and follow principles like statelessness, making them ideal for application communication across the internet.",
    },
    {
      id: 2,
      text: "Which HTTP method is used to retrieve data from a server?",
      options: ["POST", "GET", "PUT", "DELETE"],
      correctAnswer: 1,
      explanation:
        "GET is the HTTP method specifically designed for retrieving data from a server. It is safe and idempotent, meaning it should not modify server data and multiple identical requests should have the same effect as a single request.",
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
      explanation:
        "JWT stands for JSON Web Token. It is a compact, URL-safe means of representing claims between two parties. JWTs are commonly used for authentication and information exchange in web applications.",
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
