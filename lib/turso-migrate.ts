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

    const extraTables = [
      `CREATE TABLE IF NOT EXISTS "TradeInPriceCache" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "modelId" TEXT NOT NULL,
        "searchQuery" TEXT NOT NULL,
        "source" TEXT NOT NULL,
        "medianResale" INTEGER,
        "buybackEstimate" INTEGER,
        "sampleCount" INTEGER NOT NULL DEFAULT 0,
        "rawPrices" TEXT,
        "scrapeError" TEXT,
        "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS "TradeInSyncRun" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "status" TEXT NOT NULL,
        "modelsTotal" INTEGER NOT NULL,
        "modelsOk" INTEGER NOT NULL,
        "modelsFailed" INTEGER NOT NULL,
        "details" TEXT,
        "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "finishedAt" DATETIME
      )`,
      `CREATE TABLE IF NOT EXISTS "StoreItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL DEFAULT '',
        "category" TEXT NOT NULL,
        "buyPriceCents" INTEGER NOT NULL DEFAULT 0,
        "sellPriceCents" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 0,
        "visibleOnStore" INTEGER NOT NULL DEFAULT 1,
        "specs" TEXT,
        "imageUrl" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS "StorePack" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL DEFAULT '',
        "sellPriceCents" INTEGER NOT NULL,
        "visibleOnStore" INTEGER NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS "StorePackItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "packId" TEXT NOT NULL,
        "itemId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY ("packId") REFERENCES "StorePack"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("itemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "StorePackItem_packId_itemId_key" ON "StorePackItem"("packId", "itemId")`,
    ];

    for (const statement of extraTables) {
      await client.execute(statement);
    }
  })();

  return migrationPromise;
}
