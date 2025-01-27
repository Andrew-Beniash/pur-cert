import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Login from "@/app/login/page";
import { act } from "react-dom/test-utils";

jest.mock("next-auth/react");

describe("Login Page", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
  });

  it("shows loading spinner when status is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<Login />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error message when sign in fails", async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error("Sign in failed"));

    render(<Login />);
    const signInButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });

    await act(async () => {
      fireEvent.click(signInButton);
    });

    expect(
      screen.getByText(/An unexpected error occurred/i)
    ).toBeInTheDocument();
  });

  it("redirects to dashboard on successful sign in", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<Login />);
    const signInButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });

    await act(async () => {
      fireEvent.click(signInButton);
    });

    expect(signIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/dashboard",
    });
  });

  it("handles sign out with callback URL", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test User" } },
      status: "authenticated",
    });

    render(<Login />);
    const signOutButton = screen.getByRole("button", { name: /sign out/i });

    await act(async () => {
      fireEvent.click(signOutButton);
    });

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});
