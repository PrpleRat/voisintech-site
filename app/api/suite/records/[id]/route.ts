import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import { parseRecordWriteBody, recordToDTO } from "@/lib/suite/business-records";
import { suiteError, suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

type RouteParams = { params: Promise<{ id: string }> };

async function loadRecord(workspaceId: string, id: string) {
  const prisma = await getPrisma();
  return prisma.suiteBusinessRecord.findFirst({
    where: { id, workspaceId },
  });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const { id } = await params;
  const record = await loadRecord(auth.workspaceId, id);
  if (!record || record.deletedAt) {
    return suiteError("Enregistrement introuvable", 404);
  }

  return suiteJson({ record: recordToDTO(record) });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const { id } = await params;
  const existing = await loadRecord(auth.workspaceId, id);
  if (!existing || existing.deletedAt) {
    return suiteError("Enregistrement introuvable", 404);
  }

  try {
    const body = await request.json();
    const parsed = parseRecordWriteBody(body, false);
    const prisma = await getPrisma();

    const updated = await prisma.suiteBusinessRecord.update({
      where: { id },
      data: {
        kind: parsed.kind,
        source: parsed.source,
        externalId: parsed.externalId,
        payload: parsed.payload,
        deletedAt: body.deletedAt === null ? null : undefined,
      },
    });

    return suiteJson({ record: recordToDTO(updated) });
  } catch (error) {
    if (error instanceof Error && error.message) {
      return suiteError(error.message);
    }
    console.error("[Suite records PATCH]", error);
    return suiteError("Erreur mise à jour enregistrement", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const { id } = await params;
  const existing = await loadRecord(auth.workspaceId, id);
  if (!existing || existing.deletedAt) {
    return suiteError("Enregistrement introuvable", 404);
  }

  const prisma = await getPrisma();
  const updated = await prisma.suiteBusinessRecord.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return suiteJson({ record: recordToDTO(updated), deleted: true });
}
