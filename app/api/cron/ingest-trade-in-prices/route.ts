import { NextRequest, NextResponse } from "next/server";
import { ingestTradeInEntries, type TradeInIngestEntry } from "@/lib/trade-in-sync";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret") === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      entries: TradeInIngestEntry[];
      summary?: {
        modelsTotal: number;
        modelsOk: number;
        modelsFailed: number;
        details: string;
      };
    };

    if (!Array.isArray(body.entries) || body.entries.length === 0) {
      return NextResponse.json({ error: "entries requis" }, { status: 400 });
    }

    const result = await ingestTradeInEntries(body.entries, body.summary);

    return NextResponse.json({
      success: true,
      message: "Ingestion prix reprise terminée",
      ...result,
    });
  } catch (error) {
    console.error("[Cron Ingest TradeIn]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur ingest" },
      { status: 500 }
    );
  }
}
