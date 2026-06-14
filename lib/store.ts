import { getPrisma } from "@/lib/prisma";
import {
  parseSpecs,
  type PublicStoreData,
  type PublicStoreItem,
  type PublicStorePack,
  type StoreCategory,
} from "@/lib/store-utils";

export * from "@/lib/store-utils";

function packCanBeFulfilled(
  packItems: { quantity: number; item: { quantity: number } }[]
): boolean {
  return packItems.every((pi) => pi.item.quantity >= pi.quantity);
}

export async function getPublicStoreData(): Promise<PublicStoreData> {
  const prisma = await getPrisma();

  const [items, packs] = await Promise.all([
    prisma.storeItem.findMany({
      where: { visibleOnStore: true, quantity: { gt: 0 } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.storePack.findMany({
      where: { visibleOnStore: true },
      include: { items: { include: { item: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const publicItems: PublicStoreItem[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category as StoreCategory,
    sellPriceCents: item.sellPriceCents,
    quantity: item.quantity,
    specs: parseSpecs(item.specs),
    imageUrl: item.imageUrl,
  }));

  const publicPacks: PublicStorePack[] = packs
    .filter((pack) => packCanBeFulfilled(pack.items))
    .map((pack) => ({
      id: pack.id,
      name: pack.name,
      description: pack.description,
      sellPriceCents: pack.sellPriceCents,
      items: pack.items.map((pi) => ({
        itemId: pi.itemId,
        name: pi.item.name,
        quantity: pi.quantity,
      })),
    }));

  const hasVisiblePcs = publicItems.some((item) => item.category === "pc");

  return { items: publicItems, packs: publicPacks, hasVisiblePcs };
}

export async function getAdminInventoryData() {
  const prisma = await getPrisma();

  const [items, packs] = await Promise.all([
    prisma.storeItem.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.storePack.findMany({
      include: { items: { include: { item: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { items, packs };
}
