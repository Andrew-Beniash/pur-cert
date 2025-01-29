import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool | null = null;

export const getPool = async (): Promise<Pool> => {
  if (pool) return pool;

  const isProduction = process.env.NODE_ENV === "production";

  // Use DATABASE_URL for Neon connection
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    // Fallback to local configuration
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432"),
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    });
  }

  // Test the connection
  try {
    const client = await pool.connect();
    console.log("Database connection successful");
    client.release();
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

// Clean up the pool when the application shuts down
process.on("SIGINT", async () => {
  if (pool) {
    await pool.end();
  }
});
