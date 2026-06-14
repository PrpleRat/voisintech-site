import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..", "..");
const outputDir = path.join(rootDir, "Output");
const envPath = path.join(__dirname, "..", ".env");

function loadEnv() {
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

async function htmlToPdf(htmlPath, pdfPath) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const html = fs.readFileSync(htmlPath, "utf8");
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
  });
  await browser.close();
  console.log(`PDF généré : ${pdfPath}`);
}

async function markdownToPdf(mdPath, pdfPath) {
  const { chromium } = await import("playwright");
  const markdown = fs.readFileSync(mdPath, "utf8");

  const htmlBody = markdown
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^\*\*(.+?)\*\*$/gm, "<p><strong>$1</strong></p>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")
    .replace(/^([^<\n].+)$/gm, (line) =>
      line.startsWith("<") ? line : `<p>${line}</p>`
    );

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
<style>
body{font-family:Segoe UI,Arial,sans-serif;font-size:10pt;line-height:1.5;color:#1a1a1a;padding:24px;max-width:800px;margin:0 auto}
h1{color:#1E6FA5;font-size:20pt;border-bottom:2px solid #2E9E6B;padding-bottom:6px}
h2{color:#1E6FA5;font-size:14pt;margin-top:24px}
h3{color:#155A87;font-size:12pt}
pre{background:#f4f8fb;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:9pt}
ul{padding-left:20px} li{margin:3px 0}
hr{border:none;border-top:1px solid #e8edf2;margin:20px 0}
</style></head><body>${htmlBody}</body></html>`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
  });
  await browser.close();
  console.log(`PDF généré : ${pdfPath}`);
}

async function main() {
  const env = loadEnv();
  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY manquante dans .env");
    process.exit(1);
  }

  const guideHtml = path.join(outputDir, "voisintech-guide-instagram.html");
  const contenusMd = path.join(outputDir, "contenus-instagram-voisintech.md");
  const guidePdf = path.join(outputDir, "voisintech-guide-instagram.pdf");
  const contenusPdf = path.join(outputDir, "contenus-instagram-voisintech.pdf");

  if (!fs.existsSync(guideHtml) || !fs.existsSync(contenusMd)) {
    console.error("Fichiers source manquants dans Output/");
    process.exit(1);
  }

  console.log("Génération des PDF...");
  await htmlToPdf(guideHtml, guidePdf);
  await markdownToPdf(contenusMd, contenusPdf);

  const recipients = [
    env.NOTIFICATION_EMAIL || "voisintech3@gmail.com",
    "jouet.enzo@gmail.com",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const resend = new Resend(env.RESEND_API_KEY);
  const fromEmail = env.FROM_EMAIL || "onboarding@resend.dev";

  const guideBuffer = fs.readFileSync(guidePdf);
  const contenusBuffer = fs.readFileSync(contenusPdf);
  const contenusMdBuffer = fs.readFileSync(contenusMd);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;line-height:1.6;color:#1a1a1a">
      <h2 style="color:#1E6FA5">VoisinTech — Pack Instagram</h2>
      <p>Bonjour,</p>
      <p>Vous trouverez en pièces jointes :</p>
      <ul>
        <li><strong>Guide Instagram Pro</strong> (PDF) — compte pro, bio, stratégie, routine</li>
        <li><strong>9 contenus prêts à publier</strong> (PDF + MD) — légendes, slides carrousels, scripts Reels</li>
      </ul>
      <p>Prochaine étape : créer le compte <strong>@voisintech</strong>, remplir la bio, publier le Post 1 lundi à 10h.</p>
      <p style="margin-top:24px;color:#555">VoisinTech — voisintech.fr — 05 82 95 06 42</p>
    </div>
  `;

  for (const to of recipients) {
    console.log(`Envoi vers ${to}...`);
    const result = await resend.emails.send({
      from: `VoisinTech <${fromEmail}>`,
      to,
      subject: "VoisinTech — Guide Instagram Pro + 9 contenus (PDF)",
      html,
      text: "Pack Instagram VoisinTech : guide PDF + 9 contenus prêts à publier en pièces jointes.",
      attachments: [
        {
          filename: "voisintech-guide-instagram.pdf",
          content: guideBuffer,
        },
        {
          filename: "contenus-instagram-voisintech.pdf",
          content: contenusBuffer,
        },
        {
          filename: "contenus-instagram-voisintech.md",
          content: contenusMdBuffer,
        },
      ],
    });

    if (result.error) {
      console.error(`Échec ${to}:`, result.error.message);
    } else {
      console.log(`OK ${to} — id:`, result.data?.id);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
