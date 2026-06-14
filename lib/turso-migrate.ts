import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import { getTursoConfig } from "./turso-config";

let migrationPromise: Promise<void> | null = null;

function loadSchemaStatements() {
  const schemaPath = path.join(process.cwd(), "scripts", "turso-schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function ensureTursoTables() {
  if (migrationPromise) return migrationPromise;

  migrationPromise = (async () => {
    const turso = getTursoConfig();
    if (!turso) return;

    const client = createClient({
      url: turso.url,
      authToken: turso.authToken,
    });

    const statements = loadSchemaStatements();

    for (const statement of statements) {
      await client.execute(statement);
    }

    const alterStatements = [
      `ALTER TABLE QuoteRequest ADD COLUMN scheduledAt DATETIME`,
      `ALTER TABLE QuoteRequest ADD COLUMN scheduledDurationMinutes INTEGER`,
    ];

    for (const statement of alterStatements) {
      try {
        await client.execute(statement);
      } catch {
        // Colonne déjà présente
      }
    }
  })();

  return migrationPromise;
}
