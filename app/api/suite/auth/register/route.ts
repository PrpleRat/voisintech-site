import { NextRequest } from "next/server";
import { registerSuiteAccount } from "@/lib/suite/account-service";
import { suiteError, suiteJson } from "@/lib/suite/responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await registerSuiteAccount({
      email: body.email ?? "",
      password: body.password ?? "",
      businessName: body.businessName ?? "",
      ownerName: body.ownerName,
    });

    return suiteJson({
      success: true,
      ...result,
      message:
        "Compte Train Suite créé. Conservez la clé API — elle ne sera plus affichée.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inscription";
    return suiteError(message, message.includes("existe déjà") ? 409 : 400);
  }
}
