"use client";

import { MapPin } from "lucide-react";
import { useRegion } from "@/components/RegionProvider";

export function RegionSwitcher({ className }: { className?: string }) {
  const { config, openRegionPicker } = useRegion();

  return (
    <button
      type="button"
      onClick={openRegionPicker}
      className={className}
      title="Changer de zone d'intervention"
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Zone : {config.shortLabel}</span>
    </button>
  );
}
