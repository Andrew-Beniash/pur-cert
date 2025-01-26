import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

let pool: Pool | null = null;

const getPool = async (): Promise<Pool> => {
  if (pool) return pool;

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
  });

  try {
    const client = await pool.connect();
    client.release();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }

  return pool;
};

const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

export { getPool, closePool };
