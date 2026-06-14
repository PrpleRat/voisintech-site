import { DEFAULT_REGION, isRegionId, type RegionId } from "@/config/regions";

export const REGION_COOKIE = "voisintech-region";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function readRegionFromDocument(): RegionId | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${REGION_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.split("=")[1] ?? "");
  return isRegionId(value) ? value : null;
}

export function writeRegionCookie(region: RegionId) {
  if (typeof document === "undefined") return;
  document.cookie = `${REGION_COOKIE}=${encodeURIComponent(region)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function resolveRegion(value: RegionId | null | undefined): RegionId {
  return value ?? DEFAULT_REGION;
}
