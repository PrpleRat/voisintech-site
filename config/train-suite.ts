export interface SuiteApp {
  id: string;
  /** Nom technique / icône iOS actuelle (bundle inchangé) */
  currentName: string;
  /** Nom public — modèle « {prefix} Agenda », etc. */
  marketingName: string;
  tagline: string;
  icon: string;
}

/** Préfixe marque publique (remplace « Train ») — modèle : Voisin Agenda, Voisin Facture… */
export const SUITE_BRAND_PREFIX = "Voisin";

function suiteAppName(role: string): string {
  return `${SUITE_BRAND_PREFIX} ${role}`;
}

export const suiteBrand = {
  prefix: SUITE_BRAND_PREFIX,
  name: `${SUITE_BRAND_PREFIX} Suite`,
  tagline: "La boîte à outils iOS pour micro-entrepreneurs et dépanneurs",
  description:
    "Quatre apps qui se parlent : agenda, facturation, comptabilité simplifiée et suivi clients. Pensées pour les indépendants sur le terrain — pas pour les geeks.",
  betaNote:
    "Beta iOS fermée pour l'instant. Inscrivez-vous : on vous envoie le lien TestFlight dès qu'une place se libère.",
};

/** @deprecated alias — préférer suiteBrand */
export const trainSuiteBrand = suiteBrand;

export const suiteApps: SuiteApp[] = [
  {
    id: "agendatrain",
    currentName: "AgendaTrain",
    marketingName: suiteAppName("Agenda"),
    tagline: "Planning & interventions à domicile",
    icon: "Calendar",
  },
  {
    id: "factutrain",
    currentName: "FactuTrain",
    marketingName: suiteAppName("Facture"),
    tagline: "Devis, factures & abonnements",
    icon: "FileText",
  },
  {
    id: "trainca",
    currentName: "TrainCA",
    marketingName: suiteAppName("Compta"),
    tagline: "Recettes, charges & déclarations",
    icon: "Calculator",
  },
  {
    id: "traincrm",
    currentName: "TrainCRM",
    marketingName: suiteAppName("Clients"),
    tagline: "Fiches clients & relances",
    icon: "Users",
  },
];

/** @deprecated alias */
export const trainSuiteApps = suiteApps;

export const suiteActivities = [
  { value: "depannage", label: "Dépannage informatique / assistance" },
  { value: "artisan", label: "Artisan / BTP" },
  { value: "consultant", label: "Consultant / prestataire de services" },
  { value: "commerce", label: "Commerce / vente" },
  { value: "autre", label: "Autre micro-entreprise" },
];

/** @deprecated alias */
export const trainSuiteActivities = suiteActivities;
