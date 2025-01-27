import { Pool } from "pg";
import { getPool } from "../config/database";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  google_id: string;
  created_at: Date;
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const pool = await getPool();
  try {
    const result = await pool.query(
      `INSERT INTO users (email, name, google_id) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (google_id) 
       DO UPDATE SET name = $2, email = $1
       RETURNING *`,
      [userData.email, userData.name ?? null, userData.google_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
};
