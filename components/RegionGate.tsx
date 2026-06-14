"use client";

import { MapPin, Mountain, Building2 } from "lucide-react";
import { business } from "@/config/content";
import { regions, type RegionId } from "@/config/regions";
import { useRegion } from "@/components/RegionProvider";
import { cn } from "@/lib/utils";

const choices: {
  id: RegionId;
  icon: typeof Building2;
  accent: string;
}[] = [
  {
    id: "toulouse",
    icon: Building2,
    accent: "from-primary/15 to-accent/30 border-primary/25 hover:border-primary",
  },
  {
    id: "lourdes",
    icon: Mountain,
    accent: "from-emerald-50 to-sky-50 border-emerald-200 hover:border-emerald-400",
  },
];

export function RegionGate() {
  const { needsSelection, isReady, setRegion } = useRegion();

  if (!isReady || !needsSelection) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-gate-title"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            {business.name}
          </p>
          <h1 id="region-gate-title" className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Où avez-vous besoin d&apos;aide ?
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Choisissez votre zone pour voir les services, villes et tarifs adaptés à votre secteur.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {choices.map(({ id, icon: Icon, accent }) => {
            const config = regions[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => setRegion(id)}
                className={cn(
                  "group flex flex-col items-start text-left rounded-2xl border-2 bg-gradient-to-br p-6 min-h-[180px] transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  accent
                )}
              >
                <Icon
                  className="h-10 w-10 text-primary mb-4 group-hover:scale-105 transition-transform"
                  aria-hidden="true"
                />
                <span className="text-2xl font-bold text-foreground">{config.label}</span>
                <span className="text-sm text-gray-500 mt-1">{config.subtitle}</span>
                <span className="text-sm text-gray-600 mt-3 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                  {config.areaSummary}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Vous pourrez changer de zone à tout moment depuis le menu du site.
        </p>
      </div>
    </div>
  );
}
