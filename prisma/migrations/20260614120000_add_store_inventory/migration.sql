-- CreateTable
CREATE TABLE "StoreItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "buyPriceCents" INTEGER NOT NULL DEFAULT 0,
    "sellPriceCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "visibleOnStore" BOOLEAN NOT NULL DEFAULT true,
    "specs" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StorePack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "sellPriceCents" INTEGER NOT NULL,
    "visibleOnStore" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StorePackItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "StorePackItem_packId_fkey" FOREIGN KEY ("packId") REFERENCES "StorePack" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StorePackItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "StoreItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StorePackItem_packId_itemId_key" ON "StorePackItem"("packId", "itemId");
