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

function loadSchemaStatements() {
  const schemaPath = path.join(__dirname, "turso-schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function setupTurso() {
  const turso = getTursoConfig();

  if (!turso) {
    if (process.env.VERCEL === "1") {
      console.error(
        "[DB] ERREUR: Build Vercel sans Turso. Ajoutez TURSO_AUTH_TOKEN + TURSO_DATABASE_URL (disponibles au BUILD)."
      );
      process.exit(1);
    }
    console.log("[DB] Pas de Turso — migration locale Prisma");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    return;
  }

  console.log("[DB] Migration Turso:", turso.url);
  const client = createClient({ url: turso.url, authToken: turso.authToken });
  const statements = loadSchemaStatements();

  for (const statement of statements) {
    await client.execute(statement);
    console.log("[DB] OK:", statement.slice(0, 60) + "...");
  }

  console.log("[DB] Turso prêt — 3 tables créées.");
}

setupTurso().catch((err) => {
  console.error("[DB] Erreur:", err);
  process.exit(1);
});
