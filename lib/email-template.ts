import { business } from "@/config/content";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const BRAND = "#1E6FA5";
const BRAND_DARK = "#155A87";
const MUTED = "#5c6570";
const BORDER = "#e8edf2";
const BG = "#f4f8fb";

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface EmailLayoutOptions {
  preheader: string;
  title: string;
  bodyHtml: string;
}

export function renderEmailLayout({ preheader, title, bodyHtml }: EmailLayoutOptions) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">
          <tr>
            <td style="background:${BRAND};padding:24px 28px;">
              <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:-0.02em;">${escapeHtml(business.name)}</p>
              <p style="margin:6px 0 0;font-size:14px;color:#d9ecfa;">${escapeHtml(business.slogan)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 24px;border-top:1px solid ${BORDER};background:#fafcfe;">
              <p style="margin:0 0 8px;font-size:13px;color:${MUTED};line-height:1.5;">
                <strong style="color:${BRAND_DARK};">${escapeHtml(business.name)}</strong><br />
                Dépannage informatique à domicile — ${escapeHtml(business.city)} (${escapeHtml(business.serviceRadius)})
              </p>
              <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;">
                Tél. <a href="tel:${business.phoneRaw}" style="color:${BRAND};text-decoration:none;font-weight:600;">${escapeHtml(business.phone)}</a>
                · <a href="mailto:${business.email}" style="color:${BRAND};text-decoration:none;">${escapeHtml(business.email)}</a><br />
                <a href="${business.website}" style="color:${BRAND};text-decoration:none;">${business.website}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string, color = BRAND) {
  return `<a href="${href}" style="display:inline-block;margin:6px 8px 6px 0;padding:12px 18px;background:${color};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;line-height:1;">${escapeHtml(label)}</a>`;
}

export function emailInfoTable(rows: Array<{ label: string; value: string }>) {
  const trs = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid ${BORDER};font-size:14px;color:${MUTED};width:38%;vertical-align:top;"><strong>${escapeHtml(row.label)}</strong></td>
          <td style="padding:10px 12px;border-bottom:1px solid ${BORDER};font-size:14px;color:#1a1a1a;vertical-align:top;">${row.value}</td>
        </tr>`
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;overflow:hidden;margin:16px 0;">${trs}</table>`;
}

export function clientContactBlock() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;background:${BG};border-radius:12px;">
      <tr>
        <td style="padding:16px 18px;font-size:14px;line-height:1.6;color:#1a1a1a;">
          <strong>Besoin d'une réponse rapide ?</strong><br />
          ${emailButton(`tel:${business.phoneRaw}`, `Appeler ${business.phone}`, "#2E9E6B")}
          ${emailButton(getWhatsAppUrl("Bonjour, je viens de faire une demande sur votre site."), "WhatsApp", "#25D366")}
        </td>
      </tr>
    </table>`;
}
