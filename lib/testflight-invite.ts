import { suiteApps, suiteBrand } from "@/config/train-suite";
import type { SuiteAppId, TestFlightLinks } from "@/config/testflight";

export function parseAppsInterested(json: string): SuiteAppId[] {
  try {
    const ids = JSON.parse(json) as string[];
    if (Array.isArray(ids) && ids.length > 0) {
      return ids.filter((id): id is SuiteAppId =>
        suiteApps.some((app) => app.id === id)
      );
    }
  } catch {
    /* ignore */
  }
  return suiteApps.map((app) => app.id as SuiteAppId);
}

export interface AppTestFlightLink {
  id: SuiteAppId;
  name: string;
  url: string;
}

export function getLinksForSignup(
  appsInterested: string,
  links: TestFlightLinks
): AppTestFlightLink[] {
  const ids = parseAppsInterested(appsInterested);
  return ids
    .map((id) => {
      const app = suiteApps.find((a) => a.id === id);
      const url = links[id];
      if (!app || !url) return null;
      return { id, name: app.marketingName, url };
    })
    .filter((item): item is AppTestFlightLink => item !== null);
}

export function buildInviteEmail(
  signup: { name: string; email: string },
  appsInterested: string,
  links: TestFlightLinks
) {
  const appLinks = getLinksForSignup(appsInterested, links);
  const subject = `Votre accès beta ${suiteBrand.name} (TestFlight)`;

  const bodyLines = [
    `Bonjour ${signup.name},`,
    "",
    `Merci pour votre inscription à la beta ${suiteBrand.name}. Voici vos liens TestFlight pour installer les apps sur iPhone :`,
    "",
    ...appLinks.map((link) => `• ${link.name} : ${link.url}`),
    "",
    "Sur iPhone :",
    "1. Ouvrez chaque lien ci-dessus",
    "2. Installez TestFlight si Apple le demande",
    "3. Acceptez l'invitation puis installez l'app",
    "",
    "Une question ? Répondez directement à cet email.",
    "",
    "À bientôt,",
    "L'équipe Voisin Tech",
  ];

  const body = bodyLines.join("\n");
  const mailto = `mailto:${encodeURIComponent(signup.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return { subject, body, mailto, appLinks };
}

export function buildInviteSms(
  signup: { name: string },
  appsInterested: string,
  links: TestFlightLinks
) {
  const appLinks = getLinksForSignup(appsInterested, links);

  if (appLinks.length === 0) {
    return `Bonjour ${signup.name}, votre accès beta ${suiteBrand.name} arrive bientôt par email.`;
  }

  if (appLinks.length === 1) {
    return `Bonjour ${signup.name}, voici votre lien TestFlight ${appLinks[0].name} (${suiteBrand.name}) : ${appLinks[0].url}`;
  }

  const linkList = appLinks.map((link) => `${link.name}: ${link.url}`).join(" | ");
  return `Bonjour ${signup.name}, beta ${suiteBrand.name} — liens TestFlight : ${linkList}`;
}

export function buildSmsHref(phone: string, message: string) {
  const normalized = phone.replace(/\s/g, "");
  return `sms:${normalized}?body=${encodeURIComponent(message)}`;
}
