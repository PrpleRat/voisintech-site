import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import { generateApiKey } from "@/lib/suite/api-key";
import { suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

export async function GET(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth || auth.via !== "jwt") {
    return suiteUnauthorized("Connexion requise (token utilisateur)");
  }

  const prisma = await getPrisma();
  const keys = await prisma.suiteApiKey.findMany({
    where: { workspaceId: auth.workspaceId, revokedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return suiteJson({ apiKeys: keys });
}

export async function POST(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth || auth.via !== "jwt") {
    return suiteUnauthorized("Connexion requise (token utilisateur)");
  }

  const body = await request.json().catch(() => ({}));
  const name = (body.name ?? "Clé API").trim() || "Clé API";
  const { fullKey, prefix, hash } = generateApiKey();

  const prisma = await getPrisma();
  const apiKey = await prisma.suiteApiKey.create({
    data: {
      workspaceId: auth.workspaceId,
      name,
      keyPrefix: prefix,
      keyHash: hash,
    },
  });

  return suiteJson(
    {
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        fullKey,
        createdAt: apiKey.createdAt.toISOString(),
      },
      message: "Conservez cette clé — elle ne sera plus affichée.",
    },
    201
  );
}
