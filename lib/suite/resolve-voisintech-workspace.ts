import type { PrismaClient } from "@prisma/client";
import { hashApiKey, isApiKeyFormat } from "@/lib/suite/api-key";

/** Résout le workspace VoisinTech (env → clé API → profil cloud en base). */
export async function resolveVoisinTechWorkspaceId(
  prisma: PrismaClient
): Promise<string | null> {
  const fromEnv = process.env.TRAIN_SUITE_WORKSPACE_ID?.trim();
  if (fromEnv) return fromEnv;

  const apiKey = process.env.TRAIN_SUITE_API_KEY?.trim();
  if (apiKey && isApiKeyFormat(apiKey)) {
    const record = await prisma.suiteApiKey.findFirst({
      where: { keyHash: hashApiKey(apiKey), revokedAt: null },
      select: { workspaceId: true },
    });
    if (record) return record.workspaceId;
  }

  const ownerEmails = [
    process.env.GMAIL_USER,
    process.env.NOTIFICATION_EMAIL,
    "voisintech3@gmail.com",
  ]
    .map((email) => email?.trim().toLowerCase())
    .filter((email): email is string => Boolean(email));

  for (const email of [...new Set(ownerEmails)]) {
    const profile = await prisma.suiteBusinessProfile.findFirst({
      where: { email },
      select: { workspaceId: true },
    });
    if (profile) return profile.workspaceId;
  }

  const voisinProfile = await prisma.suiteBusinessProfile.findFirst({
    where: {
      OR: [
        { businessName: { contains: "VoisinTech" } },
        { businessName: { contains: "voisintech" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    select: { workspaceId: true },
  });
  if (voisinProfile) return voisinProfile.workspaceId;

  const siteKey = await prisma.suiteApiKey.findFirst({
    where: { name: "Site VoisinTech", revokedAt: null },
    orderBy: { createdAt: "asc" },
    select: { workspaceId: true },
  });
  if (siteKey) return siteKey.workspaceId;

  const workspaceCount = await prisma.suiteWorkspace.count();
  if (workspaceCount === 1) {
    const only = await prisma.suiteWorkspace.findFirst({ select: { id: true } });
    return only?.id ?? null;
  }

  return null;
}

export function voisinTechWorkspaceSetupHint(): string {
  return [
    "Workspace Train Suite introuvable.",
    "1) Connecte-toi une fois sur FactuTrain avec ton compte cloud, ou",
    "2) Sur Vercel → Settings → Environment Variables, ajoute TRAIN_SUITE_WORKSPACE_ID (id du workspace)",
    "ou TRAIN_SUITE_API_KEY (clé tsk_live_… affichée à l'inscription).",
  ].join(" ");
}
