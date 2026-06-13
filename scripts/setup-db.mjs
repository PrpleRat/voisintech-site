import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

async function setupTurso() {
  if (!tursoUrl || !tursoToken) {
    console.log("[DB] Pas de Turso configuré — migration locale Prisma");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    return;
  }

  console.log("[DB] Configuration Turso...");
  const client = createClient({ url: tursoUrl, authToken: tursoToken });

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
