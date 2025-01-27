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
}
