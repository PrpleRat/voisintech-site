import { cookies } from "next/headers";

const SESSION_COOKIE = "voisintech_admin_session";
const SESSION_VALUE = "authenticated";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "changeme123";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

export function createAdminSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: SESSION_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}

export function clearAdminSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}

export function verifyAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}
