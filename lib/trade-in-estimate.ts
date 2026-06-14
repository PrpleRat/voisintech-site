import {
  CUSTOM_MODEL_ID,
  getCategoryById,
  tradeInConditions,
  tradeInDefects,
  type TradeInCategoryId,
} from "@/config/trade-in";
import {
  getSearchQuery,
  MARKET_DATA_MAX_AGE_MS,
  MARKET_PRICE_BLEND,
} from "@/config/trade-in-meta";
import { getMarketBuybackForModel } from "@/lib/trade-in-sync";

export interface TradeInEstimateInput {
  categoryId: TradeInCategoryId;
  modelId: string;
  condition: string;
  storage?: string;
  defects: string[];
  exactModel?: string;
  marketBuyback?: number | null;
  marketSources?: string[];
  marketSyncedAt?: string | null;
}

export interface TradeInEstimateResult {
  low: number;
  high: number;
  mid: number;
  modelLabel: string;
  categoryLabel: string;
  disclaimer: string;
  marketDataUsed: boolean;
  marketSources: string[];
  marketSyncedAt: string | null;
  catalogBase: number;
  marketBase: number | null;
}

const MIN_VALUE = 10;

function applyModifiers(
  baseValue: number,
  input: TradeInEstimateInput,
  category: NonNullable<ReturnType<typeof getCategoryById>>
) {
  const condition = tradeInConditions.find((c) => c.value === input.condition);
  if (!condition) return null;

  let value = baseValue * condition.factor;

  if (input.storage && category.storageOptions) {
    const storage = category.storageOptions.find((s) => s.value === input.storage);
    if (storage) value += storage.modifier;
  }

  for (const defectId of input.defects) {
    const defect = tradeInDefects.find((d) => d.value === defectId);
    if (defect) value *= 1 + defect.modifier;
  }

  if (condition.value === "broken" && input.defects.includes("screen")) {
    value *= 0.85;
  }

  return Math.max(MIN_VALUE, Math.round(value));
}

export function computeEstimateFromBase(
  input: TradeInEstimateInput,
  catalogBase: number,
  marketBase: number | null
): TradeInEstimateResult | null {
  const category = getCategoryById(input.categoryId);
  if (!category) return null;

  const model = category.models.find((m) => m.id === input.modelId);
  const condition = tradeInConditions.find((c) => c.value === input.condition);
  if (!model || !condition) return null;

  let blendedBase = catalogBase;
  let marketDataUsed = false;
  const marketSources = input.marketSources ?? [];
  const marketSyncedAt = input.marketSyncedAt ?? null;

  if (marketBase != null && marketBase > 0) {
    blendedBase = Math.round(
      catalogBase * (1 - MARKET_PRICE_BLEND) + marketBase * MARKET_PRICE_BLEND
    );
    marketDataUsed = true;
  }

  const mid = applyModifiers(blendedBase, input, category);
  if (mid == null) return null;

  const low = Math.max(MIN_VALUE, Math.round(mid * 0.88));
  const high = Math.round(mid * 1.12);

  const displayLabel =
    input.exactModel?.trim() && input.modelId === CUSTOM_MODEL_ID
      ? input.exactModel.trim()
      : input.exactModel?.trim()
        ? `${model.label} — ${input.exactModel.trim()}`
        : model.label;

  let disclaimer =
    "Estimation indicative. Offre ferme après test (compte désactivé, pas de verrou opérateur).";

  if (marketDataUsed) {
    disclaimer = `Prix recalibré avec données ${marketSources.join(" + ")} (sync ${marketSyncedAt ? new Date(marketSyncedAt).toLocaleString("fr-FR") : "récente"}). ${disclaimer}`;
  } else {
    disclaimer = `Barème catalogue (mise à jour marché quotidienne en cours). ${disclaimer}`;
  }

  return {
    low,
    high,
    mid,
    modelLabel: displayLabel,
    categoryLabel: category.label,
    disclaimer,
    marketDataUsed,
    marketSources,
    marketSyncedAt,
    catalogBase,
    marketBase,
  };
}

export async function estimateTradeInValue(
  input: TradeInEstimateInput
): Promise<TradeInEstimateResult | null> {
  const category = getCategoryById(input.categoryId);
  if (!category) return null;

  const model = category.models.find((m) => m.id === input.modelId);
  if (!model) return null;

  const searchQuery = getSearchQuery(input.modelId, input.exactModel);
  const cacheModelId =
    input.modelId === CUSTOM_MODEL_ID
      ? `custom:${searchQuery.toLowerCase()}`
      : input.modelId;

  const market = await getMarketBuybackForModel(cacheModelId, searchQuery);

  let marketBase = input.marketBuyback ?? market.buyback;
  const syncedAt = market.scrapedAt?.toISOString() ?? input.marketSyncedAt ?? null;

  if (
    market.scrapedAt &&
    Date.now() - market.scrapedAt.getTime() > MARKET_DATA_MAX_AGE_MS
  ) {
    marketBase = null;
  }

  return computeEstimateFromBase(
    {
      ...input,
      marketSources: market.sources,
      marketSyncedAt: syncedAt,
    },
    model.baseValue,
    marketBase
  );
}

/** Version synchrone (fallback client) */
export function estimateTradeInValueLocal(
  input: TradeInEstimateInput
): TradeInEstimateResult | null {
  const category = getCategoryById(input.categoryId);
  if (!category) return null;
  const model = category.models.find((m) => m.id === input.modelId);
  if (!model) return null;

  return computeEstimateFromBase(input, model.baseValue, input.marketBuyback ?? null);
}
