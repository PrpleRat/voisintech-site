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
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const resend = new Resend(env.RESEND_API_KEY);
const fromEmail = env.FROM_EMAIL || "onboarding@resend.dev";
const ownerEmail = env.NOTIFICATION_EMAIL || "voisintech3@gmail.com";
const clientEmail = "jouet.enzo@gmail.com";

const data = {
  deviceType: "PC Windows",
  problemDesc: "Test formulaire devis - ordinateur tres lent depuis une semaine",
  name: "Enzo Jouet",
  phone: "06 12 34 56 78",
  email: clientEmail,
  address: "12 rue de Test",
  city: "Toulouse",
  preferredDays: "lundi, mardi",
  preferredTime: "matin",
  preferredDate: "2026-06-20",
};

const ownerHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;">
    <h2 style="color:#1E6FA5;">Nouvelle demande de devis — VoisinTech</h2>
    <p><strong>Appareil :</strong> ${data.deviceType}</p>
    <p><strong>Problème :</strong> ${data.problemDesc}</p>
    <p><strong>Nom :</strong> ${data.name}</p>
    <p><strong>Téléphone :</strong> ${data.phone}</p>
    <p><strong>Email :</strong> ${data.email}</p>
    <p><strong>Adresse :</strong> ${data.address}, ${data.city}</p>
    <p><strong>Date :</strong> ${data.preferredDate}</p>
    <p><strong>Jours :</strong> ${data.preferredDays}</p>
    <p><strong>Créneau :</strong> ${data.preferredTime}</p>
  </div>
`;

const clientHtml = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;">
    <h2 style="color:#1E6FA5;">Votre demande a bien été reçue ✓</h2>
    <p>Bonjour ${data.name},</p>
    <p>Merci ! J'ai bien reçu votre demande de devis pour <strong>${data.deviceType}</strong>.</p>
    <p>Je vous recontacte <strong>dans les 2 heures</strong> en journée.</p>
    <p>En cas d'urgence : <strong>05 82 95 06 42</strong></p>
    <p style="margin-top:24px;">VoisinTech — Votre voisin de confiance pour le numérique</p>
  </div>
`;

const [ownerResult, clientResult] = await Promise.all([
  resend.emails.send({
    from: `VoisinTech <${fromEmail}>`,
    to: ownerEmail,
    subject: `[VoisinTech] Nouvelle demande de devis — ${data.name}`,
    html: ownerHtml,
  }),
  resend.emails.send({
    from: `VoisinTech <${fromEmail}>`,
    to: clientEmail,
    subject: "VoisinTech — Votre demande de devis a bien été reçue",
    html: clientHtml,
  }),
]);

console.log("Email propriétaire →", ownerEmail, JSON.stringify(ownerResult.data || ownerResult.error));
console.log("Email client →", clientEmail, JSON.stringify(clientResult.data || clientResult.error));
