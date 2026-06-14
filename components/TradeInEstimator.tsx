"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  tradeInCatalog,
  tradeInConditions,
  tradeInDefects,
  type TradeInCategoryId,
} from "@/config/trade-in";
import { estimateTradeInValue } from "@/lib/trade-in-estimate";

export function TradeInEstimator() {
  const [categoryId, setCategoryId] = useState<TradeInCategoryId | "">("");
  const [modelId, setModelId] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("");
  const [defects, setDefects] = useState<string[]>([]);

  const category = tradeInCatalog.find((c) => c.id === categoryId);

  const estimate = useMemo(() => {
    if (!categoryId || !modelId || !condition) return null;
    return estimateTradeInValue({
      categoryId,
      modelId,
      condition,
      storage: storage || undefined,
      defects,
    });
  }, [categoryId, modelId, condition, storage, defects]);

  const toggleDefect = (value: string) => {
    setDefects((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const contactHref = estimate
    ? `/contact?subject=rachat-materiel&appareil=${encodeURIComponent(estimate.modelLabel)}&estimation=${estimate.mid}`
    : "/contact?subject=rachat-materiel";

  return (
    <div className="card space-y-5">
      <div>
        <h3 className="text-xl font-bold mb-1">Estimation de reprise</h3>
        <p className="text-sm text-gray-600">
          Barèmes basés sur le marché occasion français. Choisissez votre modèle pour une
          fourchette réaliste — offre ferme après inspection.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tradein-category">Catégorie</Label>
          <select
            id="tradein-category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value as TradeInCategoryId | "");
              setModelId("");
              setStorage("");
            }}
            className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
          >
            <option value="">Choisir…</option>
            {tradeInCatalog.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="tradein-model">Modèle précis</Label>
          <select
            id="tradein-model"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={!category}
            className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px] disabled:opacity-50"
          >
            <option value="">Choisir…</option>
            {category?.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {category?.storageOptions && (
        <div>
          <Label htmlFor="tradein-storage">Stockage</Label>
          <select
            id="tradein-storage"
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
          >
            <option value="">Choisir…</option>
            {category.storageOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="tradein-condition">État général</Label>
        <select
          id="tradein-condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
        >
          <option value="">Choisir…</option>
          {tradeInConditions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="font-semibold text-sm mb-2">Défauts éventuels (optionnel)</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {tradeInDefects.map((d) => (
            <label key={d.value} className="flex items-start gap-2 cursor-pointer text-sm min-h-[44px]">
              <input
                type="checkbox"
                checked={defects.includes(d.value)}
                onChange={() => toggleDefect(d.value)}
                className="mt-1"
              />
              {d.label}
            </label>
          ))}
        </div>
      </fieldset>

      {estimate && (
        <div className="rounded-xl bg-success/10 border border-success/25 p-5">
          <p className="text-sm text-gray-600 mb-1">
            {estimate.categoryLabel} — {estimate.modelLabel}
          </p>
          <p className="text-3xl font-bold text-success text-center my-2">
            {estimate.low}€ – {estimate.high}€
          </p>
          <p className="text-center text-sm text-gray-600">
            Estimation médiane : <strong>{estimate.mid}€</strong>
          </p>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed text-center">
            {estimate.disclaimer}
          </p>
          <div className="flex justify-center mt-4">
            <Button asChild>
              <Link href={contactHref}>Demander une offre ferme</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
