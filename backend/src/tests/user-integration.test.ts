import { Pool } from "pg";
import { createUser, User } from "../models/user.model";
import { getPool } from "../config/database";

describe("User Database Integration", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = await getPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    // Clean up users table before each test
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%test%"]);
  });

  it("should create a new user successfully", async () => {
    const userData: Partial<User> = {
      email: "test.create@example.com",
      name: "Test Create User",
      google_id: "google_123",
    };

    const user = await createUser(userData);

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.google_id).toBe(userData.google_id);
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it("should update existing user when google_id already exists", async () => {
    const initialUserData: Partial<User> = {
      email: "test.update@example.com",
      name: "Test Update User",
      google_id: "google_456",
    };

    await createUser(initialUserData);

    const updatedUserData: Partial<User> = {
      email: "test.updated@example.com",
      name: "Updated Name",
      google_id: "google_456",
    };

    const updatedUser = await createUser(updatedUserData);

    expect(updatedUser.email).toBe(updatedUserData.email);
    expect(updatedUser.name).toBe(updatedUserData.name);
    expect(updatedUser.google_id).toBe(updatedUserData.google_id);
  });

  it("should handle null name gracefully", async () => {
    const userData: Partial<User> = {
      email: "test.null@example.com",
      name: null,
      google_id: "google_789",
    };

    const user = await createUser(userData);

    expect(user.name).toBeNull();
  });

  it("should throw error when required fields are missing", async () => {
    const invalidUserData: Partial<User> = {
      email: "test.invalid@example.com",
      // missing google_id
    };

    await expect(createUser(invalidUserData)).rejects.toThrow();
  });
});
