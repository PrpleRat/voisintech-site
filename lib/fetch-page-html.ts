export interface FetchPageResult {
  html: string;
  ok: boolean;
  error?: string;
  via: "scraperapi" | "direct";
}

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/json",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

export async function fetchPageHtml(
  url: string,
  options?: { render?: boolean; timeoutMs?: number }
): Promise<FetchPageResult> {
  const apiKey = process.env.SCRAPER_API_KEY;
  const timeoutMs = options?.timeoutMs ?? 60_000;

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        api_key: apiKey,
        url,
        country_code: "fr",
      });
      if (options?.render) params.set("render", "true");

      const res = await fetch(`https://api.scraperapi.com?${params}`, {
        signal: AbortSignal.timeout(timeoutMs),
      });

      const html = await res.text();
      if (!res.ok) {
        return {
          html: "",
          ok: false,
          error: `ScraperAPI HTTP ${res.status}`,
          via: "scraperapi",
        };
      }

      const blocked =
        html.includes("captcha-delivery") ||
        html.includes("bot-need-challenge") ||
        html.length < 500;
      return {
        html,
        ok: !blocked,
        error: blocked ? "Page bloquée (captcha)" : undefined,
        via: "scraperapi",
      };
    } catch (err) {
      return {
        html: "",
        ok: false,
        error: err instanceof Error ? err.message : "Erreur ScraperAPI",
        via: "scraperapi",
      };
    }
  }

  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(Math.min(timeoutMs, 15_000)),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        html: "",
        ok: false,
        error: `HTTP ${res.status}`,
        via: "direct",
      };
    }

    const html = await res.text();
    const blocked =
      html.includes("captcha-delivery") ||
      html.includes("bot-need-challenge") ||
      html.includes("Sorry, this page is not available");
    return {
      html,
      ok: !blocked,
      error: blocked ? "Page bloquée (anti-bot)" : undefined,
      via: "direct",
    };
  } catch (err) {
    return {
      html: "",
      ok: false,
      error: err instanceof Error ? err.message : "Erreur réseau",
      via: "direct",
    };
  }
}

export async function postJsonViaScraperApi<T>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {}
): Promise<{ data: T | null; ok: boolean; error?: string }> {
  const apiKey = process.env.SCRAPER_API_KEY;
  if (!apiKey) {
    return { data: null, ok: false, error: "SCRAPER_API_KEY manquant" };
  }

  try {
    const res = await fetch("https://api.scraperapi.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        url,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });

    const text = await res.text();
    if (!res.ok) {
      return { data: null, ok: false, error: `ScraperAPI POST ${res.status}` };
    }

    if (text.includes("captcha-delivery")) {
      return { data: null, ok: false, error: "Captcha DataDome" };
    }

    return { data: JSON.parse(text) as T, ok: true };
  } catch (err) {
    return {
      data: null,
      ok: false,
      error: err instanceof Error ? err.message : "Erreur ScraperAPI POST",
    };
  }
}
