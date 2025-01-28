import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoginPage from "@/app/login/page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe("Login Integration Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <SessionProvider session={null}>{component}</SessionProvider>
    );
  };

  test("renders login page correctly", () => {
    renderWithProvider(<LoginPage />);
    expect(
      screen.getByRole("button", { name: /sign in with google/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  test("initiates Google sign in when button is clicked", async () => {
    renderWithProvider(<LoginPage />);
    const signInButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
    });
  });

  test("displays error message when auth fails", () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => "AccessDenied",
    }));

    renderWithProvider(<LoginPage />);
    expect(
      screen.getByText("You do not have permission to sign in")
    ).toBeInTheDocument();
  });

  test("displays generic error for unknown error types", () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => "UnknownError",
    }));

    renderWithProvider(<LoginPage />);
    expect(
      screen.getByText("An error occurred while signing in")
    ).toBeInTheDocument();
  });

  test("successful authentication redirects to dashboard", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { email: "test@example.com" },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      status: "authenticated",
    });

    renderWithProvider(<LoginPage />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});
