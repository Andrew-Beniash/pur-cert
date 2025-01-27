import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../components/ClientDashboard";
import ClientDashboard from "../components/ClientDashboard";

// Mock next/auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

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

describe("Dashboard Component", () => {
  it("renders the dashboard title", () => {
    render(<ClientDashboard exams={mockExams} />);
    expect(screen.getByText(/Available Certifications/i)).toBeInTheDocument();
  });

  it("displays the exam list", () => {
    render(<Dashboard exams={mockExams} />);
    expect(
      screen.getByText("AWS Certified Cloud Practitioner")
    ).toBeInTheDocument();
    expect(screen.getByText("Azure Fundamentals AZ-900")).toBeInTheDocument();
  });

  it("allows searching for exams", () => {
    render(<Dashboard exams={mockExams} />);
    const searchInput = screen.getByPlaceholderText(/Search certifications/i);
    fireEvent.change(searchInput, { target: { value: "AWS" } });
    expect(
      screen.getByText("AWS Certified Cloud Practitioner")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Azure Fundamentals AZ-900")
    ).not.toBeInTheDocument();
  });

  it("shows login prompt for guest users", () => {
    render(<Dashboard exams={mockExams} />);
    expect(
      screen.getByText(/Sign in to track your progress/i)
    ).toBeInTheDocument();
  });

  it("is responsive on mobile view", () => {
    render(<Dashboard exams={mockExams} />);
    const dashboardContainer = screen.getByTestId("dashboard-container");
    expect(dashboardContainer).toHaveClass("px-4 md:px-8");
  });
});
