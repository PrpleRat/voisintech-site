"use client";

import { useRegion } from "@/components/RegionProvider";

export function RegionPricingNote() {
  const { config } = useRegion();
  return (
    <p className="mt-6 text-success font-semibold text-lg">{config.pricingNote}</p>
  );
}
