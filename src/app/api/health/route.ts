import { sql } from "drizzle-orm";
import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

/**
 * Health probe used by the platform and by the clinic before a demo.
 * The runtime store is the JSON document store, so this never depends on Postgres being up.
 */
export async function GET() {
  const dir = process.env.JVH_DATA_DIR ?? path.join(process.cwd(), ".data");
  let store: Record<string, string> = {};
  try {
    const files = await fs.readdir(dir);
    for (const file of files.filter((f) => f.endsWith(".json")).slice(0, 20)) {
      const stat = await fs.stat(path.join(dir, file));
      store[file.replace(".json", "")] = `${(stat.size / 1024).toFixed(1)} kB`;
    }
  } catch {
    store = { status: "not seeded yet — it is created on the first request" };
  }

  return Response.json({
    ok: true,
    service: "Jawad Veterinary Hospital",
    time: new Date().toISOString(),
    runtime: { node: process.version, store: "json-documents", databaseUrlConfigured: Boolean(process.env.DATABASE_URL) },
    collections: store,
    uptimeSeconds: Math.round(process.uptime()),
  });
}

/** Optional Postgres check, used when a real database is wired up. */
export async function POST() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: false, message: "DATABASE_URL is not configured; the JSON store is in use." }, { status: 400 });
  }
  try {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 4000 });
    const db = drizzle(pool);
    await db.execute(sql`select 1`);
    await pool.end();
    return Response.json({ ok: true, database: "reachable" });
  } catch (error) {
    return Response.json({ ok: false, message: error instanceof Error ? error.message : "Database unreachable" }, { status: 503 });
  }
}
