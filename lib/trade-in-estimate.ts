import {
  getCategoryById,
  tradeInConditions,
  tradeInDefects,
  type TradeInCategoryId,
} from "@/config/trade-in";

export interface TradeInEstimateInput {
  categoryId: TradeInCategoryId;
  modelId: string;
  condition: string;
  storage?: string;
  defects: string[];
}

export interface TradeInEstimateResult {
  low: number;
  high: number;
  mid: number;
  modelLabel: string;
  categoryLabel: string;
  disclaimer: string;
}

const MIN_VALUE = 10;

export function estimateTradeInValue(input: TradeInEstimateInput): TradeInEstimateResult | null {
  const category = getCategoryById(input.categoryId);
  if (!category) return null;

  const model = category.models.find((m) => m.id === input.modelId);
  const condition = tradeInConditions.find((c) => c.value === input.condition);
  if (!model || !condition) return null;

  let value = model.baseValue * condition.factor;

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

  const mid = Math.max(MIN_VALUE, Math.round(value));
  const low = Math.max(MIN_VALUE, Math.round(mid * 0.88));
  const high = Math.round(mid * 1.12);

  return {
    low,
    high,
    mid,
    modelLabel: model.label,
    categoryLabel: category.label,
    disclaimer:
      model.notes ??
      "Estimation indicative basée sur le marché occasion. Offre ferme après test et vérification (compte désactivé, pas de blocage opérateur).",
  };
}
