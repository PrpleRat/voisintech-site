import { getPrisma } from "../lib/prisma";
import { seedVoisinTechServices } from "../lib/suite/service-catalog";
import { resolveVoisinTechWorkspaceId } from "../lib/suite/resolve-voisintech-workspace";

async function main() {
  const prisma = await getPrisma();
  const workspaceId = await resolveVoisinTechWorkspaceId(prisma);
  if (!workspaceId) {
    console.error(
      "Workspace introuvable. Connecte FactuTrain une fois ou définis TRAIN_SUITE_WORKSPACE_ID / TRAIN_SUITE_API_KEY sur Vercel."
    );
    process.exit(1);
  }

  const services = await seedVoisinTechServices(prisma, workspaceId);
  console.log(`Catalogue VoisinTech seedé — ${services.length} prestation(s) sur workspace ${workspaceId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
