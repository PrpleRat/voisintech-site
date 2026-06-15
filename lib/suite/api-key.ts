import { createHash, randomBytes } from "crypto";

export function generateApiKey(): { fullKey: string; prefix: string; hash: string } {
  const raw = randomBytes(24).toString("base64url");
  const fullKey = `tsk_live_${raw}`;
  const prefix = fullKey.slice(0, 16);
  const hash = hashApiKey(fullKey);
  return { fullKey, prefix, hash };
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function isApiKeyFormat(token: string): boolean {
  return token.startsWith("tsk_live_") && token.length > 20;
}
