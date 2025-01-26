import { getPool } from "../config/database";
import * as fs from "fs";
import * as path from "path";

async function runMigrations() {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    // Create migrations table if it doesn't exist
    await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Read migration files
    const migrationsDir = path.join(__dirname);
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    // Execute each migration
    for (const file of files) {
      const migrationName = file;

      // Check if migration was already executed
      const { rows } = await client.query(
        "SELECT id FROM migrations WHERE name = $1",
        [migrationName]
      );

      if (rows.length === 0) {
        // Execute migration
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
        await client.query(sql);

        // Record migration
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [
          migrationName,
        ]);

        console.log(`Executed migration: ${migrationName}`);
      }
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { runMigrations };
