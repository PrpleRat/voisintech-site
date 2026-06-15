/** Catalogue VoisinTech — seedé uniquement sur le workspace du propriétaire (pas à l'inscription). */
export interface ServiceSeedInput {
  name: string;
  defaultDurationMinutes: number;
  defaultPriceCents: number;
  sortOrder: number;
  matchDeviceTypes?: string[];
  matchKeywords?: string[];
  quoteRole?: "diagnostic" | "follow_up" | "security" | "";
}

export const voisintechServiceSeed: ServiceSeedInput[] = [
  {
    name: "Diagnostic complet",
    defaultDurationMinutes: 30,
    defaultPriceCents: 3000,
    sortOrder: 0,
    quoteRole: "diagnostic",
  },
  {
    name: "Dépannage à domicile",
    defaultDurationMinutes: 60,
    defaultPriceCents: 5000,
    sortOrder: 1,
    matchDeviceTypes: ["PC Windows", "Mac", "Imprimante"],
    quoteRole: "follow_up",
  },
  {
    name: "Configuration smartphone",
    defaultDurationMinutes: 60,
    defaultPriceCents: 5000,
    sortOrder: 2,
    matchDeviceTypes: ["Smartphone", "Tablette"],
    quoteRole: "follow_up",
  },
  {
    name: "Wi-Fi & réseau",
    defaultDurationMinutes: 60,
    defaultPriceCents: 5000,
    sortOrder: 3,
    matchDeviceTypes: ["Box internet / Wi-Fi"],
    quoteRole: "follow_up",
  },
  {
    name: "Pack sécurité",
    defaultDurationMinutes: 60,
    defaultPriceCents: 6000,
    sortOrder: 4,
    matchKeywords: ["virus", "arnaque", "phishing", "malware", "ransomware", "sécurit", "securit"],
    quoteRole: "security",
  },
  {
    name: "Remise en état",
    defaultDurationMinutes: 60,
    defaultPriceCents: 8000,
    sortOrder: 5,
  },
  {
    name: "Formation à domicile",
    defaultDurationMinutes: 60,
    defaultPriceCents: 4000,
    sortOrder: 6,
    matchDeviceTypes: ["Autre"],
    quoteRole: "follow_up",
  },
  {
    name: "Assistance à distance",
    defaultDurationMinutes: 60,
    defaultPriceCents: 3500,
    sortOrder: 7,
  },
  {
    name: "Démarches en ligne",
    defaultDurationMinutes: 60,
    defaultPriceCents: 5000,
    sortOrder: 8,
  },
  {
    name: "Autre",
    defaultDurationMinutes: 60,
    defaultPriceCents: 0,
    sortOrder: 9,
  },
];
