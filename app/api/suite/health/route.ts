import { suiteJson } from "@/lib/suite/responses";

export async function GET() {
  return suiteJson({
    ok: true,
    service: "Train Suite API",
    version: 1,
    endpoints: [
      "POST /api/suite/auth/register",
      "POST /api/suite/auth/login",
      "POST /api/suite/auth/refresh",
      "GET|POST /api/suite/clients",
      "GET|PATCH|DELETE /api/suite/clients/:id",
      "GET|PUT /api/suite/profile",
      "GET|PUT|PATCH /api/suite/services",
      "GET|POST /api/suite/api-keys",
    ],
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
