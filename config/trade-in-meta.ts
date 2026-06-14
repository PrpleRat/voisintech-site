import { CUSTOM_MODEL_ID, type TradeInCategoryId } from "@/config/trade-in";

export { CUSTOM_MODEL_ID };

/** Requêtes de recherche pour scraping Leboncoin / Back Market */
export const tradeInSearchQueries: Record<string, string> = {
  "iphone-15-pro": "iphone 15 pro",
  "iphone-15": "iphone 15",
  "iphone-14-pro": "iphone 14 pro",
  "iphone-14": "iphone 14",
  "iphone-13": "iphone 13",
  "iphone-12": "iphone 12",
  "iphone-11": "iphone 11",
  "iphone-se": "iphone se",
  "iphone-old": "iphone",
  "samsung-s24": "samsung galaxy s24",
  "samsung-s23": "samsung galaxy s23",
  "samsung-a": "samsung galaxy a",
  "xiaomi-recent": "xiaomi redmi",
  "android-old": "smartphone android",
  "ipad-pro-recent": "ipad pro",
  "ipad-air": "ipad air",
  "ipad-std": "ipad",
  "ipad-mini": "ipad mini",
  "ipad-old": "ipad",
  "samsung-tab": "samsung galaxy tab",
  "tab-other": "tablette android",
  "mbp-m3": "macbook pro m3",
  "mba-m3": "macbook air m3",
  "mba-m2": "macbook air m2",
  "mba-m1": "macbook air m1",
  "mbp-m1m2": "macbook pro m1",
  "mac-intel-recent": "macbook pro intel",
  "mac-intel-old": "macbook",
  "win-gaming": "pc portable gamer rtx",
  "win-premium": "pc portable i5 16go",
  "win-standard": "pc portable",
  "win-old": "pc portable",
  chromebook: "chromebook",
  "imac-m": "imac m1",
  "imac-intel": "imac",
  "mac-mini-m": "mac mini m1",
  "pc-gaming": "pc gamer",
  "pc-bureau": "pc fixe",
  "pc-old": "ordinateur fixe",
  "mon-4k": "ecran 27 4k",
  "mon-24fhd": "ecran 24 pouces",
  "mon-old": "ecran ordinateur",
  ps5: "playstation 5",
  ps4: "playstation 4",
  "xbox-series": "xbox series x",
  "xbox-one": "xbox one",
  "switch-oled": "nintendo switch oled",
  switch: "nintendo switch",
  "switch-lite": "nintendo switch lite",
};

export const leboncoinCategoryIds: Partial<Record<TradeInCategoryId, number>> = {
  smartphone: 17,
  tablet: 17,
  laptop: 15,
  desktop: 15,
  monitor: 15,
  console: 43,
};

export const MARKET_PRICE_BLEND = 0.72;
export const MARKET_DATA_MAX_AGE_MS = 36 * 60 * 60 * 1000;

export function getSearchQuery(modelId: string, exactModel?: string): string {
  if (exactModel?.trim()) return exactModel.trim();
  return tradeInSearchQueries[modelId] ?? modelId.replace(/-/g, " ");
}

export function cacheKeyForModel(modelId: string, searchQuery: string, source: string) {
  const slug = `${modelId}::${searchQuery}::${source}`.toLowerCase().slice(0, 180);
  return slug.replace(/[^a-z0-9:_-]/g, "-");
}
