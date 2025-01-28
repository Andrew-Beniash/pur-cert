import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import request from "supertest";
import { app } from "../server";
import { createUser, User } from "../models/user.model";

// Mock environment variables
process.env.GOOGLE_CLIENT_ID = "test-client-id";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:3000/auth/google/callback";

// Mock the createUser function
jest.mock("../models/user.model");
const mockedCreateUser = jest.mocked(createUser);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /auth/google", () => {
    it("should redirect to Google OAuth URL", async () => {
      const response = await request(app).get("/auth/google");

      expect(response.status).toBe(302); // Redirect status
      expect(response.header.location).toContain(
        "accounts.google.com/o/oauth2/v2/auth"
      );
      expect(response.header.location).toContain("test-client-id");
    });
  });

  describe("GET /auth/google/callback", () => {
    it("should handle valid authorization code", async () => {
      const response = await request(app)
        .get("/auth/google/callback")
        .query({ code: "valid-auth-code" });

      expect(response.status).toBe(302); // Redirect status
      expect(response.header.location).toBe("/auth/success");
    });

    it("should handle missing authorization code", async () => {
      const response = await request(app).get("/auth/google/callback");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Invalid authorization code",
      });
    });
  });

  describe("POST /auth/google/user", () => {
    it("should create a new user with valid Google data", async () => {
      const mockUser = {
        email: "test@example.com",
        name: "Test User",
      };

      const mockAccount = {
        providerAccountId: "google123",
      };

      const mockDbUser: User = {
        id: "1",
        email: mockUser.email,
        name: mockUser.name,
        google_id: mockAccount.providerAccountId,
        created_at: new Date(),
      };

      mockedCreateUser.mockResolvedValueOnce(mockDbUser);

      const response = await request(app)
        .post("/auth/google/user")
        .send({ user: mockUser, account: mockAccount });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        user: expect.objectContaining({
          email: mockUser.email,
          name: mockUser.name,
          google_id: mockAccount.providerAccountId,
        }),
      });

      expect(mockedCreateUser).toHaveBeenCalledWith({
        email: mockUser.email,
        name: mockUser.name,
        google_id: mockAccount.providerAccountId,
      });
    });

    it("should return 400 if email is missing", async () => {
      const mockUser = {
        name: "Test User",
      };

      const mockAccount = {
        providerAccountId: "google123",
      };

      const response = await request(app)
        .post("/auth/google/user")
        .send({ user: mockUser, account: mockAccount });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Invalid user data",
      });
      expect(mockedCreateUser).not.toHaveBeenCalled();
    });

    it("should return 500 if database operation fails", async () => {
      const mockUser = {
        email: "test@example.com",
        name: "Test User",
      };

      const mockAccount = {
        providerAccountId: "google123",
      };

      mockedCreateUser.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/auth/google/user")
        .send({ user: mockUser, account: mockAccount });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Failed to store user data",
      });
      expect(mockedCreateUser).toHaveBeenCalledWith({
        email: mockUser.email,
        name: mockUser.name,
        google_id: mockAccount.providerAccountId,
      });
    });
  });
});
