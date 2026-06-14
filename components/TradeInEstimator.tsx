"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const deviceTypes = [
  { value: "laptop", label: "Ordinateur portable", base: 120 },
  { value: "desktop", label: "PC fixe", base: 80 },
  { value: "smartphone", label: "Smartphone", base: 60 },
  { value: "tablet", label: "Tablette", base: 50 },
];

const conditions = [
  { value: "excellent", label: "Excellent état", factor: 1 },
  { value: "good", label: "Bon état (usure légère)", factor: 0.75 },
  { value: "fair", label: "État moyen (rayures, batterie faible)", factor: 0.5 },
  { value: "poor", label: "État dégradé / ne démarre plus", factor: 0.25 },
];

const ages = [
  { value: "0-2", label: "Moins de 2 ans", factor: 1 },
  { value: "2-4", label: "2 à 4 ans", factor: 0.8 },
  { value: "4-6", label: "4 à 6 ans", factor: 0.55 },
  { value: "6+", label: "Plus de 6 ans", factor: 0.35 },
];

export function TradeInEstimator() {
  const [device, setDevice] = useState("");
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");

  const estimate = useMemo(() => {
    const deviceData = deviceTypes.find((d) => d.value === device);
    const conditionData = conditions.find((c) => c.value === condition);
    const ageData = ages.find((a) => a.value === age);
    if (!deviceData || !conditionData || !ageData) return null;

    const mid = Math.round(
      deviceData.base * conditionData.factor * ageData.factor
    );
    const low = Math.max(15, Math.round(mid * 0.75));
    const high = Math.round(mid * 1.25);
    return { low, high };
  }, [device, condition, age]);

  return (
    <div className="card space-y-5">
      <div>
        <h3 className="text-xl font-bold mb-1">Estimation de reprise</h3>
        <p className="text-sm text-gray-600">
          Fourchette indicative — offre ferme après inspection sur place ou par photo.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="tradein-device">Appareil</Label>
          <select
            id="tradein-device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
          >
            <option value="">Choisir…</option>
            {deviceTypes.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="tradein-condition">État</Label>
          <select
            id="tradein-condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
          >
            <option value="">Choisir…</option>
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="tradein-age">Âge</Label>
          <select
            id="tradein-age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
          >
            <option value="">Choisir…</option>
            {ages.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {estimate && (
        <div className="rounded-xl bg-success/10 border border-success/25 p-5 text-center">
          <p className="text-sm text-gray-600 mb-1">Fourchette estimée</p>
          <p className="text-3xl font-bold text-success">
            {estimate.low}€ – {estimate.high}€
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Estimation non contractuelle. Prix final selon modèle exact et test fonctionnel.
          </p>
          <Button asChild className="mt-4">
            <Link href="/contact?subject=rachat-materiel">Demander une offre ferme</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
