import { Pool } from "pg";
import { getPool } from "../config/database";

export interface User {
  id: string;
  email: string;
  name: string;
  google_id: string;
  created_at: Date;
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const pool = await getPool();
  const result = await pool.query(
    "INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *",
    [userData.email, userData.name, userData.google_id]
  );
  return result.rows[0];
};
