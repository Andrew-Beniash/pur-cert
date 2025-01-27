import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navigation from "../components/Navigation";
import { useSession, signOut } from "next-auth/react";

// Mock next/auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
}));

describe("Navigation Component", () => {
  it("renders the logo and dashboard link", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<Navigation />);
    expect(screen.getByText(/PurCert/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("shows login button for unauthenticated users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<Navigation />);
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign out/i)).not.toBeInTheDocument();
  });

  it("shows logout button for authenticated users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Test User", email: "test@example.com" },
        expires: "2024-01-01",
      },
      status: "authenticated",
    });

    render(<Navigation />);
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign in/i)).not.toBeInTheDocument();
  });

  it("displays user name when authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Test User", email: "test@example.com" },
        expires: "2024-01-01",
      },
      status: "authenticated",
    });

    render(<Navigation />);
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  it("handles mobile menu toggle", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<Navigation />);
    const menuButton = screen.getByLabelText(/toggle menu/i);

    // Menu should be hidden initially on mobile
    expect(screen.getByTestId("mobile-menu")).toHaveClass("hidden");

    // Click to open menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId("mobile-menu")).not.toHaveClass("hidden");

    // Click again to close
    fireEvent.click(menuButton);
    expect(screen.getByTestId("mobile-menu")).toHaveClass("hidden");
  });

  it("calls signOut when logout is clicked", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Test User", email: "test@example.com" },
        expires: "2024-01-01",
      },
      status: "authenticated",
    });

    render(<Navigation />);
    const signOutButton = screen.getByText(/Sign out/i);
    fireEvent.click(signOutButton);
    expect(signOut).toHaveBeenCalled();
  });
});
