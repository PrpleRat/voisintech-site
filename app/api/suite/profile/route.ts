import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { resolveSuiteAuth } from "@/lib/suite/auth-context";
import { suiteError, suiteJson, suiteUnauthorized } from "@/lib/suite/responses";

function profilePayload(profile: {
  businessName: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  updatedAt: Date;
}) {
  return {
    businessName: profile.businessName,
    ownerName: profile.ownerName,
    address: profile.address,
    phone: profile.phone,
    email: profile.email,
    siret: profile.siret,
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const prisma = await getPrisma();
  const profile = await prisma.suiteBusinessProfile.findUnique({
    where: { workspaceId: auth.workspaceId },
  });

  if (!profile) {
    return suiteError("Profil entreprise introuvable", 404);
  }

  return suiteJson({
    profile: profilePayload(profile),
    workspaceId: auth.workspaceId,
  });
}

export async function PUT(request: NextRequest) {
  const auth = await resolveSuiteAuth(request);
  if (!auth) return suiteUnauthorized();

  const body = await request.json();
  const prisma = await getPrisma();

  const profile = await prisma.suiteBusinessProfile.upsert({
    where: { workspaceId: auth.workspaceId },
    create: {
      workspaceId: auth.workspaceId,
      businessName: body.businessName ?? "",
      ownerName: body.ownerName ?? "",
      address: body.address ?? "",
      phone: body.phone ?? "",
      email: body.email ?? "",
      siret: body.siret ?? "",
    },
    update: {
      businessName: body.businessName,
      ownerName: body.ownerName,
      address: body.address,
      phone: body.phone,
      email: body.email,
      siret: body.siret,
    },
  });

  if (profile.businessName) {
    await prisma.suiteWorkspace.update({
      where: { id: auth.workspaceId },
      data: { name: profile.businessName },
    });
  }

  return suiteJson({ profile: profilePayload(profile) });
}
