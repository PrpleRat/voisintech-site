import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = await getPrisma();
    const reviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[API Reviews GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, comment } = body;

    if (!name || !comment) {
      return NextResponse.json(
        { error: "Nom et commentaire sont requis." },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Note invalide (1 à 5 étoiles)." },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const review = await prisma.review.create({
      data: {
        name,
        rating: ratingNum,
        comment,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Merci ! Votre avis sera publié après validation.",
      id: review.id,
    });
  } catch (error) {
    console.error("[API Reviews POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
