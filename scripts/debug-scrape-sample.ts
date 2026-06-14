import fs from "fs";
import { chromium } from "playwright";
import {
  buildBackMarketUrl,
  buildLeboncoinUrl,
  extractEuroPricesFromText,
  scrapeResultFromHtml,
} from "../lib/trade-in-scraper";

const SAMPLES = [
  { query: "iphone 14", category: 17 },
  { query: "playstation 5", category: 43 },
];

async function dismissCookies(page: import("playwright").Page) {
  const selectors = [
    'button:has-text("Tout accepter")',
    'button:has-text("Accepter & Fermer")',
    'button:has-text("Accepter")',
    "#didomi-notice-agree-button",
  ];
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click();
        await page.waitForTimeout(800);
        return;
      }
    } catch {
      /* next */
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: "fr-FR" });

  for (const sample of SAMPLES) {
    for (const [source, url] of [
      ["leboncoin", buildLeboncoinUrl(sample.query, sample.category)],
      ["backmarket", buildBackMarketUrl(sample.query)],
    ] as const) {
      console.log("\n===", source, sample.query, "===");
      console.log(url);
      await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      await dismissCookies(page);
      await page.waitForTimeout(3000);

      const html = await page.content();
      const slug = `${source}-${sample.query.replace(/\s+/g, "-")}`;
      fs.writeFileSync(`scripts/debug-${slug}.html`, html.slice(0, 200_000));

      const result = scrapeResultFromHtml(source, html, url);
      console.log("prices found:", result.prices.length, result.prices.slice(0, 8));
      console.log("median:", result.median, "error:", result.error);

      // Try DOM selectors
      if (source === "leboncoin") {
        const domPrices = await page
          .locator('[data-qa-id="aditem_price"], [data-test-id="price"], span[class*="price"]')
          .allTextContents();
        console.log("DOM price texts:", domPrices.slice(0, 8));
      }
      if (source === "backmarket") {
        const domPrices = await page
          .locator('[data-qa="product-card-price"], [class*="Price"], span')
          .filter({ hasText: /€/ })
          .allTextContents();
        console.log("DOM price texts:", domPrices.slice(0, 8));
      }
    }
  }

  await browser.close();
}

main().catch(console.error);
