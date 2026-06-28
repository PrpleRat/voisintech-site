/** URL publique (ou VPN/tunnel) de l'instance BOS-Dashboard — admin uniquement. */
export function getBosDashboardUrl(): string | null {
  const raw = process.env.BOS_DASHBOARD_URL?.trim();
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}
