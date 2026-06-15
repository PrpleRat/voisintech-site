import { getPrisma } from "@/lib/prisma";
import { hashApiKey, isApiKeyFormat } from "@/lib/suite/api-key";
import { resolveVoisinTechWorkspaceId } from "@/lib/suite/resolve-voisintech-workspace";

export type QuoteLeadInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  deviceType?: string;
  problemDesc?: string;
};

export type QuoteLeadResult = {
  clientId: string;
  action: "created" | "updated";
  possibleDuplicateIds: string[];
};

/** Marqueur machine dans les notes — parsé par les apps Train Suite. */
export const SUITE_REVIEW_MARKER_PREFIX = "<!--SUITE_REVIEW:possible_duplicate:";
export const SUITE_REVIEW_MARKER_SUFFIX = "-->";

export function parseReviewMarker(notes: string): string[] {
  const match = notes.match(/<!--SUITE_REVIEW:possible_duplicate:([a-z0-9_,]+)-->/i);
  if (!match?.[1]) return [];
  return match[1].split(",").filter(Boolean);
}

export function stripReviewMarker(notes: string): string {
  return notes
    .replace(/<!--SUITE_REVIEW:possible_duplicate:[a-z0-9_,]+-->/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function withReviewMarker(notes: string, duplicateIds: string[]): string {
  const clean = stripReviewMarker(notes);
  if (duplicateIds.length === 0) return clean;
  const marker = `${SUITE_REVIEW_MARKER_PREFIX}${duplicateIds.join(",")}${SUITE_REVIEW_MARKER_SUFFIX}`;
  return clean ? `${clean}\n${marker}` : marker;
}

function buildNotes(input: QuoteLeadInput): string {
  const parts = ["Lead formulaire devis voisintech.fr"];
  if (input.deviceType) parts.push(`Appareil : ${input.deviceType}`);
  if (input.problemDesc) parts.push(`Problème : ${input.problemDesc}`);
  return parts.join("\n");
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

async function findExistingByContact(
  workspaceId: string,
  phone: string,
  email: string
) {
  const prisma = await getPrisma();
  const phoneDigits = normalizePhone(phone);
  const emailNorm = normalizeEmail(email);

  if (emailNorm) {
    const byEmail = await prisma.suiteClient.findFirst({
      where: {
        workspaceId,
        deletedAt: null,
        email: emailNorm,
      },
    });
    if (byEmail) return byEmail;
  }

  if (phoneDigits.length >= 8) {
    const clients = await prisma.suiteClient.findMany({
      where: { workspaceId, deletedAt: null },
      take: 500,
      orderBy: { updatedAt: "desc" },
    });
    return (
      clients.find((c) => normalizePhone(c.phone) === phoneDigits) ?? null
    );
  }

  return null;
}

async function findPossibleNameDuplicates(
  workspaceId: string,
  name: string,
  excludeId?: string
): Promise<string[]> {
  const target = normalizeName(name);
  if (!target) return [];

  const prisma = await getPrisma();
  const clients = await prisma.suiteClient.findMany({
    where: { workspaceId, deletedAt: null },
    take: 500,
    orderBy: { updatedAt: "desc" },
  });

  return clients
    .filter((c) => c.id !== excludeId && normalizeName(c.name) === target)
    .map((c) => c.id);
}

/** Crée ou met à jour un client Suite depuis un devis site (clé API workspace). */
export async function createSuiteClientFromQuoteLead(
  input: QuoteLeadInput
): Promise<QuoteLeadResult | null> {
  const prisma = await getPrisma();
  const workspaceId = await resolveVoisinTechWorkspaceId(prisma);
  if (!workspaceId) {
    console.warn("[Suite quote lead] Workspace VoisinTech introuvable");
    return null;
  }

  const apiKey = process.env.TRAIN_SUITE_API_KEY?.trim();
  if (apiKey && isApiKeyFormat(apiKey)) {
    const keyHash = hashApiKey(apiKey);
    const keyRecord = await prisma.suiteApiKey.findFirst({
      where: { keyHash, revokedAt: null, workspaceId },
    });
    if (keyRecord) {
      await prisma.suiteApiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      });
    }
  }
  const name = input.name.trim();
  if (!name) return null;

  const fullAddress = [input.address.trim(), input.city?.trim()]
    .filter(Boolean)
    .join(", ");
  const phone = input.phone.trim();
  const email = normalizeEmail(input.email);
  const baseNotes = buildNotes(input);

  const existing = await findExistingByContact(workspaceId, phone, email);

  if (existing) {
    const mergedNotes = existing.notes
      ? `${stripReviewMarker(existing.notes)}\n---\n${baseNotes}`
      : baseNotes;
    const updated = await prisma.suiteClient.update({
      where: { id: existing.id },
      data: {
        name,
        phone: phone || existing.phone,
        email: email || existing.email,
        address: fullAddress || existing.address,
        notes: mergedNotes,
        deletedAt: null,
      },
    });
    return {
      clientId: updated.id,
      action: "updated",
      possibleDuplicateIds: [],
    };
  }

  const phoneDigits = normalizePhone(phone);
  const externalId = email
    ? `quote-lead:email:${email}`
    : phoneDigits.length >= 8
      ? `quote-lead:phone:${phoneDigits}`
      : `quote-lead:${crypto.randomUUID()}`;

  const possibleDuplicateIds = await findPossibleNameDuplicates(workspaceId, name);
  const notes = withReviewMarker(baseNotes, possibleDuplicateIds);

  const client = await prisma.suiteClient.create({
    data: {
      workspaceId,
      externalId,
      name,
      phone,
      email,
      address: fullAddress,
      notes,
    },
  });

  for (const dupId of possibleDuplicateIds) {
    const dup = await prisma.suiteClient.findUnique({ where: { id: dupId } });
    if (!dup || dup.deletedAt) continue;
    const existingIds = parseReviewMarker(dup.notes);
    if (existingIds.includes(client.id)) continue;
    await prisma.suiteClient.update({
      where: { id: dupId },
      data: {
        notes: withReviewMarker(dup.notes, [...existingIds, client.id]),
      },
    });
  }

  return {
    clientId: client.id,
    action: "created",
    possibleDuplicateIds,
  };
}
