import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { isSpamSubmission } from "@/lib/antispam";
import { sendOwnerSms } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSpamSubmission(body)) {
      return NextResponse.json({ success: true, id: "spam-blocked" });
    }

    const { name, email, phone, activity, appsInterested, message } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Nom, email et téléphone sont requis." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    if (!/^[\d\s+().-]{8,}$/.test(phone)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }

    const apps = Array.isArray(appsInterested)
      ? appsInterested.filter((a: unknown) => typeof a === "string")
      : [];

    if (apps.length === 0) {
      return NextResponse.json(
        { error: "Sélectionnez au moins une app de la suite." },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.suiteBetaSignup.findFirst({
      where: { email: normalizedEmail, status: { in: ["new", "invited"] } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà inscrit à la beta. On vous recontacte très vite." },
        { status: 409 }
      );
    }

    const signup = await prisma.suiteBetaSignup.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        activity: typeof activity === "string" ? activity.trim() : "",
        appsInterested: JSON.stringify(apps),
        message: typeof message === "string" ? message.trim() : "",
      },
    });

    await sendOwnerSms(
      `[Train Suite] Beta iOS: ${name.trim()} — ${phone.trim()} — ${apps.join(", ")}`
    ).catch(() => undefined);

    return NextResponse.json({ success: true, id: signup.id });
  } catch (error) {
    console.error("[API Suite Beta]", error);
    return NextResponse.json({ error: "Erreur serveur. Réessayez." }, { status: 500 });
  }
}
