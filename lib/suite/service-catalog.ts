import type { PrismaClient } from "@prisma/client";
import { voisintechServiceSeed, type ServiceSeedInput } from "@/lib/suite/voisintech-service-seed";

export type SuggestedQuoteLine = {
  label: string;
  quantity: number;
  unitPrice: number;
};

export type SuiteServiceDTO = {
  id: string;
  name: string;
  defaultDurationMinutes: number;
  defaultPrice: number;
  sortOrder: number;
  matchDeviceTypes: string[];
  matchKeywords: string[];
  quoteRole: string;
  isActive: boolean;
  updatedAt: string;
};

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function serializeJsonArray(values: string[] | undefined): string {
  return JSON.stringify(values ?? []);
}

export function serviceToDTO(service: {
  id: string;
  name: string;
  defaultDurationMinutes: number;
  defaultPriceCents: number;
  sortOrder: number;
  matchDeviceTypes: string;
  matchKeywords: string;
  quoteRole: string;
  isActive: boolean;
  updatedAt: Date;
}): SuiteServiceDTO {
  return {
    id: service.id,
    name: service.name,
    defaultDurationMinutes: service.defaultDurationMinutes,
    defaultPrice: service.defaultPriceCents / 100,
    sortOrder: service.sortOrder,
    matchDeviceTypes: parseJsonArray(service.matchDeviceTypes),
    matchKeywords: parseJsonArray(service.matchKeywords),
    quoteRole: service.quoteRole,
    isActive: service.isActive,
    updatedAt: service.updatedAt.toISOString(),
  };
}

export async function listWorkspaceServices(
  prisma: PrismaClient,
  workspaceId: string
): Promise<SuiteServiceDTO[]> {
  const rows = await prisma.suiteServiceType.findMany({
    where: { workspaceId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(serviceToDTO);
}

export async function replaceWorkspaceServices(
  prisma: PrismaClient,
  workspaceId: string,
  services: ServiceSeedInput[]
): Promise<SuiteServiceDTO[]> {
  await prisma.suiteServiceType.deleteMany({ where: { workspaceId } });

  for (const service of services) {
    await prisma.suiteServiceType.create({
      data: {
        workspaceId,
        name: service.name,
        defaultDurationMinutes: service.defaultDurationMinutes,
        defaultPriceCents: service.defaultPriceCents,
        sortOrder: service.sortOrder,
        matchDeviceTypes: serializeJsonArray(service.matchDeviceTypes),
        matchKeywords: serializeJsonArray(service.matchKeywords),
        quoteRole: service.quoteRole ?? "",
      },
    });
  }

  return listWorkspaceServices(prisma, workspaceId);
}

export async function seedVoisinTechServices(
  prisma: PrismaClient,
  workspaceId: string
): Promise<SuiteServiceDTO[]> {
  return replaceWorkspaceServices(prisma, workspaceId, voisintechServiceSeed);
}

function matchesKeywords(problemDesc: string, keywords: string[]): boolean {
  const lower = problemDesc.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function matchesDevice(deviceType: string, devices: string[]): boolean {
  if (devices.length === 0) return false;
  return devices.includes(deviceType);
}

export function suggestQuoteLinesFromCatalog(
  catalog: SuiteServiceDTO[],
  deviceType: string,
  problemDesc = ""
): SuggestedQuoteLine[] {
  if (catalog.length === 0) return [];

  const diagnostic =
    catalog.find((s) => s.quoteRole === "diagnostic") ??
    catalog.find((s) => s.name.toLowerCase().includes("diagnostic"));

  const security =
    catalog.find((s) => s.quoteRole === "security") ??
    catalog.find((s) => matchesKeywords(problemDesc, s.matchKeywords));

  const followUp =
    catalog.find((s) => matchesDevice(deviceType, s.matchDeviceTypes)) ??
    catalog.find((s) => s.quoteRole === "follow_up") ??
    catalog.find((s) => s.defaultPrice > 0 && s.quoteRole !== "diagnostic");

  const lines: SuggestedQuoteLine[] = [];

  if (diagnostic) {
    lines.push({ label: diagnostic.name, quantity: 1, unitPrice: diagnostic.defaultPrice });
  }

  if (security && matchesKeywords(problemDesc, security.matchKeywords)) {
    if (!lines.some((line) => line.label === security.name)) {
      lines.push({ label: security.name, quantity: 1, unitPrice: security.defaultPrice });
    }
    return lines;
  }

  if (followUp && !lines.some((line) => line.label === followUp.name)) {
    lines.push({ label: followUp.name, quantity: 1, unitPrice: followUp.defaultPrice });
  }

  return lines;
}

export function suggestInterventionFromCatalog(
  catalog: SuiteServiceDTO[],
  deviceType: string,
  problemDesc = ""
): { serviceName: string; durationMinutes: number; price: number } | null {
  const lines = suggestQuoteLinesFromCatalog(catalog, deviceType, problemDesc);
  const primary = lines[lines.length - 1] ?? lines[0];
  if (!primary) return null;

  const service = catalog.find((s) => s.name === primary.label);
  return {
    serviceName: primary.label,
    durationMinutes: service?.defaultDurationMinutes ?? 60,
    price: primary.unitPrice,
  };
}
