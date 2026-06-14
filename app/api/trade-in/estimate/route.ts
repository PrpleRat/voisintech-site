import { NextRequest, NextResponse } from "next/server";
import { CUSTOM_MODEL_ID, type TradeInCategoryId } from "@/config/trade-in";
import { getSearchQuery } from "@/config/trade-in-meta";
import { estimateTradeInValue } from "@/lib/trade-in-estimate";
import { syncOneModelPrice } from "@/lib/trade-in-sync";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryId,
      modelId,
      condition,
      storage,
      defects,
      exactModel,
      liveScrape,
    } = body as {
      categoryId: TradeInCategoryId;
      modelId: string;
      condition: string;
      storage?: string;
      defects?: string[];
      exactModel?: string;
      liveScrape?: boolean;
    };

    if (!categoryId || !modelId || !condition) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    if (modelId === CUSTOM_MODEL_ID && !exactModel?.trim()) {
      return NextResponse.json(
        { error: "Précisez le modèle exact pour une estimation fiable." },
        { status: 400 }
      );
    }

    const searchQuery = getSearchQuery(modelId, exactModel);
    const cacheModelId =
      modelId === CUSTOM_MODEL_ID ? `custom:${searchQuery.toLowerCase()}` : modelId;

    if (liveScrape || exactModel?.trim()) {
      await syncOneModelPrice(cacheModelId, categoryId, searchQuery);
    }

    const estimate = await estimateTradeInValue({
      categoryId,
      modelId,
      condition,
      storage,
      defects: Array.isArray(defects) ? defects : [],
      exactModel,
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimation impossible." }, { status: 400 });
    }

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error("[API TradeIn Estimate]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
