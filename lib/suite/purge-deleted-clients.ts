import type { PrismaClient } from "@prisma/client";

/** Clients soft-deleted longer than this are permanently removed from Turso. */
export const SUITE_DELETED_CLIENT_RETENTION_DAYS = 90;

export async function purgeOldDeletedSuiteClients(
  prisma: PrismaClient,
  workspaceId?: string
): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - SUITE_DELETED_CLIENT_RETENTION_DAYS);

  const result = await prisma.suiteClient.deleteMany({
    where: {
      ...(workspaceId ? { workspaceId } : {}),
      deletedAt: { not: null, lt: cutoff },
    },
  });

  return result.count;
}
