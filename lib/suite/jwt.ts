import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const ACCESS_TTL_MS = 60 * 60 * 1000; // 1 h
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 j

export type SuiteTokenPayload = {
  sub: string;
  workspaceId: string;
  email: string;
};

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function getSecret(): string {
  const secret = process.env.SUITE_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SUITE_JWT_SECRET manquant ou trop court (min 32 caractères)");
  }
  return secret;
}

function signSegment(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createAccessToken(payload: SuiteTokenPayload): string {
  const secret = getSecret();
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(
    JSON.stringify({
      ...payload,
      exp: Date.now() + ACCESS_TTL_MS,
      typ: "access",
    })
  );
  const signature = signSegment(`${header}.${body}`, secret);
  return `${header}.${body}.${signature}`;
}

export function verifyAccessToken(token: string): SuiteTokenPayload | null {
  try {
    const secret = getSecret();
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;

    const expected = signSegment(`${header}.${body}`, secret);
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SuiteTokenPayload & {
      exp?: number;
      typ?: string;
    };

    if (payload.typ !== "access" || !payload.exp || payload.exp < Date.now()) {
      return null;
    }

    if (!payload.sub || !payload.workspaceId || !payload.email) return null;
    return { sub: payload.sub, workspaceId: payload.workspaceId, email: payload.email };
  } catch {
    return null;
  }
}

export function createRefreshTokenValue(): string {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHmac("sha256", getSecret()).update(token).digest("hex");
}

export function refreshTokenExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_TTL_MS);
}
