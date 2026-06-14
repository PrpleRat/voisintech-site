const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/json",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

export interface ScrapeResult {
  source: "leboncoin" | "backmarket";
  prices: number[];
  median: number | null;
  buybackEstimate: number | null;
  url: string;
  ok: boolean;
  error?: string;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function filterOutliers(prices: number[]): number[] {
  if (prices.length < 4) return prices;
  const sorted = [...prices].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const min = q1 - iqr * 1.5;
  const max = q3 + iqr * 1.5;
  return sorted.filter((p) => p >= min && p <= max);
}

export function extractEuroPricesFromText(text: string): number[] {
  const found = new Set<number>();

  const patterns = [
    /"price"\s*:\s*(\d{2,6})/g,
    /"price_cents"\s*:\s*(\d{3,8})/g,
    /"amount"\s*:\s*(\d{2,6})/g,
    /data-price=["'](\d{2,6})["']/g,
    /(\d{2,4})\s*(?:&nbsp;|\u00a0)?€/g,
  ];

  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      let value = parseInt(match[1], 10);
      if (Number.isNaN(value)) continue;
      if (pattern.source.includes("cents") || value > 8000) {
        value = Math.round(value / 100);
      }
      if (value >= 15 && value <= 8000) found.add(value);
    }
  }

  return filterOutliers(Array.from(found)).slice(0, 40);
}

export function buildLeboncoinUrl(query: string, categoryId?: number): string {
  const params = new URLSearchParams({
    text: query,
    sort: "time",
    order: "asc",
  });
  if (categoryId) params.set("category", String(categoryId));
  return `https://www.leboncoin.fr/recherche?${params.toString()}`;
}

export function buildBackMarketUrl(query: string): string {
  return `https://www.backmarket.fr/fr-fr/search?q=${encodeURIComponent(query)}`;
}

export function scrapeResultFromHtml(
  source: "leboncoin" | "backmarket",
  html: string,
  url: string
): ScrapeResult {
  const prices = extractEuroPricesFromText(html);
  const med = median(prices);
  const buybackMultiplier = source === "leboncoin" ? 0.52 : 0.48;

  return {
    source,
    prices,
    median: med,
    buybackEstimate: med ? Math.round(med * buybackMultiplier) : null,
    url,
    ok: prices.length > 0,
    error: prices.length === 0 ? "Aucun prix extrait" : undefined,
  };
}

export async function scrapeLeboncoin(
  query: string,
  categoryId?: number
): Promise<ScrapeResult> {
  const url = buildLeboncoinUrl(query, categoryId);

  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        source: "leboncoin",
        prices: [],
        median: null,
        buybackEstimate: null,
        url,
        ok: false,
        error: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();
    return scrapeResultFromHtml("leboncoin", html, url);
  } catch (err) {
    return {
      source: "leboncoin",
      prices: [],
      median: null,
      buybackEstimate: null,
      url,
      ok: false,
      error: err instanceof Error ? err.message : "Erreur réseau",
    };
  }
}

export async function scrapeBackMarket(query: string): Promise<ScrapeResult> {
  const url = buildBackMarketUrl(query);

  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        source: "backmarket",
        prices: [],
        median: null,
        buybackEstimate: null,
        url,
        ok: false,
        error: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();
    return scrapeResultFromHtml("backmarket", html, url);
  } catch (err) {
    return {
      source: "backmarket",
      prices: [],
      median: null,
      buybackEstimate: null,
      url,
      ok: false,
      error: err instanceof Error ? err.message : "Erreur réseau",
    };
  }
}

export async function scrapeMarketPrices(
  query: string,
  categoryId?: number
): Promise<{ leboncoin: ScrapeResult; backmarket: ScrapeResult; blendedBuyback: number | null }> {
  const [leboncoin, backmarket] = await Promise.all([
    scrapeLeboncoin(query, categoryId),
    scrapeBackMarket(query),
  ]);

  const estimates = [leboncoin.buybackEstimate, backmarket.buybackEstimate].filter(
    (v): v is number => v != null && v > 0
  );

  const blendedBuyback =
    estimates.length > 0
      ? Math.round(estimates.reduce((a, b) => a + b, 0) / estimates.length)
      : null;

  return { leboncoin, backmarket, blendedBuyback };
}
