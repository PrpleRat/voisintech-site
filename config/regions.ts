export type RegionId = "toulouse" | "lourdes";

export interface RegionConfig {
  id: RegionId;
  label: string;
  shortLabel: string;
  subtitle: string;
  hubCity: string;
  serviceRadius: string;
  address: string;
  pricingNote: string;
  heroBadge: string;
  areaSummary: string;
  nearbyCities: string[];
  geo: { lat: number; lng: number };
  mapBbox: string;
  faqZoneAnswer: string;
}

export const regions: Record<RegionId, RegionConfig> = {
  toulouse: {
    id: "toulouse",
    label: "Toulouse",
    shortLabel: "Toulouse",
    subtitle: "Métropole toulousaine",
    hubCity: "Toulouse",
    serviceRadius: "15 à 30 km",
    address: "Toulouse et agglomération",
    pricingNote: "Déplacement gratuit jusqu'à 15 km autour de Toulouse",
    heroBadge: "Dépannage informatique à domicile — Toulouse",
    areaSummary:
      "Toulouse, Blagnac, Colomiers, Tournefeuille, Balma, L'Union et environs",
    nearbyCities: [
      "Toulouse",
      "Blagnac",
      "Colomiers",
      "Tournefeuille",
      "Balma",
      "L'Union",
    ],
    geo: { lat: 43.6047, lng: 1.4442 },
    mapBbox: "1.25,43.48,1.58,43.72",
    faqZoneAnswer:
      "J'interviens à Toulouse et dans un rayon de 15 à 30 km (Blagnac, Colomiers, Tournefeuille, Balma, L'Union, etc.). Le déplacement est gratuit jusqu'à 15 km.",
  },
  lourdes: {
    id: "lourdes",
    label: "Lourdes & Bigorre",
    shortLabel: "Lourdes",
    subtitle: "Hautes-Pyrénées",
    hubCity: "Lourdes",
    serviceRadius: "20 à 35 km",
    address: "Lourdes, Tarbes et vallées des Pyrénées",
    pricingNote: "Déplacement gratuit jusqu'à 15 km autour de Lourdes",
    heroBadge: "Dépannage informatique à domicile — Lourdes & Bigorre",
    areaSummary:
      "Lourdes, Tarbes, Argelès-Gazost, Jarret, Bagnères-de-Bigorre, Luz-Saint-Sauveur et environs",
    nearbyCities: [
      "Lourdes",
      "Tarbes",
      "Argelès-Gazost",
      "Jarret",
      "Bagnères-de-Bigorre",
      "Pierrefitte-Nestalas",
    ],
    geo: { lat: 43.0941, lng: -0.0458 },
    mapBbox: "-0.25,42.95,0.15,43.35",
    faqZoneAnswer:
      "J'interviens à Lourdes, Tarbes, Argelès-Gazost, Jarret, Bagnères-de-Bigorre et dans un rayon de 20 à 35 km dans les Hautes-Pyrénées. Le déplacement est gratuit jusqu'à 15 km autour de Lourdes.",
  },
};

export const DEFAULT_REGION: RegionId = "toulouse";

export function getRegionConfig(id: RegionId): RegionConfig {
  return regions[id];
}

export function isRegionId(value: string): value is RegionId {
  return value === "toulouse" || value === "lourdes";
}
