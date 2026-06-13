import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      const key = l.slice(0, i).trim();
      const value = l.slice(i + 1).trim().replace(/^"|"$/g, "");
      return [key, value];
    })
);

const to = process.argv[2] || "jouet.enzo@gmail.com";
const resend = new Resend(env.RESEND_API_KEY);
const fromEmail = env.FROM_EMAIL || "onboarding@resend.dev";

const result = await resend.emails.send({
  from: `VoisinTech <${fromEmail}>`,
  to,
  subject: "Test VoisinTech — Resend fonctionne",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <h2 style="color: #1E6FA5;">Test email VoisinTech</h2>
      <p>Bonjour,</p>
      <p>Ceci est un email de test envoyé depuis le site VoisinTech.
      Si vous recevez ce message, <strong>Resend est bien configuré</strong>.</p>
      <p style="margin-top: 24px;">VoisinTech — Votre voisin de confiance pour le numérique</p>
    </div>
  `,
});

console.log(JSON.stringify(result, null, 2));
