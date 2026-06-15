import { getPrisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/suite/api-key";

export type QuoteLeadInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  deviceType?: string;
  problemDesc?: string;
};

function buildNotes(input: QuoteLeadInput): string {
  const parts = ["Lead formulaire devis voisintech.fr"];
  if (input.deviceType) parts.push(`Appareil : ${input.deviceType}`);
  if (input.problemDesc) parts.push(`Problème : ${input.problemDesc}`);
  return parts.join("\n");
}

/** Crée ou met à jour un client Suite depuis un devis site (clé API workspace VoisinTech). */
export async function createSuiteClientFromQuoteLead(
  input: QuoteLeadInput
): Promise<{ clientId: string } | null> {
  const apiKey = process.env.TRAIN_SUITE_API_KEY?.trim();
  if (!apiKey) return null;

  const prisma = await getPrisma();
  const keyHash = hashApiKey(apiKey);
  const keyRecord = await prisma.suiteApiKey.findFirst({
    where: { keyHash, revokedAt: null },
  });
  if (!keyRecord) {
    console.warn("[Suite quote lead] TRAIN_SUITE_API_KEY invalide ou révoquée");
    return null;
  }

  await prisma.suiteApiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() },
  });

  const workspaceId = keyRecord.workspaceId;
  const name = input.name.trim();
  if (!name) return null;

  const fullAddress = [input.address.trim(), input.city?.trim()]
    .filter(Boolean)
    .join(", ");
  const phone = input.phone.trim();
  const email = input.email.trim().toLowerCase();
  const notes = buildNotes(input);

  const externalId = `quote-lead:${email || phone || name}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 120);

  const existing = await prisma.suiteClient.findUnique({
    where: {
      workspaceId_externalId: { workspaceId, externalId },
    },
  });

  if (existing && !existing.deletedAt) {
    const updated = await prisma.suiteClient.update({
      where: { id: existing.id },
      data: {
        name,
        phone: phone || existing.phone,
        email: email || existing.email,
        address: fullAddress || existing.address,
        notes: existing.notes ? `${existing.notes}\n---\n${notes}` : notes,
        deletedAt: null,
      },
    });
    return { clientId: updated.id };
  }

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

  return { clientId: client.id };
}
