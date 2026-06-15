import { NextRequest } from "next/server";
import { loginSuiteAccount } from "@/lib/suite/account-service";
import { suiteError, suiteJson } from "@/lib/suite/responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await loginSuiteAccount({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    return suiteJson({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur connexion";
    return suiteError(message, 401);
  }
}
