-- Train Suite — cloud backup for revenue, quotes, invoices, interventions

CREATE TABLE IF NOT EXISTS "SuiteBusinessRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    FOREIGN KEY ("workspaceId") REFERENCES "SuiteWorkspace"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "SuiteBusinessRecord_workspaceId_kind_externalId_key"
  ON "SuiteBusinessRecord"("workspaceId", "kind", "externalId");
CREATE INDEX IF NOT EXISTS "SuiteBusinessRecord_workspaceId_kind_updatedAt_idx"
  ON "SuiteBusinessRecord"("workspaceId", "kind", "updatedAt");
