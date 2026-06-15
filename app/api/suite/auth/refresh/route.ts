import { NextRequest } from "next/server";
import { refreshSuiteSession } from "@/lib/suite/account-service";
import { suiteError, suiteJson } from "@/lib/suite/responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refreshToken = body.refreshToken ?? "";
    if (!refreshToken) {
      return suiteError("refreshToken requis");
    }

    const result = await refreshSuiteSession(refreshToken);
    return suiteJson({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Session invalide";
    return suiteError(message, 401);
  }
}
