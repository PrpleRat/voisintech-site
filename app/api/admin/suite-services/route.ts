import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { hashApiKey, isApiKeyFormat } from "@/lib/suite/api-key";
import {
  listWorkspaceServices,
  replaceWorkspaceServices,
  seedVoisinTechServices,
} from "@/lib/suite/service-catalog";
import { voisintechServiceSeed } from "@/lib/suite/voisintech-service-seed";

async function resolveVoisinTechWorkspaceId(): Promise<string | null> {
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

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const workspaceId = await resolveVoisinTechWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json(
      { error: "TRAIN_SUITE_API_KEY ou TRAIN_SUITE_WORKSPACE_ID manquant sur Vercel" },
      { status: 500 }
    );
  }

  const prisma = await getPrisma();
  const services = await listWorkspaceServices(prisma, workspaceId);
  return NextResponse.json({ services, workspaceId });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const workspaceId = await resolveVoisinTechWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace VoisinTech introuvable" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const prisma = await getPrisma();

  if (body.action === "seed-voisintech") {
    const services = await seedVoisinTechServices(prisma, workspaceId);
    return NextResponse.json({ services, seeded: true });
  }

  const services = Array.isArray(body.services) ? body.services : [];
  const saved = await replaceWorkspaceServices(
    prisma,
    workspaceId,
    services.map((service: Record<string, unknown>, index: number) => ({
      name: String(service.name ?? "").trim(),
      defaultDurationMinutes: Math.max(1, Number(service.defaultDurationMinutes ?? 60)),
      defaultPriceCents: Math.round(Math.max(0, Number(service.defaultPrice ?? 0)) * 100),
      sortOrder: Number(service.sortOrder ?? index),
      matchDeviceTypes: Array.isArray(service.matchDeviceTypes)
        ? service.matchDeviceTypes.map(String)
        : [],
      matchKeywords: Array.isArray(service.matchKeywords)
        ? service.matchKeywords.map(String)
        : [],
      quoteRole: String(service.quoteRole ?? "") as "" | "diagnostic" | "follow_up" | "security",
    })).filter((service: { name: string }) => service.name)
  );

  return NextResponse.json({ services: saved });
}

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const workspaceId = await resolveVoisinTechWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace VoisinTech introuvable" }, { status: 500 });
  }

  const prisma = await getPrisma();
  const existing = await prisma.suiteServiceType.count({ where: { workspaceId } });
  if (existing > 0) {
    const services = await listWorkspaceServices(prisma, workspaceId);
    return NextResponse.json({ services, seeded: false, message: "Catalogue déjà présent" });
  }

  const services = await replaceWorkspaceServices(prisma, workspaceId, voisintechServiceSeed);
  return NextResponse.json({ services, seeded: true });
}
