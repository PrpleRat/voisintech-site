import { getPrisma } from "@/lib/prisma";
import {
  getAllCatalogModels,
  CUSTOM_MODEL_ID,
  type TradeInCategoryId,
} from "@/config/trade-in";
import {
  cacheKeyForModel,
  getSearchQuery,
  leboncoinCategoryIds,
} from "@/config/trade-in-meta";
import { scrapeBackMarket, scrapeLeboncoin } from "@/lib/trade-in-scraper";

const SYNC_DELAY_MS = 650;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function syncOneModelPrice(
  modelId: string,
  categoryId: TradeInCategoryId,
  exactQuery?: string
) {
  const searchQuery = exactQuery ?? getSearchQuery(modelId);
  const categoryFilter = leboncoinCategoryIds[categoryId];

  const [leboncoin, backmarket] = await Promise.all([
    scrapeLeboncoin(searchQuery, categoryFilter),
    scrapeBackMarket(searchQuery),
  ]);

  const prisma = await getPrisma();
  const now = new Date();

  const upserts = [
    {
      source: "leboncoin" as const,
      result: leboncoin,
    },
    {
      source: "backmarket" as const,
      result: backmarket,
    },
  ];

  for (const { source, result } of upserts) {
    await prisma.tradeInPriceCache.upsert({
      where: { id: cacheKeyForModel(modelId, searchQuery, source) },
      create: {
        id: cacheKeyForModel(modelId, searchQuery, source),
        modelId,
        searchQuery,
        source,
        medianResale: result.median,
        buybackEstimate: result.buybackEstimate,
        sampleCount: result.prices.length,
        rawPrices: result.prices.length ? JSON.stringify(result.prices.slice(0, 20)) : null,
        scrapeError: result.ok ? null : result.error ?? "Échec scrape",
        scrapedAt: now,
      },
      update: {
        medianResale: result.median,
        buybackEstimate: result.buybackEstimate,
        sampleCount: result.prices.length,
        rawPrices: result.prices.length ? JSON.stringify(result.prices.slice(0, 20)) : null,
        scrapeError: result.ok ? null : result.error ?? "Échec scrape",
        scrapedAt: now,
      },
    });
  }

  return {
    modelId,
    searchQuery,
    ok: leboncoin.ok || backmarket.ok,
    leboncoin: leboncoin.buybackEstimate,
    backmarket: backmarket.buybackEstimate,
  };
}

export async function syncAllCatalogPrices(options?: { skipCustom?: boolean }) {
  const prisma = await getPrisma();
  const models = getAllCatalogModels().filter(
    (m) => !options?.skipCustom || m.id !== CUSTOM_MODEL_ID
  );

  const run = await prisma.tradeInSyncRun.create({
    data: {
      status: "running",
      modelsTotal: models.length,
      modelsOk: 0,
      modelsFailed: 0,
    },
  });

  let ok = 0;
  let failed = 0;
  const log: string[] = [];

  for (const model of models) {
    try {
      const result = await syncOneModelPrice(model.id, model.categoryId);
      if (result.ok) {
        ok++;
        log.push(`OK ${model.id}`);
      } else {
        failed++;
        log.push(`FAIL ${model.id}`);
      }
    } catch (err) {
      failed++;
      log.push(`ERR ${model.id}: ${err instanceof Error ? err.message : "?"}`);
    }
    await sleep(SYNC_DELAY_MS);
  }

  await prisma.tradeInSyncRun.update({
    where: { id: run.id },
    data: {
      status: failed === models.length ? "failed" : "completed",
      modelsOk: ok,
      modelsFailed: failed,
      details: log.join("\n").slice(0, 8000),
      finishedAt: new Date(),
    },
  });

  return { runId: run.id, modelsTotal: models.length, modelsOk: ok, modelsFailed: failed };
}

export async function getMarketBuybackForModel(
  modelId: string,
  searchQuery: string
): Promise<{ buyback: number | null; sources: string[]; scrapedAt: Date | null }> {
  const prisma = await getPrisma();
  const rows = await prisma.tradeInPriceCache.findMany({
    where: { modelId, searchQuery },
    orderBy: { scrapedAt: "desc" },
  });

  const estimates = rows
    .filter((r) => r.buybackEstimate != null && r.buybackEstimate > 0)
    .map((r) => r.buybackEstimate!);

  if (estimates.length === 0) {
    return { buyback: null, sources: [], scrapedAt: null };
  }

  const buyback = Math.round(estimates.reduce((a, b) => a + b, 0) / estimates.length);
  const sources = rows.filter((r) => r.buybackEstimate).map((r) => r.source);
  const scrapedAt = rows[0]?.scrapedAt ?? null;

  return { buyback, sources, scrapedAt };
}
