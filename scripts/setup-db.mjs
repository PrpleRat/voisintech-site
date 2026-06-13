import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getTursoConfig() {
  const url =
    process.env.TURSO_DATABASE_URL ||
    (process.env.DATABASE_URL?.startsWith("libsql://")
      ? process.env.DATABASE_URL.split("?")[0]
      : null);

  let authToken = process.env.TURSO_AUTH_TOKEN;

  if (!authToken && process.env.DATABASE_URL?.includes("authToken=")) {
    const match = process.env.DATABASE_URL.match(/authToken=([^&]+)/);
    authToken = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  }

  if (url && authToken) return { url, authToken };
  return null;
}

async function setupTurso() {
  const turso = getTursoConfig();

  if (!turso) {
    console.log("[DB] Pas de Turso — migration locale Prisma");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    return;
  }

  console.log("[DB] Configuration Turso:", turso.url);
  const client = createClient({ url: turso.url, authToken: turso.authToken });

  const migrationPath = path.join(
    __dirname,
    "..",
    "prisma",
    "migrations",
    "20260613114607_init",
    "migration.sql"
  );
  const sql = fs.readFileSync(migrationPath, "utf8");

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    try {
      await client.execute(statement);
      console.log("[DB] OK:", statement.slice(0, 50) + "...");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("already exists")) {
        console.log("[DB] Table déjà existante — OK");
      } else {
        throw err;
      }
    }
  }

  console.log("[DB] Turso prêt.");
}

setupTurso().catch((err) => {
  console.error("[DB] Erreur:", err);
  process.exit(1);
});
