import { getPrisma } from "@/lib/prisma";
import { purgeOldDeletedSuiteClients } from "@/lib/suite/purge-deleted-clients";
import { suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  return request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return suiteUnauthorized();

  const prisma = await getPrisma();
  const purged = await purgeOldDeletedSuiteClients(prisma);

  return suiteJson({
    ok: true,
    purged,
    retentionDays: 90,
  });
}
