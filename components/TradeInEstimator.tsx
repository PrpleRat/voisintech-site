"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  tradeInCatalog,
  tradeInConditions,
  tradeInDefects,
  CUSTOM_MODEL_ID,
  type TradeInCategoryId,
} from "@/config/trade-in";
import type { TradeInEstimateResult } from "@/lib/trade-in-estimate";

export function TradeInEstimator() {
  const [categoryId, setCategoryId] = useState<TradeInCategoryId | "">("");
  const [modelId, setModelId] = useState("");
  const [exactModel, setExactModel] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("");
  const [defects, setDefects] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<TradeInEstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const category = tradeInCatalog.find((c) => c.id === categoryId);
  const needsExactModel = modelId === CUSTOM_MODEL_ID || !!exactModel.trim();

  useEffect(() => {
    if (!categoryId || !modelId || !condition) {
      setEstimate(null);
      return;
    }
    if (modelId === CUSTOM_MODEL_ID && !exactModel.trim()) {
      setEstimate(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/trade-in/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            categoryId,
            modelId,
            condition,
            storage: storage || undefined,
            defects,
            exactModel: exactModel.trim() || undefined,
            liveScrape: !!exactModel.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur estimation");
        setEstimate(data.estimate);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Erreur");
        setEstimate(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [categoryId, modelId, exactModel, storage, condition, defects]);

  const toggleDefect = (value: string) => {
    setDefects((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const contactHref = estimate
    ? `/contact?subject=rachat-materiel&appareil=${encodeURIComponent(
        estimate.modelLabel
      )}&estimation=${estimate.mid}${exactModel ? `&modele=${encodeURIComponent(exactModel)}` : ""}`
    : "/contact?subject=rachat-materiel";

  return (
    <div className="card space-y-5">
      <div>
        <h3 className="text-xl font-bold mb-1">Estimation de reprise</h3>
        <p className="text-sm text-gray-600">
          Prix recalibrés quotidiennement via Leboncoin et Back Market. Précisez votre
          modèle exact pour une estimation plus fine.
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
              setExactModel("");
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
          <Label htmlFor="tradein-model">Modèle (liste)</Label>
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

      <div>
        <Label htmlFor="tradein-exact">
          Modèle exact {needsExactModel ? "*" : "(recommandé)"}
        </Label>
        <Input
          id="tradein-exact"
          value={exactModel}
          onChange={(e) => setExactModel(e.target.value)}
          placeholder="Ex : iPhone 14 Pro 256 Go Graphite, MacBook Air M2 2022…"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Déclenche une recherche live Leboncoin + Back Market pour affiner le prix.
        </p>
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
            <label
              key={d.value}
              className="flex items-start gap-2 cursor-pointer text-sm min-h-[44px]"
            >
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

      {loading && (
        <p className="flex items-center gap-2 text-sm text-gray-600 justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Calcul avec données marché…
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm p-3 bg-red-50 rounded-xl" role="alert">
          {error}
        </p>
      )}

      {estimate && !loading && (
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
          {estimate.marketDataUsed && (
            <p className="text-center text-xs text-primary mt-2">
              Sources : {estimate.marketSources.join(", ")}
              {estimate.marketSyncedAt &&
                ` · MAJ ${new Date(estimate.marketSyncedAt).toLocaleString("fr-FR")}`}
            </p>
          )}
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
