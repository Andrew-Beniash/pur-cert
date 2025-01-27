import { createUser } from "../models/user.model";
import { handleGoogleAuth } from "../controllers/auth.controller";
import { Request, Response } from "express";
import { getPool } from "../config/database";

jest.mock("../config/database", () => ({
  getPool: jest.fn(() => ({
    query: jest.fn(),
  })),
}));

jest.mock("../models/user.model", () => ({
  createUser: jest.fn(),
}));

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockReq = {
      body: {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
        account: {
          providerAccountId: "12345",
        },
      },
    };
  });

  it("should store user data after successful Google authentication", async () => {
    const mockUser = {
      id: "uuid-1",
      email: "test@example.com",
      name: "Test User",
      google_id: "12345",
      created_at: new Date(),
    };

    (createUser as jest.Mock).mockResolvedValueOnce(mockUser);

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(createUser).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
      google_id: "12345",
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      user: mockUser,
    });
  });

  it("should handle invalid user data", async () => {
    mockReq.body = { user: {}, account: {} };

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(createUser).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid user data" });
  });

  it("should handle database errors", async () => {
    (createUser as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Failed to store user data",
    });
  });

  it("should handle missing email", async () => {
    mockReq.body = {
      user: { name: "Test User" },
      account: { providerAccountId: "12345" },
    };

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(createUser).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("should handle missing provider ID", async () => {
    mockReq.body = {
      user: { email: "test@example.com", name: "Test User" },
      account: {},
    };

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(createUser).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
