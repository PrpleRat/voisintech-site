import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { isSpamSubmission } from "@/lib/antispam";
import { sendOwnerSms } from "@/lib/sms";
import {
  sendProRequestConfirmationToClient,
  sendProRequestNotificationToOwner,
} from "@/lib/email";
import type { ProServiceType } from "@/config/pro-forms";

const VALID_TYPES: ProServiceType[] = ["site-web", "urssaf"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSpamSubmission(body)) {
      return NextResponse.json({ success: true, id: "spam-blocked" });
    }

    const { serviceType, contact, details } = body;

    if (!serviceType || !VALID_TYPES.includes(serviceType)) {
      return NextResponse.json({ error: "Type de service invalide." }, { status: 400 });
    }

    if (!contact?.name || !contact?.phone || !contact?.email || !contact?.city) {
      return NextResponse.json(
        { error: "Nom, téléphone, email et ville sont requis." },
        { status: 400 }
      );
    }

    if (!details || typeof details !== "object") {
      return NextResponse.json({ error: "Détails du projet manquants." }, { status: 400 });
    }

    const prisma = await getPrisma();
    const record = await prisma.proRequest.create({
      data: {
        serviceType,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        company: contact.company || null,
        city: contact.city,
        details: JSON.stringify(details),
      },
    });

    const emailData = {
      serviceType: serviceType as ProServiceType,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      company: contact.company || undefined,
      city: contact.city,
      details,
    };

    const [ownerResults, clientResult] = await Promise.all([
      sendProRequestNotificationToOwner(emailData),
      sendProRequestConfirmationToClient(emailData),
    ]);

    const ownerOk = ownerResults.some((r) => r.success);
    const label = serviceType === "site-web" ? "Site web" : "URSSAF";

    await sendOwnerSms(
      `[VoisinTech] Demande Pro ${label}: ${contact.name} — ${contact.phone}`
    );

    return NextResponse.json({
      success: true,
      id: record.id,
      emails: { owner: ownerOk, client: clientResult.success },
    });
  } catch (error) {
    console.error("[API ProRequest]", error);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer ou nous appeler." },
      { status: 500 }
    );
  }
}
