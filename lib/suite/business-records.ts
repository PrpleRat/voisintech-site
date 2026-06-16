export const SUITE_RECORD_KINDS = [
  "revenue",
  "quote",
  "invoice",
  "intervention",
  "maintenance_contract",
  "maintenance_contract_template",
] as const;
export type SuiteRecordKind = (typeof SUITE_RECORD_KINDS)[number];

export const SUITE_RECORD_SOURCES = ["trainca", "factutrain", "agendatrain"] as const;
export type SuiteRecordSource = (typeof SUITE_RECORD_SOURCES)[number];

export type SuiteBusinessRecordRow = {
  id: string;
  workspaceId: string;
  kind: string;
  source: string;
  externalId: string;
  payload: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function isSuiteRecordKind(value: string): value is SuiteRecordKind {
  return (SUITE_RECORD_KINDS as readonly string[]).includes(value);
}

export function isSuiteRecordSource(value: string): value is SuiteRecordSource {
  return (SUITE_RECORD_SOURCES as readonly string[]).includes(value);
}

export function parseKindFilter(raw: string | null): SuiteRecordKind[] | null {
  if (!raw?.trim()) return null;
  const kinds = raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (kinds.length === 0) return null;

  const invalid = kinds.filter((kind) => !isSuiteRecordKind(kind));
  if (invalid.length > 0) {
    throw new Error(`kind invalide : ${invalid.join(", ")}`);
  }
  return kinds as SuiteRecordKind[];
}

export function parsePayload(raw: unknown): string {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new Error("payload requis");
    }
    try {
      JSON.parse(trimmed);
    } catch {
      throw new Error("payload JSON invalide");
    }
    return trimmed;
  }
  if (raw === undefined || raw === null) {
    throw new Error("payload requis");
  }
  return JSON.stringify(raw);
}

export function payloadToObject(payload: string): unknown {
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

export function recordToDTO(record: SuiteBusinessRecordRow) {
  return {
    id: record.id,
    kind: record.kind,
    source: record.source,
    externalId: record.externalId,
    payload: payloadToObject(record.payload),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export type SuiteRecordWriteBody = {
  kind?: unknown;
  source?: unknown;
  externalId?: unknown;
  payload?: unknown;
};

export function parseRecordWriteBody(body: SuiteRecordWriteBody, requireAll: boolean) {
  const kindRaw = typeof body.kind === "string" ? body.kind.trim().toLowerCase() : "";
  const sourceRaw = typeof body.source === "string" ? body.source.trim().toLowerCase() : "";
  const externalId =
    typeof body.externalId === "string" ? body.externalId.trim() : "";

  if (requireAll) {
    if (!kindRaw || !isSuiteRecordKind(kindRaw)) {
      throw new Error(
        "kind requis (revenue|quote|invoice|intervention|maintenance_contract|maintenance_contract_template)"
      );
    }
    if (!sourceRaw || !isSuiteRecordSource(sourceRaw)) {
      throw new Error("source requis (trainca|factutrain|agendatrain)");
    }
    if (!externalId) {
      throw new Error("externalId requis");
    }
  } else {
    if (kindRaw && !isSuiteRecordKind(kindRaw)) {
      throw new Error("kind invalide");
    }
    if (sourceRaw && !isSuiteRecordSource(sourceRaw)) {
      throw new Error("source invalide");
    }
  }

  const payload =
    body.payload !== undefined ? parsePayload(body.payload) : requireAll ? parsePayload(body.payload) : undefined;

  return {
    kind: kindRaw ? (kindRaw as SuiteRecordKind) : undefined,
    source: sourceRaw ? (sourceRaw as SuiteRecordSource) : undefined,
    externalId: externalId || undefined,
    payload,
  };
}
