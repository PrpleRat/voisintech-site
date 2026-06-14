export type ProServiceType = "site-web" | "urssaf";

export interface ProFormConfig {
  serviceType: ProServiceType;
  title: string;
  subtitle: string;
  successTitle: string;
  successMessage: string;
}

export const proFormConfigs: Record<ProServiceType, ProFormConfig> = {
  "site-web": {
    serviceType: "site-web",
    title: "Devis site web sur mesure",
    subtitle:
      "Décrivez votre projet en 2 étapes. Réponse personnalisée sous 2 h en journée — sans engagement.",
    successTitle: "Demande de devis envoyée !",
    successMessage:
      "Merci ! J'étudie votre projet et je vous recontacte avec une proposition adaptée à votre activité.",
  },
  urssaf: {
    serviceType: "urssaf",
    title: "Accompagnement URSSAF & admin",
    subtitle:
      "Expliquez votre situation en 2 étapes. Premier échange gratuit pour cadrer vos besoins.",
    successTitle: "Demande d'accompagnement envoyée !",
    successMessage:
      "Merci ! Je vous recontacte rapidement pour voir comment je peux vous aider concrètement.",
  },
};

export const siteWebSiteTypes = [
  { value: "vitrine", label: "Site vitrine (présentation activité)" },
  { value: "landing", label: "Landing page (1 page conversion)" },
  { value: "blog", label: "Site + blog / actualités" },
  { value: "ecommerce-leger", label: "Petite boutique en ligne" },
  { value: "refonte", label: "Refonte d'un site existant" },
  { value: "autre", label: "Autre / je ne sais pas encore" },
];

export const siteWebPageCounts = [
  { value: "1-3", label: "1 à 3 pages" },
  { value: "4-8", label: "4 à 8 pages" },
  { value: "9+", label: "9 pages et plus" },
  { value: "unknown", label: "À définir ensemble" },
];

export const budgetRanges = [
  { value: "<500", label: "Moins de 500 €" },
  { value: "500-1000", label: "500 à 1 000 €" },
  { value: "1000-2500", label: "1 000 à 2 500 €" },
  { value: "2500+", label: "Plus de 2 500 €" },
  { value: "unknown", label: "À discuter" },
];

export const deadlineOptions = [
  { value: "urgent", label: "Urgent (moins de 2 semaines)" },
  { value: "1mois", label: "Sous 1 mois" },
  { value: "2-3mois", label: "2 à 3 mois" },
  { value: "flexible", label: "Pas de date fixe" },
];

export const siteWebFeatures = [
  { value: "contact", label: "Formulaire de contact" },
  { value: "seo", label: "Référencement local (SEO)" },
  { value: "blog", label: "Blog / articles" },
  { value: "avis", label: "Avis clients" },
  { value: "rdv", label: "Prise de rendez-vous" },
  { value: "multilingue", label: "Plusieurs langues" },
];

export const urssafStatuses = [
  { value: "creation", label: "Je veux créer ma micro-entreprise" },
  { value: "auto", label: "Auto-entrepreneur déjà actif" },
  { value: "ei", label: "Entreprise individuelle (EI)" },
  { value: "societe", label: "Société (EURL, SASU…)" },
  { value: "autre", label: "Autre statut / je ne sais pas" },
];

export const urssafNeeds = [
  { value: "premiers-pas", label: "Premiers pas (inscription, choix activité)" },
  { value: "declaration-mensuelle", label: "Déclaration URSSAF mensuelle" },
  { value: "declaration-annuelle", label: "Déclaration annuelle / régularisation" },
  { value: "facturation", label: "Facturation conforme" },
  { value: "compta", label: "Suivi chiffre d'affaires / compta simple" },
  { value: "accompagnement", label: "Accompagnement global (plusieurs sujets)" },
];

export const urssafUrgency = [
  { value: "urgent", label: "Urgent (échéance proche)" },
  { value: "semaine", label: "Cette semaine" },
  { value: "mois", label: "Ce mois-ci" },
  { value: "exploratoire", label: "Pas urgent — je me renseigne" },
];
