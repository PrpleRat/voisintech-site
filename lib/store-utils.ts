export type StoreCategory = "accessory" | "pc" | "other";

export interface PcSpecs {
  cpu?: string;
  ram?: string;
  storage?: string;
  screen?: string;
}

export interface PublicStoreItem {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  sellPriceCents: number;
  quantity: number;
  specs: PcSpecs | null;
  imageUrl: string | null;
}

export interface PublicPackItem {
  itemId: string;
  name: string;
  quantity: number;
}

export interface PublicStorePack {
  id: string;
  name: string;
  description: string;
  sellPriceCents: number;
  items: PublicPackItem[];
}

export interface PublicStoreData {
  items: PublicStoreItem[];
  packs: PublicStorePack[];
  hasVisiblePcs: boolean;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function parseSpecs(raw: string | null | undefined): PcSpecs | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PcSpecs;
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function serializeSpecs(specs: PcSpecs | null | undefined): string | null {
  if (!specs) return null;
  const cleaned = Object.fromEntries(
    Object.entries(specs).filter(([, v]) => v && String(v).trim())
  );
  return Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : null;
}
