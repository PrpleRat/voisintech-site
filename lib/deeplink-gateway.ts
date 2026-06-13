import { business } from "@/config/content";

const ALLOWED_SCHEMES = ["traincrm:", "agendatrain:", "factutrain:", "trainca:"];

/** Lien HTTPS qui redirige vers un deeplink iOS (obligatoire dans les emails). */
export function toGatewayUrl(schemeUrl: string): string {
  const encoded = Buffer.from(schemeUrl, "utf8").toString("base64url");
  return `${business.website}/go?to=${encoded}`;
}

export function decodeGatewayParam(to: string): string | null {
  try {
    const decoded = Buffer.from(to, "base64url").toString("utf8");
    const lower = decoded.toLowerCase();
    if (ALLOWED_SCHEMES.some((scheme) => lower.startsWith(scheme))) {
      return decoded;
    }
  } catch {
    return null;
  }
  return null;
}

function escapeHtmlAttr(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function gatewayRedirectHtml(schemeUrl: string): string {
  const safe = escapeHtmlAttr(schemeUrl);
  const safeJs = schemeUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0;url=${safe}" />
  <title>Ouverture de l'application — VoisinTech</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 28rem; margin: 3rem auto; padding: 0 1rem; color: #1a1a1a; text-align: center; }
    a { color: #1E6FA5; font-weight: 600; }
    .btn { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.25rem; background: #1E6FA5; color: #fff !important; text-decoration: none; border-radius: 0.75rem; }
  </style>
</head>
<body>
  <p>Redirection vers votre application…</p>
  <p><a class="btn" href="${safe}">Ouvrir l'application</a></p>
  <p style="font-size:0.875rem;color:#666;margin-top:2rem;"><a href="${business.website}">Retour sur voisintech.fr</a></p>
  <script>window.location.replace("${safeJs}");</script>
</body>
</html>`;
}
