"use client";

import { useRegion } from "@/components/RegionProvider";
import { cn } from "@/lib/utils";

interface ServiceAreaMapProps {
  className?: string;
}

export function ServiceAreaMap({ className }: ServiceAreaMapProps) {
  const { config } = useRegion();
  const { lat, lng } = config.geo;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(config.mapBbox)}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <section
      className={cn("section-padding bg-white", className)}
      aria-label="Zone d'intervention"
    >
      <div className="container-page">
        <h2 className="text-3xl font-bold text-center mb-4">Zone d&apos;intervention</h2>
        <p className="text-center text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
          J&apos;interviens à {config.hubCity} et dans un rayon de {config.serviceRadius}.
          Déplacement gratuit jusqu&apos;à 15 km.
        </p>
        <div className="rounded-2xl overflow-hidden shadow-soft border border-primary/10">
          <iframe
            title={`Carte de la zone d'intervention VoisinTech autour de ${config.hubCity}`}
            src={embedUrl}
            className="w-full h-[280px] md:h-[350px] border-0"
            loading="lazy"
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">{config.areaSummary}</p>
      </div>
    </section>
  );
}
