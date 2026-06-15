import { getPrisma } from "../lib/prisma";
import { hashApiKey, isApiKeyFormat } from "../lib/suite/api-key";
import { seedVoisinTechServices } from "../lib/suite/service-catalog";

async function resolveWorkspaceId(): Promise<string | null> {
  const workspaceId = process.env.TRAIN_SUITE_WORKSPACE_ID?.trim();
  if (workspaceId) return workspaceId;

  const apiKey = process.env.TRAIN_SUITE_API_KEY?.trim();
  if (!apiKey || !isApiKeyFormat(apiKey)) return null;

  const prisma = await getPrisma();
  const record = await prisma.suiteApiKey.findFirst({
    where: { keyHash: hashApiKey(apiKey), revokedAt: null },
    select: { workspaceId: true },
  });
  return record?.workspaceId ?? null;
}

async function main() {
  const workspaceId = await resolveWorkspaceId();
  if (!workspaceId) {
    console.error("Définissez TRAIN_SUITE_WORKSPACE_ID ou TRAIN_SUITE_API_KEY");
    process.exit(1);
  }

  const prisma = await getPrisma();
  const services = await seedVoisinTechServices(prisma, workspaceId);
  console.log(`Catalogue VoisinTech seedé — ${services.length} prestation(s) sur workspace ${workspaceId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
