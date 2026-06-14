import { chromium, type Page } from "playwright";
import {
  CUSTOM_MODEL_ID,
  getAllCatalogModels,
} from "../config/trade-in";
import {
  getSearchQuery,
  leboncoinCategoryIds,
} from "../config/trade-in-meta";
import {
  buildBackMarketUrl,
  buildLeboncoinUrl,
  scrapeResultFromHtml,
  type ScrapeResult,
} from "../lib/trade-in-scraper";
import type { TradeInIngestEntry } from "../lib/trade-in-sync";

const SYNC_DELAY_MS = 1200;
const SITE_URL = process.env.SITE_URL ?? "https://www.voisintech.fr";
const CRON_SECRET = process.env.CRON_SECRET;

async function dismissCookies(page: Page) {
  const selectors = [
    'button:has-text("Tout accepter")',
    'button:has-text("Accepter")',
    'button:has-text("Accept all")',
    'button:has-text("J\'accepte")',
    '[data-testid="accept-all"]',
    "#didomi-notice-agree-button",
  ];

  for (const selector of selectors) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 1500 })) {
        await btn.click({ timeout: 2000 });
        await page.waitForTimeout(500);
        return;
      }
    } catch {
      // try next selector
    }
  }
}

async function fetchPageHtml(page: Page, url: string): Promise<string> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await dismissCookies(page);
  await page.waitForTimeout(2500);
  return page.content();
}

async function scrapeWithBrowser(
  page: Page,
  source: "leboncoin" | "backmarket",
  url: string
): Promise<ScrapeResult> {
  try {
    const html = await fetchPageHtml(page, url);
    return scrapeResultFromHtml(source, html, url);
  } catch (err) {
    return {
      source,
      prices: [],
      median: null,
      buybackEstimate: null,
      url,
      ok: false,
      error: err instanceof Error ? err.message : "Erreur Playwright",
    };
  }
}

function toIngestEntry(
  modelId: string,
  searchQuery: string,
  result: ScrapeResult
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!CRON_SECRET) {
    console.error("CRON_SECRET manquant");
    process.exit(1);
  }

  const models = getAllCatalogModels().filter((m) => m.id !== CUSTOM_MODEL_ID);
  console.log(`Playwright sync — ${models.length} modèles`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    locale: "fr-FR",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 900 },
  });

  const leboncoinPage = await context.newPage();
  const backmarketPage = await context.newPage();

  const entries: TradeInIngestEntry[] = [];
  const log: string[] = [];
  let ok = 0;
  let failed = 0;

  for (const model of models) {
    const searchQuery = getSearchQuery(model.id);
    const categoryFilter = leboncoinCategoryIds[model.categoryId];
    const lbcUrl = buildLeboncoinUrl(searchQuery, categoryFilter);
    const bmUrl = buildBackMarketUrl(searchQuery);

    const [leboncoin, backmarket] = await Promise.all([
      scrapeWithBrowser(leboncoinPage, "leboncoin", lbcUrl),
      scrapeWithBrowser(backmarketPage, "backmarket", bmUrl),
    ]);

    entries.push(toIngestEntry(model.id, searchQuery, leboncoin));
    entries.push(toIngestEntry(model.id, searchQuery, backmarket));

    const modelOk = leboncoin.ok || backmarket.ok;
    if (modelOk) {
      ok++;
      log.push(
        `OK ${model.id} (LBC:${leboncoin.prices.length} BM:${backmarket.prices.length})`
      );
    } else {
      failed++;
      log.push(`FAIL ${model.id}`);
    }

    console.log(log[log.length - 1]);
    await sleep(SYNC_DELAY_MS);
  }

  await browser.close();

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
  if (ok === 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
