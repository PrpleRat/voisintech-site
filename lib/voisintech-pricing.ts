import { pricing } from "@/config/content";

/** Aligné sur config/content.ts — source de vérité site + deep links apps */
export interface SuggestedQuoteLine {
  label: string;
  quantity: number;
  unitPrice: number;
}

function euroAmount(raw: string): number {
  const match = raw.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

const HOURLY_DEPANNAGE = euroAmount(pricing.hourly[0]?.price ?? "50€/h");
const HOURLY_FORMATION = euroAmount(pricing.hourly[1]?.price ?? "40€/h");
const HOURLY_REMOTE = euroAmount(pricing.hourly[2]?.price ?? "35€/h");

const PKG_DIAGNOSTIC = euroAmount(pricing.packages[0]?.price ?? "30€");
const PKG_REMISE = euroAmount(pricing.packages[1]?.price ?? "80€");
const PKG_SMARTPHONE = euroAmount(pricing.packages[2]?.price ?? "50€");
const PKG_SECURITY = euroAmount(pricing.packages[3]?.price ?? "60€");

const SECURITY_KEYWORDS =
  /\b(virus|arnaque|phishing|malware|ransomware|pirat|hack|sécurit|securit|mot de passe|password)\b/i;

export function followUpLineForDevice(deviceType: string): SuggestedQuoteLine {
  switch (deviceType) {
    case "Smartphone":
    case "Tablette":
      return { label: "Configuration smartphone", quantity: 1, unitPrice: PKG_SMARTPHONE };
    case "Box internet / Wi-Fi":
      return { label: "Wi-Fi & réseau", quantity: 1, unitPrice: HOURLY_DEPANNAGE };
    case "Autre":
      return { label: "Formation à domicile", quantity: 1, unitPrice: HOURLY_FORMATION };
    default:
      return { label: "Dépannage à domicile", quantity: 1, unitPrice: HOURLY_DEPANNAGE };
  }
}

/** Lignes suggérées pour un lead devis web → FactuTrain */
export function suggestQuoteLines(
  deviceType: string,
  problemDesc = ""
): SuggestedQuoteLine[] {
  const lines: SuggestedQuoteLine[] = [
    {
      label: pricing.packages[0]?.label ?? "Diagnostic complet",
      quantity: 1,
      unitPrice: PKG_DIAGNOSTIC,
    },
  ];

  if (SECURITY_KEYWORDS.test(problemDesc)) {
    lines.push({
      label: pricing.packages[3]?.label ?? "Pack sécurité",
      quantity: 1,
      unitPrice: PKG_SECURITY,
    });
    return lines;
  }

  lines.push(followUpLineForDevice(deviceType));
  return lines;
}

export interface SuggestedIntervention {
  serviceName: string;
  durationMinutes: number;
  price: number;
}

/** Première intervention planifiée depuis un lead */
export function suggestIntervention(deviceType: string, problemDesc = ""): SuggestedIntervention {
  if (SECURITY_KEYWORDS.test(problemDesc)) {
    return { serviceName: "Pack sécurité", durationMinutes: 60, price: PKG_SECURITY };
  }

  switch (deviceType) {
    case "Smartphone":
    case "Tablette":
      return {
        serviceName: "Configuration smartphone",
        durationMinutes: 60,
        price: PKG_SMARTPHONE,
      };
    case "Box internet / Wi-Fi":
      return { serviceName: "Wi-Fi & réseau", durationMinutes: 60, price: HOURLY_DEPANNAGE };
    default:
      return {
        serviceName: "Diagnostic complet",
        durationMinutes: 30,
        price: PKG_DIAGNOSTIC,
      };
  }
}

export function defaultInvoiceAmount(deviceType: string, problemDesc = ""): string {
  const intervention = suggestIntervention(deviceType, problemDesc);
  return intervention.price.toFixed(2);
}

export const voisintechPricingCatalog = {
  hourlyDepannage: HOURLY_DEPANNAGE,
  hourlyFormation: HOURLY_FORMATION,
  hourlyRemote: HOURLY_REMOTE,
  diagnostic: PKG_DIAGNOSTIC,
  remiseEnEtat: PKG_REMISE,
  configSmartphone: PKG_SMARTPHONE,
  packSecurite: PKG_SECURITY,
} as const;
