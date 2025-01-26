import { Pool } from "pg";
import * as dotenv from "dotenv";
import { getPool, closePool } from "../config/database";

dotenv.config();

describe("Database Connection", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = await getPool();
  });

  afterAll(async () => {
    await closePool();
  });

  it("should connect to database", async () => {
    const client = await pool.connect();
    expect(client).toBeDefined();
    client.release();
  });

  it("should create and retrieve a test user", async () => {
    const client = await pool.connect();
    try {
      const createResult = await client.query(
        "INSERT INTO users(email, name) VALUES($1, $2) RETURNING *",
        ["test@example.com", "Test User"]
      );
      expect(createResult.rows[0].email).toBe("test@example.com");

      const getResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        ["test@example.com"]
      );
      expect(getResult.rows[0].name).toBe("Test User");
    } finally {
      await client.query("DELETE FROM users WHERE email = $1", [
        "test@example.com",
      ]);
      client.release();
    }
  });

  it("should handle connection pooling", async () => {
    const clients = await Promise.all([
      pool.connect(),
      pool.connect(),
      pool.connect(),
    ]);

    expect(clients.length).toBe(3);
    clients.forEach((client) => client.release());
  });
});
