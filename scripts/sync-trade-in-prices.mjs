import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

function loadEnv() {
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
      })
  );
}

const siteUrl = process.env.SITE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://www.voisintech.fr";

const cronSecret = process.env.CRON_SECRET;

async function main() {
  const env = { ...loadEnv(), ...process.env };
  const secret = cronSecret || env.CRON_SECRET;
  const base = env.SITE_URL || siteUrl;

  if (!secret) {
    console.error("CRON_SECRET manquant");
    process.exit(1);
  }

  const url = `${base.replace(/\/$/, "")}/api/cron/sync-trade-in-prices`;
  console.log("Sync:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secret}`,
      "x-cron-secret": secret,
    },
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));

  if (!res.ok) process.exit(1);
}

main();
