import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import { suiteError, suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

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

export async function GET(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const sinceRaw = request.nextUrl.searchParams.get("since");
  const since = sinceRaw ? new Date(sinceRaw) : null;
  if (sinceRaw && since && Number.isNaN(since.getTime())) {
    return suiteError("Paramètre since invalide (ISO 8601 attendu)");
  }

  const prisma = await getPrisma();
  const clients = await prisma.suiteClient.findMany({
    where: {
      workspaceId: auth.workspaceId,
      ...(since ? { updatedAt: { gt: since } } : {}),
    },
    orderBy: { updatedAt: "asc" },
  });

  return suiteJson({
    clients: clients.map(clientPayload),
    workspaceId: auth.workspaceId,
    syncedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  try {
    const body = await request.json();
    const name = (body.name ?? "").trim();
    if (!name) return suiteError("Le nom du client est requis");

    const prisma = await getPrisma();
    const externalId = body.externalId?.trim() || null;

    if (externalId) {
      const existing = await prisma.suiteClient.findUnique({
        where: {
          workspaceId_externalId: {
            workspaceId: auth.workspaceId,
            externalId,
          },
        },
      });
      if (existing && !existing.deletedAt) {
        const updated = await prisma.suiteClient.update({
          where: { id: existing.id },
          data: {
            name,
            companyName: body.companyName ?? existing.companyName,
            email: body.email ?? existing.email,
            phone: body.phone ?? existing.phone,
            address: body.address ?? existing.address,
            notes: body.notes ?? existing.notes,
            deletedAt: null,
          },
        });
        return suiteJson({ client: clientPayload(updated), upserted: true });
      }
    }

    const client = await prisma.suiteClient.create({
      data: {
        workspaceId: auth.workspaceId,
        externalId,
        name,
        companyName: body.companyName ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        address: body.address ?? "",
        notes: body.notes ?? "",
      },
    });

    return suiteJson({ client: clientPayload(client), created: true }, 201);
  } catch (error) {
    console.error("[Suite clients POST]", error);
    return suiteError("Erreur création client", 500);
  }
}
