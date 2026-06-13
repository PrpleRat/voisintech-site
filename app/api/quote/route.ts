import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { isSpamSubmission } from "@/lib/antispam";
import { sendOwnerSms } from "@/lib/sms";
import {
  sendQuoteConfirmationToClient,
  sendQuoteNotificationToOwner,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSpamSubmission(body)) {
      return NextResponse.json({ success: true, id: "spam-blocked" });
    }

    const {
      deviceType,
      problemDesc,
      name,
      phone,
      email,
      address,
      city,
      preferredDays,
      preferredTime,
      preferredDate,
    } = body;

    if (!deviceType || !problemDesc || !name || !phone || !email || !address || !city) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    const daysArray = Array.isArray(preferredDays) ? preferredDays : [];
    if (daysArray.length === 0 || !preferredTime) {
      return NextResponse.json(
        { error: "Veuillez indiquer vos disponibilités." },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const quote = await prisma.quoteRequest.create({
      data: {
        deviceType,
        problemDesc,
        name,
        phone,
        email,
        address,
        city,
        preferredDays: JSON.stringify(daysArray),
        preferredTime,
        preferredDate: preferredDate || null,
      },
    });

    const emailData = {
      deviceType,
      problemDesc,
      name,
      phone,
      email,
      address,
      city,
      preferredDays: daysArray.join(", "),
      preferredTime,
      preferredDate,
    };

    const emailResults = await Promise.all([
      sendQuoteNotificationToOwner(emailData),
      sendQuoteConfirmationToClient(emailData),
    ]);

    const ownerResults = emailResults[0];
    const clientResult = emailResults[1];
    const ownerOk = ownerResults.some((r) => r.success);
    const clientOk = clientResult.success;

    if (!ownerOk) {
      console.error("[API Quote] Échec notification propriétaire:", ownerResults);
    }
    if (!clientOk) {
      console.error("[API Quote] Échec confirmation client:", clientResult);
    }

    await sendOwnerSms(
      `[VoisinTech] Nouveau devis: ${name} — ${deviceType} — ${phone}. Voir admin.`
    );

    return NextResponse.json({
      success: true,
      id: quote.id,
      emails: {
        owner: ownerOk,
        client: clientOk,
      },
    });
  } catch (error) {
    console.error("[API Quote]", error);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer ou nous appeler." },
      { status: 500 }
    );
  }
}
