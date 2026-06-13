import { decodeGatewayParam, gatewayRedirectHtml } from "@/lib/deeplink-gateway";

export async function GET(request: Request) {
  const to = new URL(request.url).searchParams.get("to");

  if (!to) {
    return new Response("Lien manquant.", { status: 400 });
  }

  const schemeUrl = decodeGatewayParam(to);
  if (!schemeUrl) {
    return new Response("Lien invalide.", { status: 400 });
  }

  return new Response(gatewayRedirectHtml(schemeUrl), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
