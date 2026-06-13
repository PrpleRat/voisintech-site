import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { isSpamSubmission } from "@/lib/antispam";
import { sendOwnerSms } from "@/lib/sms";
import {
  sendContactConfirmationToClient,
  sendContactNotificationToOwner,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSpamSubmission(body)) {
      return NextResponse.json({ success: true, id: "spam-blocked" });
    }

    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const contact = await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, message },
    });

    const emailData = { name, email, phone, message };

    await Promise.all([
      sendContactNotificationToOwner(emailData),
      sendContactConfirmationToClient(emailData),
    ]);

    await sendOwnerSms(`[VoisinTech] Nouveau message: ${name} — ${email}`);

    return NextResponse.json({ success: true, id: contact.id });
  } catch (error) {
    console.error("[API Contact]", error);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
