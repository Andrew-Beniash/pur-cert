import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool | null = null;

export const getPool = async (): Promise<Pool> => {
  if (pool) return pool;

  const isProduction = process.env.NODE_ENV === "production";

  const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
    // Only use SSL in production
    ssl: isProduction
      ? {
          rejectUnauthorized: false,
        }
      : false,
  };

  pool = new Pool(config);

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
