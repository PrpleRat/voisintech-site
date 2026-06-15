"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SuiteServiceDTO } from "@/lib/voisintech-pricing";

interface SuiteServicesPanelProps {
  onCatalogChange?: (services: SuiteServiceDTO[]) => void;
}

export function SuiteServicesPanel({ onCatalogChange }: SuiteServicesPanelProps) {
  const [services, setServices] = useState<SuiteServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const applyServices = useCallback(
    (next: SuiteServiceDTO[]) => {
      setServices(next);
      onCatalogChange?.(next);
    },
    [onCatalogChange]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/suite-services");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
      applyServices(data.services ?? []);
      if ((data.services ?? []).length === 0) {
        const seedRes = await fetch("/api/admin/suite-services", { method: "POST" });
        const seedData = await seedRes.json();
        if (seedRes.ok && seedData.services?.length) {
          applyServices(seedData.services);
          setMessage("Catalogue VoisinTech initialisé automatiquement.");
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur catalogue");
    } finally {
      setLoading(false);
    }
  }, [applyServices]);

  useEffect(() => {
    load();
  }, [load]);

  async function reseed() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/suite-services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed-voisintech" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Réinitialisation impossible");
      applyServices(data.services ?? []);
      setMessage("Catalogue VoisinTech réinitialisé.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
          Prestations Train Suite (ton workspace)
        </div>
        <Button type="button" size="sm" variant="outline" onClick={reseed} disabled={saving || loading}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Réinitialiser VoisinTech</span>
        </Button>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Ces tarifs sont liés à ta clé API / workspace uniquement. Les autres entrepreneurs qui
        installent les apps ont leur propre catalogue (vide au départ, ou le leur).
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement du catalogue…
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {services.map((service) => (
            <li key={service.id} className="flex items-center justify-between py-2 gap-3">
              <span className="font-medium text-gray-800">{service.name}</span>
              <span className="text-gray-600 shrink-0">
                {service.defaultPrice.toFixed(2)} € · {service.defaultDurationMinutes} min
              </span>
            </li>
          ))}
        </ul>
      )}

      {message && <p className="text-xs text-primary">{message}</p>}
    </div>
  );
}

export function useSuiteServiceCatalog() {
  const [catalog, setCatalog] = useState<SuiteServiceDTO[]>([]);
  return { catalog, setCatalog };
}
