const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

async function tryFetch(label: string, url: string, extra: Record<string, string> = {}) {
  console.log("\n---", label, "---");
  console.log(url);
  try {
    const res = await fetch(url, { headers: { ...headers, ...extra }, signal: AbortSignal.timeout(15_000) });
    const text = await res.text();
    console.log("status:", res.status, "len:", text.length);
    console.log(text.slice(0, 500));
    const prices = text.match(/"price[^"]*"\s*:\s*(\d+)/gi);
    if (prices) console.log("price keys sample:", prices.slice(0, 10));
  } catch (e) {
    console.log("error:", e instanceof Error ? e.message : e);
  }
}

async function main() {
  await tryFetch(
    "LBC api search",
    "https://api.leboncoin.fr/finder/search",
    {
      "Content-Type": "application/json",
      api_key: "ba0c2dad52b3ec",
    }
  );

  await tryFetch(
    "BM search api",
    "https://www.backmarket.fr/search?q=iphone+14"
  );

  await tryFetch(
    "BM buyback",
    "https://www.backmarket.fr/fr-fr/buyback/home"
  );
}

main();
