import { getPrisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/suite/api-key";
import {
  createAccessToken,
  createRefreshTokenValue,
  hashRefreshToken,
  refreshTokenExpiresAt,
} from "@/lib/suite/jwt";
import { hashPassword, verifyPassword } from "@/lib/suite/password";

export type RegisterInput = {
  email: string;
  password: string;
  businessName: string;
  ownerName?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerSuiteAccount(input: RegisterInput) {
  const prisma = await getPrisma();
  const email = normalizeEmail(input.email);
  const businessName = input.businessName.trim();

  if (!email || !input.password || businessName.length < 2) {
    throw new Error("Email, mot de passe et nom d'activité requis.");
  }

  if (input.password.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  }

  const existing = await prisma.suiteAccount.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const passwordHash = await hashPassword(input.password);
  const { fullKey, prefix, hash } = generateApiKey();

  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.suiteAccount.create({
      data: { email, passwordHash },
    });

    const workspace = await tx.suiteWorkspace.create({
      data: { name: businessName },
    });

    await tx.suiteMembership.create({
      data: {
        accountId: account.id,
        workspaceId: workspace.id,
        role: "owner",
      },
    });

    await tx.suiteBusinessProfile.create({
      data: {
        workspaceId: workspace.id,
        businessName,
        ownerName: input.ownerName?.trim() ?? "",
        email,
      },
    });

    const apiKey = await tx.suiteApiKey.create({
      data: {
        workspaceId: workspace.id,
        name: "Site VoisinTech",
        keyPrefix: prefix,
        keyHash: hash,
      },
    });

    const refreshValue = createRefreshTokenValue();
    await tx.suiteRefreshToken.create({
      data: {
        accountId: account.id,
        tokenHash: hashRefreshToken(refreshValue),
        expiresAt: refreshTokenExpiresAt(),
      },
    });

    return { account, workspace, apiKey, refreshValue };
  });

  const accessToken = createAccessToken({
    sub: result.account.id,
    workspaceId: result.workspace.id,
    email: result.account.email,
  });

  return {
    accessToken,
    refreshToken: result.refreshValue,
    workspaceId: result.workspace.id,
    accountId: result.account.id,
    email: result.account.email,
    apiKey: fullKey,
    apiKeyId: result.apiKey.id,
  };
}

export async function loginSuiteAccount(input: LoginInput) {
  const prisma = await getPrisma();
  const email = normalizeEmail(input.email);

  const account = await prisma.suiteAccount.findUnique({ where: { email } });
  if (!account) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  const valid = await verifyPassword(input.password, account.passwordHash);
  if (!valid) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  const membership = await prisma.suiteMembership.findFirst({
    where: { accountId: account.id },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    throw new Error("Aucun espace de travail associé à ce compte.");
  }

  const refreshValue = createRefreshTokenValue();
  await prisma.suiteRefreshToken.create({
    data: {
      accountId: account.id,
      tokenHash: hashRefreshToken(refreshValue),
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  const accessToken = createAccessToken({
    sub: account.id,
    workspaceId: membership.workspaceId,
    email: account.email,
  });

  return {
    accessToken,
    refreshToken: refreshValue,
    workspaceId: membership.workspaceId,
    accountId: account.id,
    email: account.email,
  };
}

export async function refreshSuiteSession(refreshToken: string) {
  const prisma = await getPrisma();
  const tokenHash = hashRefreshToken(refreshToken);

  const stored = await prisma.suiteRefreshToken.findUnique({
    where: { tokenHash },
    include: { account: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Session expirée. Reconnectez-vous.");
  }

  const membership = await prisma.suiteMembership.findFirst({
    where: { accountId: stored.accountId },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    throw new Error("Espace de travail introuvable.");
  }

  const newRefresh = createRefreshTokenValue();
  await prisma.$transaction([
    prisma.suiteRefreshToken.delete({ where: { id: stored.id } }),
    prisma.suiteRefreshToken.create({
      data: {
        accountId: stored.accountId,
        tokenHash: hashRefreshToken(newRefresh),
        expiresAt: refreshTokenExpiresAt(),
      },
    }),
  ]);

  const accessToken = createAccessToken({
    sub: stored.accountId,
    workspaceId: membership.workspaceId,
    email: stored.account.email,
  });

  return {
    accessToken,
    refreshToken: newRefresh,
    workspaceId: membership.workspaceId,
    accountId: stored.accountId,
    email: stored.account.email,
  };
}
