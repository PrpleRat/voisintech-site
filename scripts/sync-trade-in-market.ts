import {
  CUSTOM_MODEL_ID,
  getAllCatalogModels,
} from "../config/trade-in";
import {
  getSearchQuery,
  leboncoinCategoryIds,
} from "../config/trade-in-meta";
import { scrapeBackMarket, scrapeLeboncoin } from "../lib/trade-in-scraper";
import type { TradeInIngestEntry } from "../lib/trade-in-sync";

const SYNC_DELAY_MS = 800;
const SITE_URL = process.env.SITE_URL ?? "https://www.voisintech.fr";
const CRON_SECRET = process.env.CRON_SECRET;
const SYNC_LIMIT = process.env.SYNC_LIMIT
  ? parseInt(process.env.SYNC_LIMIT, 10)
  : undefined;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function toIngestEntry(
  modelId: string,
  searchQuery: string,
  result: Awaited<ReturnType<typeof scrapeLeboncoin>>
): TradeInIngestEntry {
  return {
    modelId,
    searchQuery,
    source: result.source,
    medianResale: result.median,
    buybackEstimate: result.buybackEstimate,
    sampleCount: result.prices.length,
    rawPrices: result.prices.slice(0, 20),
    scrapeError: result.ok ? null : result.error ?? "Échec scrape",
    scrapedAt: new Date().toISOString(),
  };
}

async function main() {
  if (!CRON_SECRET) {
    console.error("CRON_SECRET manquant");
    process.exit(1);
  }

  const hasProxy = !!process.env.SCRAPER_API_KEY;
  console.log(
    `Sync marché — proxy ScraperAPI: ${hasProxy ? "oui" : "non (anti-bot actif, ajoutez SCRAPER_API_KEY)"}`
  );

  let models = getAllCatalogModels().filter((m) => m.id !== CUSTOM_MODEL_ID);
  if (SYNC_LIMIT && SYNC_LIMIT > 0) {
    models = models.slice(0, SYNC_LIMIT);
    console.log(`Limite SYNC_LIMIT=${SYNC_LIMIT}`);
  }

  const entries: TradeInIngestEntry[] = [];
  const log: string[] = [];
  let ok = 0;
  let failed = 0;

  for (const model of models) {
    const searchQuery = getSearchQuery(model.id);
    const categoryFilter = leboncoinCategoryIds[model.categoryId];

    const [leboncoin, backmarket] = await Promise.all([
      scrapeLeboncoin(searchQuery, categoryFilter),
      scrapeBackMarket(searchQuery),
    ]);

    entries.push(toIngestEntry(model.id, searchQuery, leboncoin));
    entries.push(toIngestEntry(model.id, searchQuery, backmarket));

    const modelOk = leboncoin.ok || backmarket.ok;
    if (modelOk) {
      ok++;
      log.push(
        `OK ${model.id} LBC:${leboncoin.prices.length} BM:${backmarket.prices.length}`
      );
    } else {
      failed++;
      log.push(
        `FAIL ${model.id} (${leboncoin.error ?? "?"} / ${backmarket.error ?? "?"})`
      );
    }
    console.log(log[log.length - 1]);
    await sleep(SYNC_DELAY_MS);
  }

  const ingestUrl = `${SITE_URL.replace(/\/$/, "")}/api/cron/ingest-trade-in-prices`;
  console.log("Ingest:", ingestUrl);

  const res = await fetch(ingestUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
      "Content-Type": "application/json",
      "x-cron-secret": CRON_SECRET,
    },
    body: JSON.stringify({
      entries,
      summary: {
        modelsTotal: models.length,
        modelsOk: ok,
        modelsFailed: failed,
        details: log.join("\n"),
      },
    }),
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));

  if (!res.ok) process.exit(1);

  if (ok === 0) {
    console.warn(
      "\n⚠ Aucun prix marché récupéré. Leboncoin/Back Market bloquent les IP datacenter.\n" +
        "→ Créez une clé gratuite sur https://www.scraperapi.com\n" +
        "→ Ajoutez SCRAPER_API_KEY dans GitHub Secrets + Vercel\n" +
        "→ L'estimateur utilise le barème catalogue en attendant."
    );
    // Ingest OK : ne pas faire échouer le workflow quotidien
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
