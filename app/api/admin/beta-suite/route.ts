import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const prisma = await getPrisma();
    const signups = await prisma.suiteBetaSignup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ signups });
  } catch (error) {
    console.error("[API Admin Beta Suite]", error);
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
    const { action, id, status } = body;
    const prisma = await getPrisma();

    if (action === "update-status" && id && status) {
      await prisma.suiteBetaSignup.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "delete" && id) {
      await prisma.suiteBetaSignup.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("[API Admin Beta Suite POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
