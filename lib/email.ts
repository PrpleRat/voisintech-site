import { Resend } from "resend";
import nodemailer from "nodemailer";
import { business } from "@/config/content";
import { proFormConfigs, type ProServiceType } from "@/config/pro-forms";
import { quoteTrainActions } from "@/lib/train-deeplinks";
import { toGatewayUrl } from "@/lib/deeplink-gateway";
import {
  clientContactBlock,
  emailButton,
  emailInfoTable,
  escapeHtml,
  renderEmailLayout,
} from "@/lib/email-template";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const resendFromEmail = process.env.FROM_EMAIL || "contact@voisintech.fr";
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

function mailHeaders() {
  return {
    "X-Entity-Ref-ID": `voisintech-${Date.now()}`,
    Precedence: "auto",
  };
}

function trainLinksHtml(data: QuoteEmailData) {
  const actions = quoteTrainActions({
    ...data,
    preferredDate: data.preferredDate ?? null,
  });

  const buttons = actions.workflow
    .map((a) => {
      const link = toGatewayUrl(a.href);
      return `<div style="margin-bottom:10px;">
          ${emailButton(link, `${a.label} (${a.description})`)}
          <p style="margin:4px 0 0;font-size:11px;color:#5c6570;word-break:break-all;">${escapeHtml(link)}</p>
        </div>`;
    })
    .join("");

  const postButtons = actions.postIntervention
    .map((a) => {
      const link = toGatewayUrl(a.href);
      return `<div style="margin-bottom:10px;">
          ${emailButton(link, `${a.label} (${a.description})`, "#155A87")}
        </div>`;
    })
    .join("");

  return `
    <div style="margin-top:24px;padding:18px;background:#f4f8fb;border-radius:12px;border:1px solid #e8edf2;">
      <p style="margin:0 0 12px;font-weight:bold;color:#1E6FA5;font-size:15px;">Ouvrir dans vos apps Train (iPhone)</p>
      <p style="margin:0 0 14px;font-size:13px;color:#5c6570;line-height:1.5;">Ouvrez cet email sur votre iPhone, puis touchez un bouton ci-dessous. Les liens passent par voisintech.fr puis ouvrent l'app installée.</p>
      ${buttons}
      <p style="margin:18px 0 10px;font-size:13px;font-weight:bold;color:#155A87;">Après intervention</p>
      ${postButtons}
    </div>
  `;
}

function trainLinksText(data: QuoteEmailData) {
  const actions = quoteTrainActions({
    ...data,
    preferredDate: data.preferredDate ?? null,
  });

  const lines = [
    "",
    "— Apps Train (ouvrir sur iPhone) —",
    ...actions.workflow.map(
      (a) => `${a.label} (${a.description}): ${toGatewayUrl(a.href)}`
    ),
    "",
    "Après intervention:",
    ...actions.postIntervention.map(
      (a) => `${a.label}: ${toGatewayUrl(a.href)}`
    ),
  ];

  return lines.join("\n");
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
    headers: mailHeaders(),
  });

  if (result.error) {
    console.error(`[Email/Resend] Échec vers ${to}:`, result.error.message);
    return { success: false, provider: "resend", to, error: result.error.message };
  }

  console.log(`[Email/Resend] Envoyé vers ${to}:`, result.data?.id);
  return { success: true, provider: "resend", to };
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
      error: "GMAIL_APP_PASSWORD manquant",
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
      headers: mailHeaders(),
    });
    console.log(`[Email/Gmail] Envoyé vers ${to}`);
    return { success: true, provider: "gmail", to };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Gmail";
    console.error(`[Email/Gmail] Échec vers ${to}:`, message);
    return { success: false, provider: "gmail", to, error: message };
  }
}

/** Resend (domaine vérifié) en priorité — meilleure délivrabilité. */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  options?: SendOptions
): Promise<EmailResult> {
  const resendResult = await sendViaResend(to, subject, html, text, options);
  if (resendResult.success) return resendResult;

  if (!resendResult.skipped) {
    console.warn(`[Email] Resend échoué, tentative Gmail pour ${to}`);
  }

  return sendViaGmail(to, subject, html, text, options);
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
  const bodyHtml = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#1E6FA5;">Nouvelle demande de devis</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;line-height:1.6;">
      Un client vient de demander un devis sur <strong>voisintech.fr</strong>. Répondez sous 2 h en journée.
    </p>
    ${emailInfoTable([
      { label: "Client", value: escapeHtml(data.name) },
      { label: "Téléphone", value: `<a href="tel:${escapeHtml(data.phone)}" style="color:#1E6FA5;font-weight:600;text-decoration:none;">${escapeHtml(data.phone)}</a>` },
      { label: "Email", value: `<a href="mailto:${escapeHtml(data.email)}" style="color:#1E6FA5;text-decoration:none;">${escapeHtml(data.email)}</a>` },
      { label: "Appareil", value: escapeHtml(data.deviceType) },
      { label: "Problème", value: escapeHtml(data.problemDesc) },
      { label: "Adresse", value: `${escapeHtml(data.address)}, ${escapeHtml(data.city)}` },
      { label: "Date souhaitée", value: escapeHtml(data.preferredDate || "Non précisée") },
      { label: "Jours préférés", value: escapeHtml(data.preferredDays) },
      { label: "Créneau", value: escapeHtml(data.preferredTime) },
    ])}
    ${trainLinksHtml(data)}
  `;

  const html = renderEmailLayout({
    preheader: `Nouveau devis de ${data.name} — ${data.deviceType}`,
    title: `Nouvelle demande de devis — ${data.name}`,
    bodyHtml,
  });

  const text = `Nouvelle demande de devis VoisinTech

Client: ${data.name}
Tél: ${data.phone}
Email: ${data.email}
Appareil: ${data.deviceType}
Problème: ${data.problemDesc}
Adresse: ${data.address}, ${data.city}
Date: ${data.preferredDate || "—"}
Disponibilités: ${data.preferredDays} — ${data.preferredTime}
${trainLinksText(data)}`;

  return sendToAllNotifications(
    `Nouveau devis — ${data.name} (${data.city})`,
    html,
    text
  );
}

export async function sendQuoteConfirmationToClient(data: QuoteEmailData) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#1E6FA5;">Demande bien reçue</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Bonjour <strong>${escapeHtml(data.name)}</strong>,</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      Merci pour votre confiance. J'ai bien reçu votre demande de devis pour
      <strong>${escapeHtml(data.deviceType)}</strong>.
    </p>
    ${emailInfoTable([
      { label: "Problème", value: escapeHtml(data.problemDesc) },
      { label: "Adresse", value: `${escapeHtml(data.address)}, ${escapeHtml(data.city)}` },
      { label: "Disponibilités", value: `${escapeHtml(data.preferredDays)} — ${escapeHtml(data.preferredTime)}` },
    ])}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">
      Je vous recontacte <strong>dans les 2 heures</strong> (en journée) pour convenir d'un rendez-vous à domicile.
    </p>
    ${clientContactBlock()}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">
      À très bientôt,<br />
      <strong>L'équipe VoisinTech</strong>
    </p>
  `;

  const html = renderEmailLayout({
    preheader: "Votre demande de devis a bien été reçue. Réponse sous 2 h.",
    title: "Demande de devis reçue — VoisinTech",
    bodyHtml,
  });

  const text = `Bonjour ${data.name},

Votre demande de devis VoisinTech a bien été reçue.

Appareil: ${data.deviceType}
Problème: ${data.problemDesc}
Adresse: ${data.address}, ${data.city}
Disponibilités: ${data.preferredDays} — ${data.preferredTime}

Je vous recontacte dans les 2 heures en journée.
Téléphone: ${business.phone}
WhatsApp: ${business.phone}

À très bientôt,
VoisinTech
${business.website}`;

  return sendEmail(
    data.email,
    "VoisinTech — Votre demande de devis est bien reçue",
    html,
    text,
    { replyTo: replyToEmail }
  );
}

export async function sendContactNotificationToOwner(data: ContactEmailData) {
  const bodyHtml = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#1E6FA5;">Nouveau message contact</h1>
    ${emailInfoTable([
      { label: "Nom", value: escapeHtml(data.name) },
      { label: "Email", value: `<a href="mailto:${escapeHtml(data.email)}" style="color:#1E6FA5;text-decoration:none;">${escapeHtml(data.email)}</a>` },
      { label: "Téléphone", value: escapeHtml(data.phone || "Non renseigné") },
      { label: "Message", value: escapeHtml(data.message) },
    ])}
  `;

  const html = renderEmailLayout({
    preheader: `Message de ${data.name} via le formulaire contact`,
    title: `Nouveau message — ${data.name}`,
    bodyHtml,
  });

  const text = `Nouveau message VoisinTech
Nom: ${data.name}
Email: ${data.email}
Tél: ${data.phone || "—"}
Message: ${data.message}`;

  return sendToAllNotifications(
    `Nouveau message — ${data.name}`,
    html,
    text
  );
}

export async function sendContactConfirmationToClient(data: ContactEmailData) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#1E6FA5;">Message bien reçu</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Bonjour <strong>${escapeHtml(data.name)}</strong>,</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      Merci pour votre message. Je vous réponds dans les plus brefs délais, en général sous 2 heures en journée.
    </p>
    ${clientContactBlock()}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">
      Cordialement,<br />
      <strong>L'équipe VoisinTech</strong>
    </p>
  `;

  const html = renderEmailLayout({
    preheader: "Votre message a bien été reçu. Réponse sous 2 h.",
    title: "Message reçu — VoisinTech",
    bodyHtml,
  });

  const text = `Bonjour ${data.name},

Votre message VoisinTech a bien été reçu. Réponse sous 2 h en journée.
Téléphone: ${business.phone}

Cordialement,
VoisinTech
${business.website}`;

  return sendEmail(
    data.email,
    "VoisinTech — Votre message est bien reçu",
    html,
    text,
    { replyTo: replyToEmail }
  );
}

export interface ProRequestEmailData {
  serviceType: ProServiceType;
  name: string;
  phone: string;
  email: string;
  company?: string;
  city: string;
  details: Record<string, unknown>;
}

function formatProDetailsRows(data: ProRequestEmailData): Array<{ label: string; value: string }> {
  const d = data.details;
  if (data.serviceType === "site-web") {
    const features = Array.isArray(d.features) ? (d.features as string[]).join(", ") : "—";
    return [
      { label: "Type de site", value: String(d.siteType || "—") },
      { label: "Pages", value: String(d.pageCount || "—") },
      { label: "Budget", value: String(d.budget || "—") },
      { label: "Délai", value: String(d.deadline || "—") },
      { label: "Site existant", value: String(d.hasExistingSite || "—") },
      { label: "URL actuelle", value: String(d.existingUrl || "—") },
      { label: "Fonctionnalités", value: features },
      { label: "Description", value: String(d.projectDesc || "—") },
    ];
  }
  const needs = Array.isArray(d.needs) ? (d.needs as string[]).join(", ") : "—";
  return [
    { label: "Statut", value: String(d.legalStatus || "—") },
    { label: "Secteur", value: String(d.sector || "—") },
    { label: "Besoins", value: needs },
    { label: "Urgence", value: String(d.urgency || "—") },
    { label: "Description", value: String(d.projectDesc || "—") },
  ];
}

export async function sendProRequestNotificationToOwner(data: ProRequestEmailData) {
  const serviceLabel = proFormConfigs[data.serviceType].title;
  const bodyHtml = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#1E6FA5;">Nouvelle demande Espace Pro</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;line-height:1.6;">
      <strong>${escapeHtml(serviceLabel)}</strong> — répondez sous 2 h en journée.
    </p>
    ${emailInfoTable([
      { label: "Client", value: escapeHtml(data.name) },
      { label: "Entreprise", value: escapeHtml(data.company || "—") },
      { label: "Téléphone", value: `<a href="tel:${escapeHtml(data.phone)}" style="color:#1E6FA5;font-weight:600;text-decoration:none;">${escapeHtml(data.phone)}</a>` },
      { label: "Email", value: `<a href="mailto:${escapeHtml(data.email)}" style="color:#1E6FA5;text-decoration:none;">${escapeHtml(data.email)}</a>` },
      { label: "Ville", value: escapeHtml(data.city) },
      ...formatProDetailsRows(data).map((r) => ({
        label: r.label,
        value: escapeHtml(r.value),
      })),
    ])}
  `;

  const html = renderEmailLayout({
    preheader: `Demande Pro — ${data.name}`,
    title: `Espace Pro — ${serviceLabel}`,
    bodyHtml,
  });

  const detailLines = formatProDetailsRows(data)
    .map((r) => `${r.label}: ${r.value}`)
    .join("\n");

  const text = `Nouvelle demande Espace Pro — ${serviceLabel}

Client: ${data.name}
Entreprise: ${data.company || "—"}
Tél: ${data.phone}
Email: ${data.email}
Ville: ${data.city}

${detailLines}`;

  return sendToAllNotifications(`[Pro] ${serviceLabel} — ${data.name}`, html, text);
}

export async function sendProRequestConfirmationToClient(data: ProRequestEmailData) {
  const serviceLabel = proFormConfigs[data.serviceType].title;
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#1E6FA5;">Demande bien reçue</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Bonjour <strong>${escapeHtml(data.name)}</strong>,</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      Merci pour votre demande concernant <strong>${escapeHtml(serviceLabel)}</strong>.
      J'étudie votre projet et je vous recontacte <strong>dans les 2 heures</strong> en journée.
    </p>
    ${clientContactBlock()}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">
      À très bientôt,<br />
      <strong>L'équipe VoisinTech</strong>
    </p>
  `;

  const html = renderEmailLayout({
    preheader: "Votre demande Espace Pro a bien été reçue.",
    title: `Demande reçue — ${serviceLabel}`,
    bodyHtml,
  });

  const text = `Bonjour ${data.name},

Votre demande VoisinTech (${serviceLabel}) a bien été reçue.
Réponse sous 2 h en journée.
Téléphone: ${business.phone}

VoisinTech — ${business.website}`;

  return sendEmail(
    data.email,
    `VoisinTech — Votre demande ${serviceLabel} est bien reçue`,
    html,
    text,
    { replyTo: replyToEmail }
  );
}
