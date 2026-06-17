export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  price: string;
  deviceType: string;
}

export interface PricingItem {
  id: string;
  label: string;
  price: string;
  description: string;
  features: string[];
  note?: string;
}

export interface MaintenancePlan {
  id: string;
  name: string;
  monthlyPrice: string;
  includedVisits: number;
  discountPercent: number;
  responseSLAHours: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const business = {
  name: "VoisinTech",
  slogan: "Votre voisin de confiance pour le numérique",
  phone: "05 82 95 06 42",
  phoneRaw: "0582950642",
  email: "voisintech3@gmail.com",
  website: "https://www.voisintech.fr",
  city: "Toulouse",
  serviceRadius: "15 à 30 km",
  siret: "XXX XXX XXX XXXXX",
  address: "Toulouse et agglomération",
  googleReviewUrl: "https://g.page/r/voisintech/review",
};

export const services = [
  {
    id: "depannage",
    title: "Dépannage PC & Mac",
    shortDescription:
      "Ordinateur lent, écran noir, messages d'erreur ? Je diagnostique et répare chez vous.",
    description:
      "Votre ordinateur ne démarre plus, rame ou affiche des messages incompréhensibles ? Je viens chez vous, j'explique le problème en français simple, et je le règle sur place. Pas de jargon, pas de surprise.",
    icon: "Monitor",
    price: "50€/h (40€/h tarif senior)",
    deviceType: "PC Windows",
  },
  {
    id: "smartphone",
    title: "Smartphones & tablettes",
    shortDescription:
      "Configuration, transfert de données, applications, photos — je vous accompagne pas à pas.",
    description:
      "Nouveau téléphone, applications qui ne marchent pas, photos perdues ou stockage plein ? Je configure votre appareil et je vous montre comment l'utiliser en toute confiance.",
    icon: "Smartphone",
    price: "Forfait config : 50€",
    deviceType: "Smartphone",
  },
  {
    id: "wifi",
    title: "Wi-Fi & réseau",
    shortDescription:
      "Connexion instable, zones sans signal, box mal configurée ? Je remets tout en ordre.",
    description:
      "Internet qui coupe, Wi-Fi faible dans certaines pièces, nouvel équipement à installer ? J'optimise votre réseau pour que toute la famille soit connectée sans prise de tête.",
    icon: "Wifi",
    price: "50€/h",
    deviceType: "Box internet / Wi-Fi",
  },
  {
    id: "securite",
    title: "Sécurité & virus",
    shortDescription:
      "Virus, arnaques, mots de passe — je sécurise vos appareils et vous apprends à vous protéger.",
    description:
      "Pop-ups suspects, ordinateur qui se comporte bizarrement, peur des arnaques en ligne ? Je nettoie, sécurise et vous donne les bons réflexes pour naviguer sereinement.",
    icon: "Shield",
    price: "Pack sécurité : 60€",
    deviceType: "PC Windows",
  },
  {
    id: "demarches",
    title: "Démarches en ligne",
    shortDescription:
      "CAF, impôts, Ameli, France Identité — je vous aide à faire vos démarches administratives.",
    description:
      "Vous bloquez sur un site administratif ou une application officielle ? Je vous accompagne pour créer vos comptes, remplir vos formulaires et envoyer vos documents en toute sécurité.",
    icon: "FileText",
    price: "50€/h",
    deviceType: "PC Windows",
  },
  {
    id: "formation",
    title: "Formation à domicile",
    shortDescription:
      "Apprenez à votre rythme : mail, photos, visio, banque en ligne, avec patience et bienveillance.",
    description:
      "Vous voulez gagner en autonomie sur internet, vos emails ou vos photos ? Je vous forme chez vous, à votre rythme, avec des explications claires et beaucoup de patience.",
    icon: "GraduationCap",
    price: "40€/h",
    deviceType: "Autre",
  },
];

export const pricing = {
  seniorHighlight: {
    title: "Tarif senior — 65 ans et plus",
    price: "40 €/h",
    standardPrice: "50 €/h",
    description:
      "Tarif préférentiel sur le dépannage à domicile. Pas de paperasse compliquée — on vous fait confiance.",
  },
  hourly: [
    {
      id: "depannage",
      label: "Dépannage à domicile",
      price: "50 €/h",
      note: "40 €/h tarif senior",
      description: "PC, Mac, imprimante, box internet — chez vous.",
      features: [
        "Devis gratuit avant réparation",
        "Explications en français simple",
        "Garantie 30 jours",
      ],
    },
    {
      id: "formation",
      label: "Formation à domicile",
      price: "40 €/h",
      description: "Mail, photos, visio, banque en ligne — à votre rythme.",
      features: [
        "Patience et reformulations",
        "Fiches récap à emporter",
        "Pas de limite de questions",
      ],
    },
    {
      id: "distance",
      label: "Assistance à distance",
      price: "35 €/h",
      description: "Prise en main par téléphone ou visio, sans déplacement.",
      features: [
        "Idéal pour les petits soucis",
        "Connexion sécurisée",
        "Même tarif clair qu'à domicile",
      ],
    },
  ] satisfies PricingItem[],
  packages: [
    {
      id: "diagnostic",
      label: "Diagnostic complet",
      price: "30 €",
      description: "Identification du problème + devis détaillé.",
      features: ["Sur place ou à distance", "Sans engagement", "Devis remis sur-le-champ"],
    },
    {
      id: "remise",
      label: "Remise en état",
      price: "80 €",
      description: "Nettoyage, optimisation et mises à jour.",
      features: ["PC plus rapide", "Logiciels à jour", "Conseils personnalisés"],
    },
    {
      id: "smartphone",
      label: "Configuration smartphone",
      price: "50 €",
      description: "Transfert de données et applications essentielles.",
      features: ["Contacts et photos sauvés", "Apps installées", "Mode d'emploi oral"],
    },
    {
      id: "securite",
      label: "Pack sécurité",
      price: "60 €",
      description: "Antivirus, sauvegarde et bons réflexes.",
      features: ["Protection installée", "Sauvegarde configurée", "Arnaques expliquées"],
    },
  ] satisfies PricingItem[],
  note: "Déplacement gratuit jusqu'à 15 km autour de Toulouse",
};

export const maintenancePlans: MaintenancePlan[] = [
  {
    id: "bronze",
    name: "Bronze",
    monthlyPrice: "9 €",
    includedVisits: 1,
    discountPercent: 10,
    responseSLAHours: 72,
    description: "L'essentiel pour être tranquille toute l'année.",
    features: [
      "1 visite à domicile incluse par an",
      "Dépannage prioritaire sous 72 h",
      "−10 % sur les interventions hors forfait",
      "Ligne directe en cas de blocage",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    monthlyPrice: "19 €",
    includedVisits: 2,
    discountPercent: 15,
    responseSLAHours: 48,
    description: "Le meilleur équilibre pour un suivi régulier.",
    features: [
      "2 visites à domicile incluses par an",
      "Dépannage prioritaire sous 48 h",
      "−15 % sur les interventions hors forfait",
      "Rappels de sauvegarde et mises à jour",
    ],
    highlighted: true,
    badge: "Le plus choisi",
  },
  {
    id: "gold",
    name: "Gold",
    monthlyPrice: "29 €",
    includedVisits: 4,
    discountPercent: 20,
    responseSLAHours: 24,
    description: "Sérénité maximale — priorité absolue.",
    features: [
      "4 visites à domicile incluses par an",
      "Dépannage prioritaire sous 24 h",
      "−20 % sur les interventions hors forfait",
      "Suivi personnalisé de vos appareils",
    ],
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Vous appelez ou remplissez le formulaire",
    description:
      "Décrivez votre problème par téléphone ou via notre formulaire simple. Réponse sous 2 heures en journée.",
  },
  {
    step: 2,
    title: "Je viens chez vous avec un diagnostic",
    description:
      "Rendez-vous à domicile à l'heure qui vous convient. Devis gratuit avant toute intervention.",
  },
  {
    step: 3,
    title: "Je répare et j'explique",
    description:
      "Intervention sur place, explications en français simple. Vous repartez avec un appareil qui fonctionne.",
  },
];

export const trustBadges = [
  { title: "Devis gratuit", description: "Avant chaque intervention" },
  { title: "RC Pro assurée", description: "Intervention en toute sécurité" },
  { title: "Tarif senior", description: "40€/h pour les 65 ans et plus" },
  { title: "Sans jargon", description: "On parle français, pas informatique" },
];

export const testimonials = [
  {
    name: "Marie-Claire D.",
    age: "72 ans",
    rating: 5,
    text: "Mon ordinateur ne voulait plus démarrer. Il est venu le jour même, m'a tout expliqué calmement, et maintenant je sais même faire mes mises à jour moi-même !",
  },
  {
    name: "Philippe R.",
    age: "Toulouse",
    rating: 5,
    text: "Configuration de mon nouveau smartphone en une heure. Patience incroyable, aucune question bête. Je recommande à tous mes amis seniors.",
  },
  {
    name: "Sophie M.",
    age: "Balma",
    rating: 5,
    text: "Wi-Fi qui ne marchait dans aucune chambre. Problème réglé en 45 minutes. Tarif clair, pas de mauvaise surprise. Un vrai voisin de confiance.",
  },
  {
    name: "Jean-Pierre L.",
    age: "68 ans",
    rating: 5,
    text: "Il m'a aidé pour mes démarches CAF et Ameli en ligne. J'avais peur de me tromper, il m'a guidé pas à pas. Merci !",
  },
];

export const homeFaq = [
  {
    question: "Qui est VoisinTech ?",
    answer:
      "VoisinTech (voisintech.fr) est un service de dépannage informatique à domicile à Toulouse, spécialisé dans l'accompagnement des seniors et des familles. Intervention patiente, tarifs transparents, devis gratuit.",
  },
  {
    question: "Comment trouver un dépannage informatique à Toulouse ?",
    answer:
      "Appelez le 05 82 95 06 42, demandez un devis sur voisintech.fr/devis ou consultez voisintech.fr/villes/toulouse.",
  },
  {
    question: "VoisinTech intervient-il dans mon quartier ?",
    answer:
      "Oui, à Toulouse et en agglomération : Minimes, Saint-Cyprien, Côte Pavée, Saint-Michel, Blagnac, Colomiers, Tournefeuille, Balma, L'Union…",
  },
  {
    question: "Quel est le tarif d'un dépannage informatique ?",
    answer:
      "50 €/h à domicile (40 €/h tarif senior 65+). Diagnostic 30 €. Devis toujours gratuit avant réparation. Contrats maintenance dès 9 €/mois.",
  },
];

export const faq = [
  {
    question: "Quelle est votre zone d'intervention ?",
    answer:
      "J'interviens à Toulouse et dans un rayon de 15 à 30 km (Blagnac, Colomiers, Tournefeuille, Balma, L'Union, etc.). Le déplacement est gratuit jusqu'à 15 km.",
  },
  {
    question: "Quel est le délai de réponse ?",
    answer:
      "Je réponds à toutes les demandes dans les 2 heures en journée (du lundi au samedi). Pour les urgences, appelez directement au 05 82 95 06 42.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Espèces, chèque et virement bancaire. Un reçu vous est remis après chaque intervention.",
  },
  {
    question: "Y a-t-il une garantie sur les interventions ?",
    answer:
      "Oui, toutes les réparations sont garanties 30 jours. Si le même problème revient, je reviens gratuitement.",
  },
  {
    question: "Proposez-vous un tarif pour les seniors ?",
    answer:
      "Oui ! Les personnes de 65 ans et plus bénéficient d'un tarif préférentiel à 40 €/h au lieu de 50 €/h pour le dépannage à domicile.",
  },
  {
    question: "Proposez-vous des contrats de maintenance ?",
    answer:
      "Oui — formules Bronze (9 €/mois), Silver (19 €/mois) et Gold (29 €/mois). Visites à domicile incluses, dépannage prioritaire et réductions sur les interventions. Sans engagement longue durée.",
  },
  {
    question: "Puis-je avoir un devis avant l'intervention ?",
    answer:
      "Absolument. Le diagnostic est à 30€ et le devis est toujours gratuit et sans engagement avant toute réparation.",
  },
];

export const about = {
  story: `Bonjour, je suis votre technicien VoisinTech à Toulouse — le service voisintech.fr de dépannage informatique à domicile.

Après des années à aider famille, voisins et amis avec leurs problèmes d'informatique, j'ai créé VoisinTech pour offrir ce même service de proximité à tous ceux qui se sentent dépassés par le numérique.

Je sais que derrière chaque écran qui ne répond plus, il y a souvent de la frustration — parfois de l'inquiétude. Mon rôle, c'est de transformer ça en soulagement : je répare, j'explique, et je vous laisse plus autonome qu'avant.

Pas de jargon technique, pas de facture surprise. Juste un voisin de confiance qui vient chez vous, prend le temps, et fait le travail.`,
  values: [
    {
      title: "Patience",
      description:
        "Chaque personne avance à son rythme. Je répète, je reformule, je m'adapte — sans jamais vous faire sentir ridicule.",
    },
    {
      title: "Transparence",
      description:
        "Devis gratuit, tarifs affichés, explications claires avant chaque intervention. Vous savez toujours où vous allez.",
    },
    {
      title: "Proximité",
      description:
        "Un vrai service de voisinage : je viens chez vous, je connais le quartier, et je suis joignable facilement.",
    },
  ],
};

export const deviceTypes = [
  "PC Windows",
  "Mac",
  "Smartphone",
  "Tablette",
  "Imprimante",
  "Box internet / Wi-Fi",
  "Autre",
];

export const timeSlots = [
  { value: "matin", label: "Matin (8h-12h)" },
  { value: "apres-midi", label: "Après-midi (12h-18h)" },
  { value: "soir", label: "Soir (18h-20h)" },
];

export const weekDays = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" },
];
