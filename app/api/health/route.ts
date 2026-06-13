import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTursoConfig } from "@/lib/turso-config";

export async function GET() {
  try {
    const turso = getTursoConfig();
    const count = await prisma.quoteRequest.count();
    return NextResponse.json({
      ok: true,
      database: turso ? "turso" : "sqlite-local",
      tursoUrl: turso?.url ?? null,
      quotes: count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
