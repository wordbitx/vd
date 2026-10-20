import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Postgres is optional in this build: the running app uses the JSON document store so the
 * portal and console work on any host. This module is the switch-over point for production.
 */
let pool: Pool | null = null;

export function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required to use Postgres. The JSON store is active instead.");
  if (!pool) {
    pool = new Pool({ connectionString: url, max: 10 });
  }
  return pool;
}

export function getDb() {
  return drizzle(getPool());
}
