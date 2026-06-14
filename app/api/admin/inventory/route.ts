import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { getAdminInventoryData, serializeSpecs, type PcSpecs } from "@/lib/store";

type PackLineInput = { itemId: string; quantity: number };

function parseCategory(value: unknown): string | null {
  if (value === "accessory" || value === "pc" || value === "other") return value;
  return null;
}

function parsePackItems(raw: unknown): PackLineInput[] | null {
  if (!Array.isArray(raw)) return null;
  const lines: PackLineInput[] = [];
  for (const entry of raw) {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof (entry as PackLineInput).itemId !== "string" ||
      typeof (entry as PackLineInput).quantity !== "number" ||
      (entry as PackLineInput).quantity < 1
    ) {
      return null;
    }
    lines.push({ itemId: (entry as PackLineInput).itemId, quantity: (entry as PackLineInput).quantity });
  }
  return lines;
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await getAdminInventoryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Admin Inventory GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;
    const prisma = await getPrisma();

    if (action === "create-item") {
      const category = parseCategory(body.category);
      if (!category || !body.name || typeof body.sellPriceCents !== "number") {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }

      const item = await prisma.storeItem.create({
        data: {
          name: String(body.name).trim(),
          description: String(body.description || "").trim(),
          category,
          buyPriceCents: Number(body.buyPriceCents) || 0,
          sellPriceCents: Number(body.sellPriceCents),
          quantity: Number(body.quantity) || 0,
          visibleOnStore: body.visibleOnStore !== false,
          specs: serializeSpecs(body.specs as PcSpecs | undefined),
          imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
        },
      });
      return NextResponse.json({ success: true, item });
    }

    if (action === "update-item") {
      const category = parseCategory(body.category);
      if (!body.id || !category || !body.name || typeof body.sellPriceCents !== "number") {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }

      const item = await prisma.storeItem.update({
        where: { id: body.id },
        data: {
          name: String(body.name).trim(),
          description: String(body.description || "").trim(),
          category,
          buyPriceCents: Number(body.buyPriceCents) || 0,
          sellPriceCents: Number(body.sellPriceCents),
          quantity: Number(body.quantity) || 0,
          visibleOnStore: body.visibleOnStore !== false,
          specs: serializeSpecs(body.specs as PcSpecs | undefined),
          imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
        },
      });
      return NextResponse.json({ success: true, item });
    }

    if (action === "delete-item") {
      if (!body.id) {
        return NextResponse.json({ error: "Id manquant" }, { status: 400 });
      }
      await prisma.storeItem.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }

    if (action === "create-pack") {
      const packItems = parsePackItems(body.items);
      if (!body.name || typeof body.sellPriceCents !== "number" || !packItems?.length) {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }

      const pack = await prisma.storePack.create({
        data: {
          name: String(body.name).trim(),
          description: String(body.description || "").trim(),
          sellPriceCents: Number(body.sellPriceCents),
          visibleOnStore: body.visibleOnStore !== false,
          items: {
            create: packItems.map((line) => ({
              itemId: line.itemId,
              quantity: line.quantity,
            })),
          },
        },
        include: { items: { include: { item: true } } },
      });
      return NextResponse.json({ success: true, pack });
    }

    if (action === "update-pack") {
      const packItems = parsePackItems(body.items);
      if (!body.id || !body.name || typeof body.sellPriceCents !== "number" || !packItems?.length) {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }

      const pack = await prisma.$transaction(async (tx) => {
        await tx.storePackItem.deleteMany({ where: { packId: body.id } });
        return tx.storePack.update({
          where: { id: body.id },
          data: {
            name: String(body.name).trim(),
            description: String(body.description || "").trim(),
            sellPriceCents: Number(body.sellPriceCents),
            visibleOnStore: body.visibleOnStore !== false,
            items: {
              create: packItems.map((line) => ({
                itemId: line.itemId,
                quantity: line.quantity,
              })),
            },
          },
          include: { items: { include: { item: true } } },
        });
      });
      return NextResponse.json({ success: true, pack });
    }

    if (action === "delete-pack") {
      if (!body.id) {
        return NextResponse.json({ error: "Id manquant" }, { status: 400 });
      }
      await prisma.storePack.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("[API Admin Inventory POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
