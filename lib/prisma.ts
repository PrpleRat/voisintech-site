import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { getTursoConfig, isProductionWithoutTurso } from "./turso-config";
import { ensureTursoTables } from "./turso-migrate";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPromise: Promise<PrismaClient> | undefined;
};

function createPrismaClient() {
  const turso = getTursoConfig();

  if (isProductionWithoutTurso()) {
    console.error(
      "[Prisma] Production sans Turso — configurez TURSO_AUTH_TOKEN et TURSO_DATABASE_URL (ou DATABASE_URL libsql://) sur Vercel"
    );
  }

  if (turso) {
    const libsql = createClient({
      url: turso.url,
      authToken: turso.authToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  if (!globalForPrisma.prismaPromise) {
    globalForPrisma.prismaPromise = (async () => {
      await ensureTursoTables();
      const client = createPrismaClient();
      globalForPrisma.prisma = client;
      return client;
    })();
  }

  return globalForPrisma.prismaPromise;
}
