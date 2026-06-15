import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import {
  parseKindFilter,
  parseRecordWriteBody,
  recordToDTO,
} from "@/lib/suite/business-records";
import { suiteError, suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

export async function GET(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const sinceRaw = request.nextUrl.searchParams.get("since");
  const since = sinceRaw ? new Date(sinceRaw) : null;
  if (sinceRaw && since && Number.isNaN(since.getTime())) {
    return suiteError("Paramètre since invalide (ISO 8601 attendu)");
  }

  let kinds;
  try {
    kinds = parseKindFilter(request.nextUrl.searchParams.get("kind"));
  } catch (error) {
    return suiteError(error instanceof Error ? error.message : "kind invalide");
  }

  const prisma = await getPrisma();
  const records = await prisma.suiteBusinessRecord.findMany({
    where: {
      workspaceId: auth.workspaceId,
      ...(kinds ? { kind: { in: kinds } } : {}),
      ...(since ? { updatedAt: { gt: since } } : {}),
    },
    orderBy: { updatedAt: "asc" },
  });

  return suiteJson({
    records: records.map(recordToDTO),
    workspaceId: auth.workspaceId,
    syncedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  try {
    const body = await request.json();
    const parsed = parseRecordWriteBody(body, true);
    const { kind, source, externalId, payload } = parsed;
    if (!kind || !source || !externalId || payload === undefined) {
      return suiteError("kind, source, externalId et payload sont requis");
    }

    const prisma = await getPrisma();
    const existing = await prisma.suiteBusinessRecord.findUnique({
      where: {
        workspaceId_kind_externalId: {
          workspaceId: auth.workspaceId,
          kind,
          externalId,
        },
      },
    });

    if (existing) {
      const updated = await prisma.suiteBusinessRecord.update({
        where: { id: existing.id },
        data: {
          source,
          payload,
          deletedAt: null,
        },
      });
      return suiteJson({ record: recordToDTO(updated), upserted: true });
    }

    const record = await prisma.suiteBusinessRecord.create({
      data: {
        workspaceId: auth.workspaceId,
        kind,
        source,
        externalId,
        payload,
      },
    });

    return suiteJson({ record: recordToDTO(record), created: true }, 201);
  } catch (error) {
    if (error instanceof Error && error.message) {
      return suiteError(error.message);
    }
    console.error("[Suite records POST]", error);
    return suiteError("Erreur création enregistrement", 500);
  }
}
