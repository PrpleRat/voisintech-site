import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import {
  listWorkspaceServices,
  replaceWorkspaceServices,
  seedVoisinTechServices,
} from "@/lib/suite/service-catalog";
import {
  resolveVoisinTechWorkspaceId,
  voisinTechWorkspaceSetupHint,
} from "@/lib/suite/resolve-voisintech-workspace";
import { voisintechServiceSeed } from "@/lib/suite/voisintech-service-seed";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const prisma = await getPrisma();
  const workspaceId = await resolveVoisinTechWorkspaceId(prisma);
  if (!workspaceId) {
    return NextResponse.json({ error: voisinTechWorkspaceSetupHint() }, { status: 500 });
  }

  const services = await listWorkspaceServices(prisma, workspaceId);
  return NextResponse.json({ services, workspaceId });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const prisma = await getPrisma();
  const workspaceId = await resolveVoisinTechWorkspaceId(prisma);
  if (!workspaceId) {
    return NextResponse.json({ error: voisinTechWorkspaceSetupHint() }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));

  if (body.action === "seed-voisintech") {
    const services = await seedVoisinTechServices(prisma, workspaceId);
    return NextResponse.json({ services, seeded: true, workspaceId });
  }

  const services = Array.isArray(body.services) ? body.services : [];
  const saved = await replaceWorkspaceServices(
    prisma,
    workspaceId,
    services
      .map((service: Record<string, unknown>, index: number) => ({
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
        quoteRole: String(service.quoteRole ?? "") as
          | ""
          | "diagnostic"
          | "follow_up"
          | "security",
      }))
      .filter((service: { name: string }) => service.name)
  );

  return NextResponse.json({ services: saved, workspaceId });
}

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const prisma = await getPrisma();
  const workspaceId = await resolveVoisinTechWorkspaceId(prisma);
  if (!workspaceId) {
    return NextResponse.json({ error: voisinTechWorkspaceSetupHint() }, { status: 500 });
  }

  const existing = await prisma.suiteServiceType.count({ where: { workspaceId } });
  if (existing > 0) {
    const services = await listWorkspaceServices(prisma, workspaceId);
    return NextResponse.json({
      services,
      seeded: false,
      workspaceId,
      message: "Catalogue déjà présent",
    });
  }

  const services = await replaceWorkspaceServices(prisma, workspaceId, voisintechServiceSeed);
  return NextResponse.json({ services, seeded: true, workspaceId });
}
