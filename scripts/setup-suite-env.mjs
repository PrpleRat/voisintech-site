import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

function ensureEnvLine(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) return content;
  const line = `${key}="${value}"`;
  return content.trimEnd() + (content.endsWith("\n") ? "" : "\n") + line + "\n";
}

function main() {
  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf8");
  }

  if (!process.env.SUITE_JWT_SECRET && !content.includes("SUITE_JWT_SECRET=")) {
    const secret = randomBytes(48).toString("base64url");
    content = ensureEnvLine(content, "SUITE_JWT_SECRET", secret);
    console.log("[Suite] SUITE_JWT_SECRET généré dans .env");
  }

  if (!content.includes("DATABASE_URL=")) {
    content = ensureEnvLine(content, "DATABASE_URL", "file:./dev.db");
  }

  fs.writeFileSync(envPath, content);
  console.log("[Suite] Configuration locale prête.");
}

main();
