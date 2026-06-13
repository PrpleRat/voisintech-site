import { Resend } from "resend";
import nodemailer from "nodemailer";
import { business } from "@/config/content";
import { quoteTrainActions } from "@/lib/train-deeplinks";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const resendFromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
const replyToEmail = process.env.REPLY_TO_EMAIL || business.email;

function getNotificationEmails(): string[] {
  const raw =
    process.env.NOTIFICATION_EMAILS ||
    process.env.NOTIFICATION_EMAIL ||
    business.email;
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function getGmailTransport() {
  const user = process.env.GMAIL_USER || business.email;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: pass.replace(/\s/g, "") },
  });
}

function getFromAddress(provider: "gmail" | "resend") {
  if (provider === "gmail") {
    return `VoisinTech <${process.env.GMAIL_USER || business.email}>`;
  }
  return `VoisinTech <${resendFromEmail}>`;
}

export interface EmailResult {
  success: boolean;
  provider?: "gmail" | "resend";
  to: string;
  skipped?: boolean;
  error?: string;
}

interface QuoteEmailData {
  deviceType: string;
  problemDesc: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  preferredDays: string;
  preferredTime: string;
  preferredDate?: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface SendOptions {
  replyTo?: string;
}

function baseStyles() {
  return `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 600px;
    margin: 0 auto;
  `;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trainLinksHtml(data: QuoteEmailData) {
  const actions = quoteTrainActions({
    ...data,
    preferredDate: data.preferredDate ?? null,
  });

  const buttons = actions.workflow
    .map(
      (a) =>
        `<a href="${a.href}" style="display:inline-block;margin:4px 8px 4px 0;padding:10px 16px;background:#1E6FA5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">${escapeHtml(a.label)}</a>`
    )
    .join("");

  return `
    <div style="margin-top:24px;padding:16px;background:#F7FBFF;border-radius:8px;">
      <p style="margin:0 0 12px;font-weight:bold;color:#1E6FA5;">Ouvrir dans vos apps (iPhone) :</p>
      ${buttons}
      <p style="margin:12px 0 0;font-size:12px;color:#666;">Ouvrez cet email sur iPhone avec les apps Train installées.</p>
    </div>
  `;
}

async function sendViaGmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  options?: SendOptions
): Promise<EmailResult> {
  const transport = getGmailTransport();
  if (!transport) {
    return {
      success: false,
      to,
      skipped: true,
      error: "GMAIL_APP_PASSWORD manquant dans .env",
    };
  }

  try {
    await transport.sendMail({
      from: getFromAddress("gmail"),
      to,
      replyTo: options?.replyTo,
      subject,
      html,
      text,
      headers: {
        "X-Entity-Ref-ID": `voisintech-${Date.now()}`,
      },
    });
    console.log(`[Email/Gmail] Envoyé vers ${to}`);
    return { success: true, provider: "gmail", to };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Gmail";
    console.error(`[Email/Gmail] Échec vers ${to}:`, message);
    return { success: false, provider: "gmail", to, error: message };
  }
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  text: string,
  options?: SendOptions
): Promise<EmailResult> {
  if (!resend) {
    return {
      success: false,
      to,
      skipped: true,
      error: "RESEND_API_KEY manquante",
    };
  }

  const result = await resend.emails.send({
    from: getFromAddress("resend"),
    to,
    replyTo: options?.replyTo,
    subject,
    html,
    text,
    headers: {
      "X-Entity-Ref-ID": `voisintech-${Date.now()}`,
    },
  });

  if (result.error) {
    console.error(`[Email/Resend] Échec vers ${to}:`, result.error.message);
    return { success: false, provider: "resend", to, error: result.error.message };
  }

  console.log(`[Email/Resend] Envoyé vers ${to}:`, result.data?.id);
  return { success: true, provider: "resend", to };
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  options?: SendOptions
): Promise<EmailResult> {
  const gmailResult = await sendViaGmail(to, subject, html, text, options);
  if (gmailResult.success) return gmailResult;

  if (!gmailResult.skipped) {
    console.warn(`[Email] Gmail échoué, tentative Resend pour ${to}`);
  }

  return sendViaResend(to, subject, html, text, options);
}

async function sendToAllNotifications(
  subject: string,
  html: string,
  text: string
): Promise<EmailResult[]> {
  const emails = getNotificationEmails();
  return Promise.all(emails.map((email) => sendEmail(email, subject, html, text)));
}

export async function sendQuoteNotificationToOwner(data: QuoteEmailData) {
  const html = `
    <div style="${baseStyles()}">
      <h2 style="color: #1E6FA5;">Nouvelle demande de devis — VoisinTech</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Appareil</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${escapeHtml(data.deviceType)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Problème</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${escapeHtml(data.problemDesc)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Nom</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Téléphone</strong></td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="tel:${data.phone}">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email client</strong></td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="mailto:${data.email}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Adresse</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${escapeHtml(data.address)}, ${escapeHtml(data.city)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Date souhaitée</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${escapeHtml(data.preferredDate || "Non précisée")}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Jours préférés</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${escapeHtml(data.preferredDays)}</td></tr>
        <tr><td style="padding:8px;"><strong>Créneau</strong></td><td style="padding:8px;">${escapeHtml(data.preferredTime)}</td></tr>
      </table>
      ${trainLinksHtml(data)}
      <p style="margin-top:24px; color:#666;">Répondez rapidement — le client attend un retour sous 2h.</p>
    </div>
  `;

  const text = `Nouvelle demande de devis VoisinTech
Appareil: ${data.deviceType}
Problème: ${data.problemDesc}
Nom: ${data.name}
Tél: ${data.phone}
Email: ${data.email}
Adresse: ${data.address}, ${data.city}
Disponibilités: ${data.preferredDays} — ${data.preferredTime}`;

  return sendToAllNotifications(
    `[VoisinTech] Nouvelle demande de devis — ${data.name}`,
    html,
    text
  );
}

export async function sendQuoteConfirmationToClient(data: QuoteEmailData) {
  const html = `
    <div style="${baseStyles()}">
      <h2 style="color: #1E6FA5;">Votre demande a bien été reçue</h2>
      <p>Bonjour ${escapeHtml(data.name)},</p>
      <p>Merci pour votre confiance ! J'ai bien reçu votre demande de devis pour <strong>${escapeHtml(data.deviceType)}</strong>.</p>
      <p><strong>Récapitulatif :</strong></p>
      <ul>
        <li>Problème : ${escapeHtml(data.problemDesc)}</li>
        <li>Adresse : ${escapeHtml(data.address)}, ${escapeHtml(data.city)}</li>
        <li>Disponibilités : ${escapeHtml(data.preferredDays)} — ${escapeHtml(data.preferredTime)}</li>
      </ul>
      <p>Je vous recontacte <strong>dans les 2 heures</strong> (en journée) pour convenir d'un rendez-vous.</p>
      <p>En cas d'urgence, appelez-moi au <a href="tel:${business.phoneRaw}" style="color:#1E6FA5; font-weight:bold;">${business.phone}</a>.</p>
      <p style="margin-top:24px;">À très bientôt,<br><strong>VoisinTech</strong><br>${business.slogan}<br>${business.website}</p>
    </div>
  `;

  const text = `Bonjour ${data.name},

Votre demande de devis VoisinTech a bien été reçue.

Appareil: ${data.deviceType}
Problème: ${data.problemDesc}
Adresse: ${data.address}, ${data.city}
Disponibilités: ${data.preferredDays} — ${data.preferredTime}

Je vous recontacte dans les 2 heures en journée.
Urgence: ${business.phone}

VoisinTech — ${business.website}`;

  return sendEmail(
    data.email,
    "VoisinTech — Votre demande de devis a bien été reçue",
    html,
    text,
    { replyTo: replyToEmail }
  );
}

export async function sendContactNotificationToOwner(data: ContactEmailData) {
  const html = `
    <div style="${baseStyles()}">
      <h2 style="color: #1E6FA5;">Nouveau message de contact — VoisinTech</h2>
      <p><strong>Nom :</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(data.phone || "Non renseigné")}</p>
      <p><strong>Message :</strong></p>
      <p style="background:#F7FBFF; padding:16px; border-radius:8px;">${escapeHtml(data.message)}</p>
    </div>
  `;

  const text = `Nouveau message VoisinTech
Nom: ${data.name}
Email: ${data.email}
Tél: ${data.phone || "—"}
Message: ${data.message}`;

  return sendToAllNotifications(
    `[VoisinTech] Nouveau message — ${data.name}`,
    html,
    text
  );
}

export async function sendContactConfirmationToClient(data: ContactEmailData) {
  const html = `
    <div style="${baseStyles()}">
      <h2 style="color: #1E6FA5;">Message bien reçu</h2>
      <p>Bonjour ${escapeHtml(data.name)},</p>
      <p>Merci pour votre message. Je vous réponds dans les plus brefs délais, généralement sous 2 heures en journée.</p>
      <p>Pour une demande urgente, appelez-moi au <a href="tel:${business.phoneRaw}" style="color:#1E6FA5; font-weight:bold;">${business.phone}</a>.</p>
      <p style="margin-top:24px;">Cordialement,<br><strong>VoisinTech</strong><br>${business.website}</p>
    </div>
  `;

  const text = `Bonjour ${data.name},

Votre message VoisinTech a bien été reçu. Réponse sous 2h en journée.
Urgence: ${business.phone}

VoisinTech — ${business.website}`;

  return sendEmail(
    data.email,
    "VoisinTech — Votre message a bien été reçu",
    html,
    text,
    { replyTo: replyToEmail }
  );
}
