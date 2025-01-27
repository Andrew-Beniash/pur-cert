import { render, screen, fireEvent, act } from "@testing-library/react";
import ExamPractice from "../components/client/ExamPractice";
import { mockExam } from "../data/mockExams";
import "@testing-library/jest-dom";

describe("ExamPractice Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the exam practice screen with initial question", () => {
    render(<ExamPractice exam={mockExam} onComplete={() => {}} />);

    expect(
      screen.getByText(`Question 1/${mockExam.questions.length}`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockExam.questions[0].text)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("displays timer counting down", () => {
    render(<ExamPractice exam={mockExam} onComplete={() => {}} />);

    const timer = screen.getByTestId("exam-timer");
    expect(timer).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(timer).toHaveTextContent("59:59");
  });

  it("handles navigation between questions correctly", () => {
    render(<ExamPractice exam={mockExam} onComplete={() => {}} />);

    // Previous button should be disabled on first question
    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();

    // Navigate to next question
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // Previous button should be enabled on second question
    expect(previousButton).not.toBeDisabled();

    // Navigate back to first question
    fireEvent.click(previousButton);
    expect(screen.getByText("Question 1/")).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });

  it("allows selecting an answer and moving to next question", () => {
    render(<ExamPractice exam={mockExam} onComplete={() => {}} />);

    const firstAnswer = screen.getByText(mockExam.questions[0].options[0]);
    fireEvent.click(firstAnswer);
    expect(firstAnswer.parentElement).toHaveClass("bg-blue-100");

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(
      screen.getByText(`Question 2/${mockExam.questions.length}`)
    ).toBeInTheDocument();
  });

  it("shows completion screen when all questions are answered", () => {
    const onCompleteMock = jest.fn();
    render(<ExamPractice exam={mockExam} onComplete={onCompleteMock} />);

    // Answer all questions
    mockExam.questions.forEach((_, index) => {
      const answer = screen.getByText(mockExam.questions[index].options[0]);
      fireEvent.click(answer);

      const nextButton = screen.getByRole("button", {
        name: index === mockExam.questions.length - 1 ? /finish/i : /next/i,
      });
      fireEvent.click(nextButton);
    });

    expect(onCompleteMock).toHaveBeenCalled();
  });

  it("automatically submits when timer reaches zero", () => {
    const onCompleteMock = jest.fn();
    render(<ExamPractice exam={mockExam} onComplete={onCompleteMock} />);

    act(() => {
      jest.advanceTimersByTime(mockExam.timeLimit * 60 * 1000);
    });

    expect(onCompleteMock).toHaveBeenCalled();
  });
});
