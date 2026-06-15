import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import {
  listWorkspaceServices,
  replaceWorkspaceServices,
  serviceToDTO,
  type SuiteServiceDTO,
} from "@/lib/suite/service-catalog";
import { suiteError, suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

type ServiceWriteInput = {
  name?: string;
  defaultDurationMinutes?: number;
  defaultPrice?: number;
  sortOrder?: number;
  matchDeviceTypes?: string[];
  matchKeywords?: string[];
  quoteRole?: string;
  isActive?: boolean;
};

function normalizeServices(body: unknown): ServiceWriteInput[] {
  if (!body || typeof body !== "object") return [];
  const services = (body as { services?: unknown }).services;
  if (!Array.isArray(services)) return [];

  return services.map((item, index) => {
    const row = item as ServiceWriteInput;
    const name = String(row.name ?? "").trim();
    return {
      name,
      defaultDurationMinutes: Number(row.defaultDurationMinutes ?? 60),
      defaultPrice: Number(row.defaultPrice ?? 0),
      sortOrder: Number(row.sortOrder ?? index),
      matchDeviceTypes: Array.isArray(row.matchDeviceTypes)
        ? row.matchDeviceTypes.map(String)
        : [],
      matchKeywords: Array.isArray(row.matchKeywords) ? row.matchKeywords.map(String) : [],
      quoteRole: String(row.quoteRole ?? ""),
      isActive: row.isActive !== false,
    };
  }).filter((service) => service.name);
}

export async function GET(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const prisma = await getPrisma();
  const services = await listWorkspaceServices(prisma, auth.workspaceId);

  return suiteJson({
    services,
    workspaceId: auth.workspaceId,
    syncedAt: new Date().toISOString(),
  });
}

export async function PUT(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const body = await request.json().catch(() => ({}));
  const services = normalizeServices(body);
  if (services.length === 0) {
    return suiteError("Liste services vide ou invalide");
  }

  const prisma = await getPrisma();
  const saved = await replaceWorkspaceServices(
    prisma,
    auth.workspaceId,
    services.map((service) => ({
      name: service.name!,
      defaultDurationMinutes: Math.max(1, Math.round(service.defaultDurationMinutes ?? 60)),
      defaultPriceCents: Math.round(Math.max(0, service.defaultPrice ?? 0) * 100),
      sortOrder: service.sortOrder ?? 0,
      matchDeviceTypes: service.matchDeviceTypes,
      matchKeywords: service.matchKeywords,
      quoteRole: (service.quoteRole as "" | "diagnostic" | "follow_up" | "security") ?? "",
    }))
  );

  return suiteJson({ services: saved });
}

export async function PATCH(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const body = await request.json().catch(() => ({}));
  const prisma = await getPrisma();
  const id = String((body as { id?: string }).id ?? "");
  if (!id) return suiteError("id requis");

  const existing = await prisma.suiteServiceType.findFirst({
    where: { id, workspaceId: auth.workspaceId },
  });
  if (!existing) return suiteError("Prestation introuvable", 404);

  const updated = await prisma.suiteServiceType.update({
    where: { id },
    data: {
      ...(body.name != null ? { name: String(body.name).trim() } : {}),
      ...(body.defaultDurationMinutes != null
        ? { defaultDurationMinutes: Math.max(1, Number(body.defaultDurationMinutes)) }
        : {}),
      ...(body.defaultPrice != null
        ? { defaultPriceCents: Math.round(Math.max(0, Number(body.defaultPrice)) * 100) }
        : {}),
      ...(body.sortOrder != null ? { sortOrder: Number(body.sortOrder) } : {}),
      ...(body.quoteRole != null ? { quoteRole: String(body.quoteRole) } : {}),
      ...(body.isActive != null ? { isActive: Boolean(body.isActive) } : {}),
      ...(Array.isArray(body.matchDeviceTypes)
        ? { matchDeviceTypes: JSON.stringify(body.matchDeviceTypes.map(String)) }
        : {}),
      ...(Array.isArray(body.matchKeywords)
        ? { matchKeywords: JSON.stringify(body.matchKeywords.map(String)) }
        : {}),
    },
  });

  return suiteJson({ service: serviceToDTO(updated) });
}
