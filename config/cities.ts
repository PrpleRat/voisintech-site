import type { RegionId } from "@/config/regions";

export interface CityPage {
  slug: string;
  name: string;
  region: RegionId;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
}

export const cities: CityPage[] = [
  {
    slug: "toulouse",
    name: "Toulouse",
    region: "toulouse",
    metaTitle: "Dépannage informatique à domicile Toulouse",
    metaDescription:
      "VoisinTech intervient à Toulouse pour dépannage PC, Mac, smartphone et Wi-Fi à domicile. Devis gratuit, tarif senior 40€/h.",
    intro:
      "À Toulouse, je me déplace chez vous pour résoudre vos problèmes informatiques — lenteur, virus, Wi-Fi, démarches en ligne — avec patience et sans jargon.",
    highlights: [
      "Intervention rapide dans tous les quartiers",
      "Déplacement gratuit jusqu'à 15 km",
      "Spécialiste accompagnement seniors",
    ],
  },
  {
    slug: "blagnac",
    name: "Blagnac",
    region: "toulouse",
    metaTitle: "Dépannage informatique Blagnac à domicile",
    metaDescription:
      "Technicien informatique à Blagnac : réparation PC, configuration smartphone, aide numérique seniors. VoisinTech.",
    intro:
      "Habitants de Blagnac, je viens à domicile pour dépanner vos ordinateurs, téléphones et box internet. Un service de proximité, comme un voisin de confiance.",
    highlights: ["Proche de Toulouse — intervention rapide", "Tarifs transparents", "Devis gratuit"],
  },
  {
    slug: "colomiers",
    name: "Colomiers",
    region: "toulouse",
    metaTitle: "Dépannage informatique Colomiers",
    metaDescription:
      "Dépannage informatique à Colomiers : PC lent, virus, Wi-Fi, formation seniors. Intervention à domicile VoisinTech.",
    intro:
      "À Colomiers, je propose un dépannage informatique humain à domicile : diagnostic clair, réparation sur place, explications simples.",
    highlights: ["Zone couverte sans supplément proche", "RDV flexibles", "Paiement chèque ou espèces"],
  },
  {
    slug: "tournefeuille",
    name: "Tournefeuille",
    region: "toulouse",
    metaTitle: "Dépannage informatique Tournefeuille",
    metaDescription:
      "VoisinTech à Tournefeuille : aide informatique seniors, réparation ordinateur et smartphone à domicile.",
    intro:
      "À Tournefeuille, je vous aide à retrouver un ordinateur ou un téléphone qui fonctionne — et à comprendre ce qui a été fait.",
    highlights: ["Service patient pour seniors", "Assistance démarches en ligne", "Garantie 30 jours"],
  },
  {
    slug: "balma",
    name: "Balma",
    region: "toulouse",
    metaTitle: "Dépannage informatique Balma à domicile",
    metaDescription:
      "Technicien VoisinTech à Balma : dépannage PC/Mac, Wi-Fi, formation numérique à domicile.",
    intro:
      "À Balma, j'interviens à domicile pour tous vos soucis numériques : panne, lenteur, configuration ou formation.",
    highlights: ["Interventions en journée et soirée", "Sans abonnement", "RC Pro assurée"],
  },
  {
    slug: "l-union",
    name: "L'Union",
    region: "toulouse",
    metaTitle: "Dépannage informatique L'Union",
    metaDescription:
      "Dépannage informatique à L'Union : VoisinTech, technicien à domicile pour seniors et familles.",
    intro:
      "À L'Union, profitez d'un dépannage informatique de proximité : je viens chez vous, je répare et j'explique.",
    highlights: ["Réponse sous 2h en journée", "Tarif senior 40€/h", "Devis avant intervention"],
  },
  {
    slug: "lourdes",
    name: "Lourdes",
    region: "lourdes",
    metaTitle: "Dépannage informatique à domicile Lourdes",
    metaDescription:
      "VoisinTech à Lourdes : dépannage PC, smartphone, Wi-Fi et aide numérique seniors à domicile. Devis gratuit.",
    intro:
      "À Lourdes, je me déplace chez vous pour dépanner ordinateurs, téléphones et box internet — avec patience et sans jargon technique.",
    highlights: [
      "Intervention à domicile dans tout Lourdes",
      "Spécialiste accompagnement seniors",
      "Devis gratuit avant intervention",
    ],
  },
  {
    slug: "tarbes",
    name: "Tarbes",
    region: "lourdes",
    metaTitle: "Dépannage informatique Tarbes à domicile",
    metaDescription:
      "Technicien informatique à Tarbes : réparation PC, configuration smartphone, aide aux démarches en ligne. VoisinTech.",
    intro:
      "À Tarbes, je viens à domicile pour résoudre vos problèmes informatiques et vous accompagner dans vos démarches numériques.",
    highlights: ["Proche de Lourdes — interventions rapides", "Tarifs transparents", "Tarif senior 40€/h"],
  },
  {
    slug: "argeles-gazost",
    name: "Argelès-Gazost",
    region: "lourdes",
    metaTitle: "Dépannage informatique Argelès-Gazost",
    metaDescription:
      "VoisinTech à Argelès-Gazost : dépannage informatique à domicile, Wi-Fi, formation seniors.",
    intro:
      "À Argelès-Gazost et dans la vallée, je dépanne vos appareils à domicile et vous explique chaque étape clairement.",
    highlights: ["Service de proximité en vallée", "RDV flexibles", "Garantie 30 jours"],
  },
  {
    slug: "jarret",
    name: "Jarret",
    region: "lourdes",
    metaTitle: "Dépannage informatique Jarret",
    metaDescription:
      "Dépannage informatique à Jarret et environs : VoisinTech, technicien à domicile patient et de confiance.",
    intro:
      "À Jarret et dans les villages alentour, je propose un dépannage informatique humain — comme un voisin qui s'y connaît en numérique.",
    highlights: ["Idéal pour les petits villages", "Déplacement inclus selon zone", "Sans jargon"],
  },
  {
    slug: "bagneres-de-bigorre",
    name: "Bagnères-de-Bigorre",
    region: "lourdes",
    metaTitle: "Dépannage informatique Bagnères-de-Bigorre",
    metaDescription:
      "VoisinTech à Bagnères-de-Bigorre : aide informatique seniors, réparation ordinateur et smartphone.",
    intro:
      "À Bagnères-de-Bigorre, j'interviens à domicile pour PC lent, virus, Wi-Fi ou formation numérique personnalisée.",
    highlights: ["Interventions seniors bienveillantes", "Devis gratuit", "RC Pro assurée"],
  },
  {
    slug: "pierrefitte-nestalas",
    name: "Pierrefitte-Nestalas",
    region: "lourdes",
    metaTitle: "Dépannage informatique Pierrefitte-Nestalas",
    metaDescription:
      "Dépannage informatique à Pierrefitte-Nestalas : VoisinTech, service à domicile dans la vallée.",
    intro:
      "À Pierrefitte-Nestalas, je vous aide à retrouver un ordinateur ou un téléphone qui fonctionne — simplement et sereinement.",
    highlights: ["Zone vallée couverte", "Réponse rapide", "Paiement chèque ou espèces"],
  },
];

export function getCityBySlug(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function getCitiesByRegion(region: RegionId) {
  return cities.filter((c) => c.region === region);
}
