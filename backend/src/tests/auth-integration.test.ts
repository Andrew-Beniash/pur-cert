import request from "supertest";
import { app } from "../server";
import { getPool } from "../config/database";

// Mock database functions
jest.mock("../config/database", () => ({
  getPool: jest.fn(),
}));

describe("Auth API Integration Tests", () => {
  // Mock pool implementation
  const mockPool = {
    query: jest.fn(),
    // Add a mock end method
    end: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getPool as jest.Mock).mockResolvedValue(mockPool);
  });

  afterAll(async () => {
    const pool = await getPool();
    await pool.end();
  });

  describe("POST /auth/google/user", () => {
    const mockUserData = {
      user: {
        email: "test@example.com",
        name: "Test User",
      },
      account: {
        providerAccountId: "google123",
      },
    };

    test("successfully creates new user", async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: "1",
            email: "test@example.com",
            name: "Test User",
            google_id: "google123",
            created_at: new Date(),
          },
        ],
      });

      const response = await request(app)
        .post("/auth/google/user")
        .send(mockUserData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe("test@example.com");
      expect(mockPool.query).toHaveBeenCalled();
    });

    test("handles missing user data", async () => {
      const response = await request(app).post("/auth/google/user").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid user data");
    });

    test("handles database errors", async () => {
      mockPool.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/auth/google/user")
        .send(mockUserData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to store user data");
    });
  });

  describe("GET /auth/google", () => {
    test("redirects to Google OAuth URL", async () => {
      const response = await request(app).get("/auth/google");

      expect(response.status).toBe(302);
      expect(response.header.location).toContain(
        "accounts.google.com/o/oauth2/v2/auth"
      );
      expect(response.header.location).toContain("client_id=");
    });
  });

  describe("GET /auth/google/callback", () => {
    test("handles successful callback", async () => {
      const response = await request(app)
        .get("/auth/google/callback")
        .query({ code: "valid_code" });

      expect(response.status).toBe(302);
      expect(response.header.location).toBe("/auth/success");
    });

    test("handles callback without code", async () => {
      const response = await request(app).get("/auth/google/callback");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid authorization code");
    });
  });
});
