import { Express } from "express";
import request from "supertest";
import { setupServer } from "../server";
import { getPool, closePool } from "../config/database";

describe("OAuth Routes", () => {
  let app: Express;

  beforeAll(async () => {
    await getPool();
    app = await setupServer();
  });

  afterAll(async () => {
    await closePool();
  });

  describe("GET /auth/google", () => {
    it("should redirect to Google login", async () => {
      const response = await request(app).get("/auth/google");
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain("accounts.google.com");
    });
  });

  describe("GET /auth/google/callback", () => {
    it("should handle successful callback", async () => {
      const mockCode = "valid_code";
      const response = await request(app)
        .get("/auth/google/callback")
        .query({ code: mockCode });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should handle failed callback", async () => {
      const response = await request(app)
        .get("/auth/google/callback")
        .query({ error: "access_denied" });

      expect(response.status).toBe(401);
    });
  });
});
