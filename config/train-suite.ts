export interface TrainSuiteApp {
  id: string;
  /** Nom affiché sur l’icône iOS aujourd’hui */
  currentName: string;
  /** Nom conseillé App Store (sous-titre clair) */
  marketingName: string;
  tagline: string;
  icon: string;
}

export const trainSuiteBrand = {
  name: "Train Suite",
  tagline: "La boîte à outils iOS pour micro-entrepreneurs et dépanneurs",
  description:
    "Quatre apps qui se parlent : agenda, facturation, comptabilité simplifiée et suivi clients. Pensées pour les indépendants sur le terrain — pas pour les geeks.",
  betaNote:
    "Beta iOS fermée pour l’instant. Inscrivez-vous : on vous envoie le lien TestFlight dès qu’une place se libère.",
};

export const trainSuiteApps: TrainSuiteApp[] = [
  {
    id: "agendatrain",
    currentName: "AgendaTrain",
    marketingName: "Train Agenda",
    tagline: "Planning & interventions à domicile",
    icon: "Calendar",
  },
  {
    id: "factutrain",
    currentName: "FactuTrain",
    marketingName: "Train Facture",
    tagline: "Devis, factures & abonnements",
    icon: "FileText",
  },
  {
    id: "trainca",
    currentName: "TrainCA",
    marketingName: "Train Compta",
    tagline: "Recettes, charges & déclarations",
    icon: "Calculator",
  },
  {
    id: "traincrm",
    currentName: "TrainCRM",
    marketingName: "Train Clients",
    tagline: "Fiches clients & relances",
    icon: "Users",
  },
];

export const trainSuiteActivities = [
  { value: "depannage", label: "Dépannage informatique / assistance" },
  { value: "artisan", label: "Artisan / BTP" },
  { value: "consultant", label: "Consultant / prestataire de services" },
  { value: "commerce", label: "Commerce / vente" },
  { value: "autre", label: "Autre micro-entreprise" },
];
