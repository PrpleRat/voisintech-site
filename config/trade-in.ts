export type TradeInCategoryId =
  | "smartphone"
  | "tablet"
  | "laptop"
  | "desktop"
  | "monitor"
  | "console";

export interface TradeInModel {
  id: string;
  label: string;
  /** Valeur de reprise de base (excellent état, fonctionnel, avec chargeur) */
  baseValue: number;
  notes?: string;
}

export const CUSTOM_MODEL_ID = "custom";

export interface TradeInCategory {
  id: TradeInCategoryId;
  label: string;
  models: TradeInModel[];
  storageOptions?: { value: string; label: string; modifier: number }[];
}

/** Barèmes indicatifs reprise VoisinTech — marché occasion FR, marge revente intégrée */
export const tradeInCatalog: TradeInCategory[] = [
  {
    id: "smartphone",
    label: "Smartphone",
    storageOptions: [
      { value: "64", label: "64 Go ou moins", modifier: -15 },
      { value: "128", label: "128 Go", modifier: 0 },
      { value: "256", label: "256 Go", modifier: 25 },
      { value: "512+", label: "512 Go et plus", modifier: 45 },
    ],
    models: [
      { id: "iphone-15-pro", label: "iPhone 15 Pro / Pro Max", baseValue: 520 },
      { id: "iphone-15", label: "iPhone 15 / 15 Plus", baseValue: 380 },
      { id: "iphone-14-pro", label: "iPhone 14 Pro / Pro Max", baseValue: 420 },
      { id: "iphone-14", label: "iPhone 14 / 14 Plus", baseValue: 300 },
      { id: "iphone-13", label: "iPhone 13 / 13 mini", baseValue: 220 },
      { id: "iphone-12", label: "iPhone 12 / 12 mini", baseValue: 160 },
      { id: "iphone-11", label: "iPhone 11 / XR / XS", baseValue: 95 },
      { id: "iphone-se", label: "iPhone SE (2020/2022)", baseValue: 110 },
      { id: "iphone-old", label: "iPhone plus ancien (X et avant)", baseValue: 45 },
      { id: "samsung-s24", label: "Samsung Galaxy S24 / S24+", baseValue: 380 },
      { id: "samsung-s23", label: "Samsung Galaxy S23 / S22", baseValue: 240 },
      { id: "samsung-a", label: "Samsung Galaxy A (récent)", baseValue: 95 },
      { id: "xiaomi-recent", label: "Xiaomi / Redmi récent", baseValue: 75 },
      { id: "android-old", label: "Android entrée de gamme / ancien", baseValue: 25 },
      { id: CUSTOM_MODEL_ID, label: "Autre modèle (préciser ci-dessous)", baseValue: 40 },
    ],
  },
  {
    id: "tablet",
    label: "Tablette",
    storageOptions: [
      { value: "64", label: "64 Go ou moins", modifier: -20 },
      { value: "128", label: "128 Go", modifier: 0 },
      { value: "256+", label: "256 Go et plus", modifier: 35 },
    ],
    models: [
      { id: "ipad-pro-recent", label: "iPad Pro (2021+)", baseValue: 420 },
      { id: "ipad-air", label: "iPad Air (2020+)", baseValue: 260 },
      { id: "ipad-std", label: "iPad standard (2019+)", baseValue: 160 },
      { id: "ipad-mini", label: "iPad mini (2019+)", baseValue: 200 },
      { id: "ipad-old", label: "iPad plus ancien", baseValue: 55 },
      { id: "samsung-tab", label: "Samsung Galaxy Tab récent", baseValue: 120 },
      { id: "tab-other", label: "Autre tablette Android", baseValue: 45 },
      { id: CUSTOM_MODEL_ID, label: "Autre modèle (préciser ci-dessous)", baseValue: 35 },
    ],
  },
  {
    id: "laptop",
    label: "Ordinateur portable",
    models: [
      { id: "mbp-m3", label: "MacBook Pro M3 / M3 Pro (14\"+)", baseValue: 1100 },
      { id: "mba-m3", label: "MacBook Air M3", baseValue: 780 },
      { id: "mba-m2", label: "MacBook Air M2", baseValue: 620 },
      { id: "mba-m1", label: "MacBook Air M1", baseValue: 450 },
      { id: "mbp-m1m2", label: "MacBook Pro M1 / M2", baseValue: 750 },
      { id: "mac-intel-recent", label: "MacBook Intel (2018-2020)", baseValue: 220 },
      { id: "mac-intel-old", label: "MacBook Intel plus ancien", baseValue: 90 },
      { id: "win-gaming", label: "PC portable gamer (RTX 3060+)", baseValue: 580 },
      { id: "win-premium", label: "PC portable récent (i5/Ryzen 5, 16Go+)", baseValue: 280 },
      { id: "win-standard", label: "PC portable standard (i3/i5, 8Go)", baseValue: 150 },
      { id: "win-old", label: "PC portable ancien (>6 ans)", baseValue: 45 },
      { id: "chromebook", label: "Chromebook", baseValue: 55 },
      { id: CUSTOM_MODEL_ID, label: "Autre modèle (préciser ci-dessous)", baseValue: 50 },
    ],
  },
  {
    id: "desktop",
    label: "PC fixe / iMac",
    models: [
      { id: "imac-m", label: "iMac M1 / M3", baseValue: 620 },
      { id: "imac-intel", label: "iMac Intel (2017+)", baseValue: 180 },
      { id: "mac-mini-m", label: "Mac mini M1 / M2", baseValue: 380 },
      { id: "pc-gaming", label: "PC fixe gamer (RTX dédiée)", baseValue: 520 },
      { id: "pc-bureau", label: "PC bureau standard", baseValue: 95 },
      { id: "pc-old", label: "PC fixe ancien / tour basique", baseValue: 35 },
      { id: CUSTOM_MODEL_ID, label: "Autre modèle (préciser ci-dessous)", baseValue: 40 },
    ],
  },
  {
    id: "monitor",
    label: "Écran",
    models: [
      { id: "mon-4k", label: "Écran 27\"+ 4K / QHD premium", baseValue: 130 },
      { id: "mon-24fhd", label: "Écran 24\" Full HD", baseValue: 55 },
      { id: "mon-old", label: "Écran ancien / 19-22\"", baseValue: 18 },
      { id: CUSTOM_MODEL_ID, label: "Autre modèle (préciser ci-dessous)", baseValue: 20 },
    ],
  },
  {
    id: "console",
    label: "Console de jeux",
    models: [
      { id: "ps5", label: "PlayStation 5", baseValue: 320 },
      { id: "ps4", label: "PlayStation 4 / Pro", baseValue: 95 },
      { id: "xbox-series", label: "Xbox Series S / X", baseValue: 260 },
      { id: "xbox-one", label: "Xbox One", baseValue: 70 },
      { id: "switch-oled", label: "Nintendo Switch OLED", baseValue: 210 },
      { id: "switch", label: "Nintendo Switch classique", baseValue: 130 },
      { id: "switch-lite", label: "Nintendo Switch Lite", baseValue: 75 },
      { id: CUSTOM_MODEL_ID, label: "Autre modèle (préciser ci-dessous)", baseValue: 60 },
    ],
  },
];

export const tradeInConditions = [
  { value: "excellent", label: "Excellent — comme neuf, sans rayure", factor: 1 },
  { value: "good", label: "Bon — micro-rayures, tout fonctionne", factor: 0.88 },
  { value: "fair", label: "Correct — usure visible, batterie ~70%", factor: 0.7 },
  { value: "poor", label: "Usé — rayures/coque abîmée, batterie faible", factor: 0.5 },
  { value: "broken", label: "Défaut majeur — écran cassé ou ne démarre plus", factor: 0.22 },
] as const;

export const tradeInDefects = [
  { value: "screen", label: "Écran fissuré / cassé", modifier: -0.35 },
  { value: "battery", label: "Batterie très faible (<1h)", modifier: -0.12 },
  { value: "no-charger", label: "Sans chargeur / câble", modifier: -0.06 },
  { value: "icloud", label: "Compte iCloud / verrou non retiré", modifier: -0.5 },
] as const;

export function getAllCatalogModels() {
  return tradeInCatalog.flatMap((cat) =>
    cat.models.map((m) => ({ ...m, categoryId: cat.id }))
  );
}

export function getCategoryById(id: TradeInCategoryId) {
  return tradeInCatalog.find((c) => c.id === id);
}
