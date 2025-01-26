import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { AuthProvider } from "../components/providers/AuthProvider";
import { Session } from "next-auth";

jest.mock("next-auth/react");

describe("Authentication", () => {
  const mockSession: Session = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { email: "test@example.com", name: "Test User" },
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
  });

  it("should render login button when user is not authenticated", () => {
    render(<AuthProvider>Test</AuthProvider>);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("should render user info when authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });
    render(<AuthProvider>Test</AuthProvider>);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  it("should call signIn when login button is clicked", async () => {
    render(<AuthProvider>Test</AuthProvider>);
    const loginButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(loginButton);
    expect(signIn).toHaveBeenCalledWith("google");
  });

  it("should call signOut when logout button is clicked", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });
    render(<AuthProvider>Test</AuthProvider>);
    const logoutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(logoutButton);
    expect(signOut).toHaveBeenCalled();
  });
});

describe("Google OAuth Flow", () => {
  it("should handle Google OAuth redirect", async () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.status).toBe("unauthenticated");

    await act(async () => {
      await signIn("google");
    });

    expect(signIn).toHaveBeenCalledWith("google", {
      callbackUrl: expect.any(String),
    });
  });

  it("should store user data after successful login", async () => {
    const mockGoogleUser = {
      email: "test@example.com",
      name: "Test User",
      image: "https://example.com/photo.jpg",
    };

    (useSession as jest.Mock).mockReturnValue({
      data: { user: mockGoogleUser },
      status: "authenticated",
    });

    const { result } = renderHook(() => useSession());
    expect(result.current.data?.user).toEqual(mockGoogleUser);
  });
});
