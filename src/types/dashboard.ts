export interface Exam {
  id: number;
  title: string;
  totalQuestions: number;
  timeLimit: number;
}

export interface ExamAnswer {
  questionId: number;
  selectedOption: number;
}

export interface ExamResult {
  examId: number;
  answers: ExamAnswer[];
  timeSpent: number;
  completedAt: Date;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
}

export interface ExamSummary {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  answers: DetailedAnswer[];
}

export interface DetailedAnswer {
  questionId: number;
  questionText: string;
  selectedOption: number;
  correctAnswer: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswerText: string;
}
