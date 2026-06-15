import {
  defaultInvoiceAmount,
  suggestIntervention,
  suggestQuoteLines,
} from "@/lib/voisintech-pricing";

export interface QuoteLinkData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deviceType: string;
  problemDesc: string;
  preferredDate?: string | null;
}

export interface ContactLinkData {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}

function buildDeepLink(
  scheme: string,
  host: string,
  path = "",
  params: Record<string, string | undefined> = {}
) {
  let url = `${scheme}://${host}`;
  if (path) {
    url += path.startsWith("/") ? path : `/${path}`;
  }

  const query = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`)
    .join("&");

  if (query) url += `?${query}`;
  return url;
}

function fullAddress(data: Pick<QuoteLinkData, "address" | "city">) {
  return `${data.address}, ${data.city}`;
}

function interventionNotes(data: QuoteLinkData) {
  return `${data.deviceType} — ${data.problemDesc}`;
}

/** AgendaTrain — nouvelle intervention (prefill prêt pour Phase 2 iOS) */
export function agendaNewIntervention(data: QuoteLinkData) {
  const service = suggestIntervention(data.deviceType, data.problemDesc);
  return buildDeepLink("agendatrain", "interventions", "new", {
    client: data.name,
    phone: data.phone,
    address: fullAddress(data),
    date: data.preferredDate?.split("T")[0],
    notes: interventionNotes(data),
    service: service.serviceName,
    price: service.price.toFixed(2),
    duration: String(service.durationMinutes),
  });
}

/** AgendaTrain — intervention avec créneau suggéré (date + heure) */
export function agendaNewInterventionAt(
  data: QuoteLinkData,
  slot: { isoDate: string; time: string }
) {
  const service = suggestIntervention(data.deviceType, data.problemDesc);
  return buildDeepLink("agendatrain", "interventions", "new", {
    client: data.name,
    phone: data.phone,
    address: fullAddress(data),
    date: slot.isoDate,
    time: slot.time,
    notes: interventionNotes(data),
    service: service.serviceName,
    price: service.price.toFixed(2),
    duration: String(service.durationMinutes),
  });
}

export function agendaOpen() {
  return buildDeepLink("agendatrain", "agenda");
}

export function agendaClientSearch(name: string) {
  return buildDeepLink("agendatrain", "clients", "", { name });
}

/** TrainCRM — nouveau client */
export function crmNewClient(data: Pick<QuoteLinkData, "name" | "phone" | "email" | "address" | "city">) {
  return buildDeepLink("traincrm", "clients", "new", {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: fullAddress(data),
  });
}

export function crmClientSearch(name: string) {
  return buildDeepLink("traincrm", "clients", "", { name });
}

export function crmNewFollowUp() {
  return buildDeepLink("traincrm", "relances", "new");
}

export function factuTrainNewClient(data: Pick<QuoteLinkData, "name" | "phone" | "email" | "address" | "city">) {
  return buildDeepLink("factutrain", "clients", "new", {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: fullAddress(data),
  });
}

export function agendaNewClient(data: Pick<QuoteLinkData, "name" | "phone" | "email" | "address" | "city">) {
  return buildDeepLink("agendatrain", "clients", "new", {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: fullAddress(data),
  });
}

/** FactuTrain — nouveau devis */
export function factuTrainNewQuote(data: QuoteLinkData) {
  const lines = suggestQuoteLines(data.deviceType, data.problemDesc);
  const params: Record<string, string | undefined> = {
    client: data.name,
    phone: data.phone,
    email: data.email,
    address: fullAddress(data),
    description: interventionNotes(data),
  };

  lines.forEach((line, index) => {
    const suffix = index === 0 ? "" : String(index + 1);
    params[`label${suffix}`] = line.label;
    params[`amount${suffix}`] = line.unitPrice.toFixed(2);
    params[`qty${suffix}`] = String(line.quantity);
  });

  return buildDeepLink("factutrain", "quotes", "new", params);
}

/** FactuTrain — nouvelle facture (prefill supporté par l'app) */
export function factuTrainNewInvoice(data: QuoteLinkData, amount?: string) {
  const date = new Date().toISOString().split("T")[0];
  const resolvedAmount = amount ?? defaultInvoiceAmount(data.deviceType, data.problemDesc);
  return buildDeepLink("factutrain", "invoices", "new", {
    amount: resolvedAmount,
    client: data.name,
    label: `Dépannage ${data.deviceType}`,
    date,
  });
}

/** TrainCA — déclarer un CA (prefill supporté par l'app) */
export function trainCANewRevenue(data: QuoteLinkData, amount?: string) {
  const date = new Date().toISOString().split("T")[0];
  const resolvedAmount = amount ?? defaultInvoiceAmount(data.deviceType, data.problemDesc);
  return buildDeepLink("trainca", "revenue", "add", {
    amount: resolvedAmount,
    client: data.name,
    label: `Dépannage ${data.deviceType}`,
    date,
  });
}

export function trainCADashboard() {
  return buildDeepLink("trainca", "dashboard");
}

export interface TrainAppAction {
  id: string;
  label: string;
  href: string;
  description?: string;
  variant?: "default" | "outline" | "secondary";
}

export function quoteTrainActions(data: QuoteLinkData): {
  workflow: TrainAppAction[];
  postIntervention: TrainAppAction[];
} {
  const workflow = [
    {
      id: "crm",
      label: "Fiche client CRM",
      href: crmNewClient(data),
      description: "TrainCRM",
      variant: "outline" as const,
    },
    {
      id: "agenda",
      label: "Planifier RDV",
      href: agendaNewIntervention(data),
      description: "AgendaTrain",
      variant: "outline" as const,
    },
    {
      id: "quote",
      label: "Créer devis",
      href: factuTrainNewQuote(data),
      description: "FactuTrain",
      variant: "outline" as const,
    },
    {
      id: "agenda-view",
      label: "Voir agenda",
      href: agendaOpen(),
      description: "AgendaTrain",
      variant: "secondary" as const,
    },
  ];

  const postIntervention = [
    {
      id: "invoice",
      label: "Facturer",
      href: factuTrainNewInvoice(data),
      description: "FactuTrain",
      variant: "outline" as const,
    },
    {
      id: "revenue",
      label: "Déclarer CA",
      href: trainCANewRevenue(data),
      description: "TrainCA",
      variant: "outline" as const,
    },
    {
      id: "trainca",
      label: "Dashboard CA",
      href: trainCADashboard(),
      description: "TrainCA",
      variant: "secondary" as const,
    },
  ];

  return { workflow, postIntervention };
}

export function contactTrainActions(data: ContactLinkData): TrainAppAction[] {
  const actions: TrainAppAction[] = [
    {
      id: "crm",
      label: "Ajouter au CRM",
      href: crmNewClient({
        name: data.name,
        phone: data.phone || "",
        email: data.email,
        address: "",
        city: "",
      }),
      description: "TrainCRM",
      variant: "outline",
    },
    {
      id: "crm-search",
      label: "Chercher client",
      href: crmClientSearch(data.name),
      description: "TrainCRM",
      variant: "secondary",
    },
    {
      id: "followup",
      label: "Créer relance",
      href: crmNewFollowUp(),
      description: "TrainCRM",
      variant: "outline",
    },
  ];

  return actions;
}
