import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { hashApiKey, isApiKeyFormat } from "@/lib/suite/api-key";
import { verifyAccessToken } from "@/lib/suite/jwt";

export type SuiteAuthContext = {
  workspaceId: string;
  accountId?: string;
  email?: string;
  via: "jwt" | "api_key";
};

export async function resolveSuiteAuth(request: NextRequest): Promise<SuiteAuthContext | null> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.slice("Bearer ".length).trim();
  if (!token) return null;

  if (isApiKeyFormat(token)) {
    return resolveApiKey(token);
  }

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return {
    workspaceId: payload.workspaceId,
    accountId: payload.sub,
    email: payload.email,
    via: "jwt",
  };
}

async function resolveApiKey(key: string): Promise<SuiteAuthContext | null> {
  const prisma = await getPrisma();
  const keyHash = hashApiKey(key);

  const record = await prisma.suiteApiKey.findFirst({
    where: {
      keyHash,
      revokedAt: null,
    },
  });

  if (!record) return null;

  await prisma.suiteApiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    workspaceId: record.workspaceId,
    via: "api_key",
  };
}

export async function assertWorkspaceMembership(
  accountId: string,
  workspaceId: string
): Promise<boolean> {
  const prisma = await getPrisma();
  const membership = await prisma.suiteMembership.findUnique({
    where: {
      accountId_workspaceId: { accountId, workspaceId },
    },
  });
  return membership != null;
}
