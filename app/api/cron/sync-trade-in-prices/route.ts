import { NextRequest, NextResponse } from "next/server";
import { syncAllCatalogPrices } from "@/lib/trade-in-sync";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const result = await syncAllCatalogPrices({ skipCustom: true });
    return NextResponse.json({
      success: true,
      message: "Synchronisation prix reprise terminée",
      ...result,
    });
  } catch (error) {
    console.error("[Cron Sync TradeIn]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur sync" },
      { status: 500 }
    );
  }
}

export const maxDuration = 300;
