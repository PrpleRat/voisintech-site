export interface CityPage {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
}

export const cities: CityPage[] = [
  {
    slug: "toulouse",
    name: "Toulouse",
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
    metaTitle: "Dépannage informatique Balma à domicile",
    metaDescription:
      "Technicien VoisinTech à Balma : dépannage PC/Mac, Wi-Fi, formation numérique à domicile.",
    intro:
      "À Balma, je interviens à domicile pour tous vos soucis numériques : panne, lenteur, configuration ou formation.",
    highlights: ["Interventions en journée et soirée", "Sans abonnement", "RC Pro assurée"],
  },
  {
    slug: "l-union",
    name: "L'Union",
    metaTitle: "Dépannage informatique L'Union",
    metaDescription:
      "Dépannage informatique à L'Union : VoisinTech, technicien à domicile pour seniors et familles.",
    intro:
      "À L'Union, profitez d'un dépannage informatique de proximité : je viens chez vous, je répare et j'explique.",
    highlights: ["Réponse sous 2h en journée", "Tarif senior 40€/h", "Devis avant intervention"],
  },
];

export function getCityBySlug(slug: string) {
  return cities.find((c) => c.slug === slug);
}
