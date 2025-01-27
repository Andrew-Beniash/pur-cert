import { Pool } from "pg";
import * as dotenv from "dotenv";
import { getPool, closePool } from "../config/database";

dotenv.config();

jest.setTimeout(30000);

describe("Database Connection", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = await getPool();
  });

  afterAll(async () => {
    await closePool();
  }, 10000);

  it("should connect to database", async () => {
    const result = await pool.query("SELECT NOW()");
    expect(result.rows).toHaveLength(1);
  });

  it("should handle max pool limit", async () => {
    const smallPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 1000,
    });

    const client1 = await smallPool.connect();
    await expect(smallPool.connect()).rejects.toThrow();
    await client1.release();
    await smallPool.end();
  }, 10000);

  it("should handle connection timeouts", async () => {
    const timeoutPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 1,
    });

    await expect(timeoutPool.connect()).rejects.toThrow();
    await timeoutPool.end();
  });
});
