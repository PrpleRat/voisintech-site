-- CreateTable
CREATE TABLE IF NOT EXISTS "SuiteServiceType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultDurationMinutes" INTEGER NOT NULL DEFAULT 60,
    "defaultPriceCents" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "matchDeviceTypes" TEXT NOT NULL DEFAULT '[]',
    "matchKeywords" TEXT NOT NULL DEFAULT '[]',
    "quoteRole" TEXT NOT NULL DEFAULT '',
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SuiteServiceType_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "SuiteWorkspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "SuiteServiceType_workspaceId_name_key" ON "SuiteServiceType"("workspaceId", "name");
CREATE INDEX IF NOT EXISTS "SuiteServiceType_workspaceId_sortOrder_idx" ON "SuiteServiceType"("workspaceId", "sortOrder");
