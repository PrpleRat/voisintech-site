import { business } from "@/config/content";

/** Numéro international sans + (ex. 33582950642) */
export const whatsappPhoneIntl = `33${business.phoneRaw.replace(/^0/, "")}`;

export function getWhatsAppUrl(
  message = "Bonjour, j'ai besoin d'aide informatique."
) {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${whatsappPhoneIntl}?${params.toString()}`;
}
