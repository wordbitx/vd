import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// The live application data layer is src/lib/hospital-db.ts (built-in SQLite).
// This Postgres/Drizzle entrypoint is kept for a future managed-Postgres
// migration; it is created lazily so importing it never crashes the app when
// DATABASE_URL is not configured.
const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export function getPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the Postgres connection");
  }
  globalForDb.__arenaNextJsPostgresqlPool ??= new Pool({ connectionString: databaseUrl });
  return globalForDb.__arenaNextJsPostgresqlPool;
}

export function getDb() {
  return drizzle(getPool());
}
