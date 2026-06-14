import { NextResponse } from "next/server";
import { getPublicStoreData } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicStoreData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Store GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
