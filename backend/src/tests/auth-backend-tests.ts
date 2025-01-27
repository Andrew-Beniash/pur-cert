import { createUser } from "../models/user.model";
import { handleGoogleAuth } from "../controllers/auth.controller";
import { Request, Response } from "express";
import { getPool } from "../config/database";

jest.mock("../config/database", () => ({
  getPool: jest.fn(() => ({
    query: jest.fn(),
  })),
}));

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
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
      email: "test@example.com",
      name: "Test User",
      google_id: "12345",
    };

    const mockPool = await getPool();
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      user: mockUser,
    });
  });

  it("should handle invalid user data", async () => {
    mockReq.body = { user: {}, account: {} };

    await handleGoogleAuth(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid user data" });
  });
});
