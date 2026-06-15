import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import { suiteError, suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

type RouteParams = { params: Promise<{ id: string }> };

function clientPayload(client: {
  id: string;
  externalId: string | null;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}) {
  return {
    id: client.id,
    externalId: client.externalId,
    name: client.name,
    companyName: client.companyName,
    email: client.email,
    phone: client.phone,
    address: client.address,
    notes: client.notes,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
    deletedAt: client.deletedAt?.toISOString() ?? null,
  };
}

async function loadClient(workspaceId: string, id: string) {
  const prisma = await getPrisma();
  return prisma.suiteClient.findFirst({
    where: { id, workspaceId },
  });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const { id } = await params;
  const client = await loadClient(auth.workspaceId, id);
  if (!client || client.deletedAt) {
    return suiteError("Client introuvable", 404);
  }

  return suiteJson({ client: clientPayload(client) });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const { id } = await params;
  const existing = await loadClient(auth.workspaceId, id);
  if (!existing || existing.deletedAt) {
    return suiteError("Client introuvable", 404);
  }

  const body = await request.json();
  const prisma = await getPrisma();

  const updated = await prisma.suiteClient.update({
    where: { id },
    data: {
      name: body.name !== undefined ? String(body.name).trim() : undefined,
      companyName: body.companyName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      notes: body.notes,
      externalId: body.externalId,
      deletedAt: body.deletedAt === null ? null : undefined,
    },
  });

  return suiteJson({ client: clientPayload(updated) });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const { id } = await params;
  const existing = await loadClient(auth.workspaceId, id);
  if (!existing || existing.deletedAt) {
    return suiteError("Client introuvable", 404);
  }

  const prisma = await getPrisma();
  const updated = await prisma.suiteClient.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return suiteJson({ client: clientPayload(updated), deleted: true });
}
