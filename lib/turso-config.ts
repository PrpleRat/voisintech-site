export function getTursoConfig() {
  const url =
    process.env.TURSO_DATABASE_URL ||
    (process.env.DATABASE_URL?.startsWith("libsql://")
      ? process.env.DATABASE_URL.split("?")[0]
      : null);

  let authToken = process.env.TURSO_AUTH_TOKEN;

  if (!authToken && process.env.DATABASE_URL?.includes("authToken=")) {
    const match = process.env.DATABASE_URL.match(/authToken=([^&]+)/);
    authToken = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  }

  if (url && authToken) {
    return { url, authToken };
  }

  return null;
}

export function isProductionWithoutTurso() {
  return process.env.NODE_ENV === "production" && !getTursoConfig();
}
