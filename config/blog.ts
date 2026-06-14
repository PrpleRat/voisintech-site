export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "pc-lent-que-faire",
    title: "Mon PC est lent : que faire avant d'appeler un technicien ?",
    excerpt:
      "5 gestes simples pour accélérer un ordinateur qui rame — et quand faire appel à un professionnel.",
    date: "2026-06-01",
    readTime: "4 min",
    content: [
      "Un ordinateur lent, c'est souvent frustrant — mais pas toujours grave. Avant de paniquer, voici ce que vous pouvez essayer vous-même.",
      "**1. Redémarrez votre ordinateur** — Oui, vraiment. Un simple redémarrage règle beaucoup de problèmes temporaires.",
      "**2. Fermez les onglets inutiles** — Chaque onglet de navigateur consomme de la mémoire. Gardez seulement ce dont vous avez besoin.",
      "**3. Vérifiez l'espace disque** — Si votre disque est plein à plus de 90 %, l'ordinateur ralentit. Supprimez les fichiers inutiles ou la corbeille.",
      "**4. Mettez à jour Windows ou macOS** — Les mises à jour corrigent souvent des bugs de performance.",
      "**5. Quand appeler un technicien ?** — Si le PC met plus de 5 minutes à démarrer, affiche des messages d'erreur, ou si vous suspectez un virus, un professionnel à domicile peut diagnostiquer en 30 minutes.",
      "Chez VoisinTech à Toulouse, le diagnostic est à 30€ et le devis est gratuit. Appelez le 05 82 95 06 42 ou demandez un devis en ligne.",
    ],
  },
  {
    slug: "eviter-arnaques-sms",
    title: "Arnaques par SMS et email : les 7 signes qui doivent vous alerter",
    excerpt:
      "Comment repérer une arnaque avant de cliquer — guide simple pour seniors et familles.",
    date: "2026-06-03",
    readTime: "5 min",
    content: [
      "Les arnaques en ligne ciblent tout le monde, mais particulièrement les seniors. Voici les signes infaillibles.",
      "**Urgence artificielle** — « Votre compte sera bloqué dans 24h » : les vraies administrations ne fonctionnent pas ainsi.",
      "**Fautes d'orthographe** — Les emails officiels sont relus. Les arnaques contiennent souvent des erreurs.",
      "**Liens suspects** — Survolez le lien sans cliquer : si l'adresse ne correspond pas au site officiel (impots.gouv.fr, ameli.fr…), c'est une arnaque.",
      "**Demande de paiement inhabituelle** — Carte cadeau, crypto, virement urgent : jamais pour une administration.",
      "**Pièces jointes inattendues** — Ne jamais ouvrir un fichier .zip ou .exe reçu par email sans l'avoir demandé.",
      "**On vous demande vos mots de passe** — Aucun service légitime ne demande votre mot de passe par téléphone ou SMS.",
      "**En cas de doute** — Appelez directement le numéro officiel (pas celui du message). VoisinTech peut aussi vérifier un message suspect lors d'une intervention à domicile.",
    ],
  },
  {
    slug: "wifi-qui-coupe",
    title: "Wi-Fi qui coupe ou ne passe pas dans certaines pièces",
    excerpt:
      "Pourquoi votre Wi-Fi est faible et les solutions simples pour une maison bien connectée.",
    date: "2026-06-05",
    readTime: "4 min",
    content: [
      "Votre box internet fonctionne, mais le Wi-Fi est capricieux ? C'est l'un des problèmes les plus fréquents à domicile.",
      "**La box est mal placée** — Idéalement au centre de la maison, en hauteur, loin des murs épais et de l'éléctroménager.",
      "**Trop d'appareils connectés** — Box vieillissante + 15 appareils = ralentissements. Un technicien peut optimiser les paramètres.",
      "**Le répéteur Wi-Fi** — Un bon répéteur ou un maillage Wi-Fi (mesh) peut couvrir toute la maison. Attention aux modèles bas de gamme qui divisent la bande passante.",
      "**Le canal Wi-Fi saturé** — En immeuble, les voisins utilisent les mêmes canaux. Un réglage technique améliore souvent la situation.",
      "VoisinTech intervient à Toulouse et environs pour diagnostiquer et optimiser votre réseau à domicile. Devis gratuit sur voisintech.fr.",
    ],
  },
  {
    slug: "aide-seniors-numerique",
    title: "Aide informatique pour seniors : comment bien choisir son technicien",
    excerpt:
      "Patience, tarifs clairs, à domicile : les critères essentiels pour un accompagnement serein.",
    date: "2026-06-08",
    readTime: "3 min",
    content: [
      "Choisir un technicien informatique quand on n'est pas à l'aise avec le numérique, c'est stressant. Voici comment choisir sereinement.",
      "**À domicile de préférence** — Vous restez dans votre environnement, avec votre matériel. C'est plus rassurant.",
      "**Patience et pédagogie** — Le technicien doit expliquer sans jargon et sans vous faire sentir ridicule.",
      "**Devis avant intervention** — Exigez un tarif clair avant qu'il ne touche à quoi que ce soit.",
      "**Tarif senior** — Certaines structures proposent un tarif réduit pour les 65 ans et plus (40€/h chez VoisinTech).",
      "**RC Pro** — Vérifiez que le technicien est assuré pour intervenir chez vous.",
      "VoisinTech a été créé pour ce public : proximité, patience, transparence. Appelez le 05 82 95 06 42.",
    ],
  },
  {
    slug: "demarches-en-ligne-aide",
    title: "CAF, impôts, Ameli : se faire aider pour ses démarches en ligne",
    excerpt:
      "France Identité, comptes administratifs, documents à téléverser — un accompagnement à domicile rassurant.",
    date: "2026-06-10",
    readTime: "4 min",
    content: [
      "Les démarches en ligne sont obligatoires, mais pas toujours simples. Un accompagnement à domicile peut faire la différence.",
      "**Création de comptes** — FranceConnect, Ameli, impots.gouv.fr : un technicien vous guide pas à pas sans prendre vos identifiants.",
      "**Téléversement de documents** — Scanner ou photographier un document, l'envoyer au bon format : des gestes simples une fois montrés.",
      "**France Identité** — L'application peut bloquer. Un accompagnement sur place évite les erreurs et les blocages.",
      "**Sécurité** — Ne communiquez jamais vos mots de passe. Le technicien vous montre, vous tapez.",
      "VoisinTech propose l'aide aux démarches en ligne à Toulouse et agglomération, à 50€/h. Réservez via le formulaire de devis.",
    ],
  },
  {
    slug: "depannage-informatique-toulouse-tarifs",
    title: "Dépannage informatique à Toulouse : tarifs, délais et zone d'intervention",
    excerpt:
      "Combien coûte un dépannage PC à domicile à Toulouse ? Délais, tarif senior, déplacement gratuit — tout est transparent.",
    date: "2026-06-12",
    readTime: "5 min",
    content: [
      "Vous cherchez un **dépannage informatique à Toulouse** avec des tarifs clairs ? Voici ce que propose VoisinTech (voisintech.fr), technicien à domicile sur la métropole toulousaine.",
      "**Tarif horaire** — 50€/h à domicile pour le dépannage PC, Mac, smartphone ou Wi-Fi. **40€/h tarif senior** pour les personnes de 65 ans et plus.",
      "**Forfaits courants** — Diagnostic 30€, remise en état 80€, configuration smartphone 50€, pack sécurité 60€. Le **devis est toujours gratuit** avant réparation.",
      "**Déplacement** — Gratuit jusqu'à 15 km autour de Toulouse (Blagnac, Colomiers, Tournefeuille, Balma, L'Union…). Au-delà, petit supplément annoncé à l'avance.",
      "**Délais** — Réponse sous 2 heures en journée (lundi-samedi). Intervention souvent le jour même ou le lendemain. Urgence : appelez le **05 82 95 06 42**.",
      "**Garantie** — Toutes les réparations sont garanties 30 jours. Si le même problème revient, je reviens gratuitement.",
      "Besoin d'une estimation ? Demandez un devis gratuit sur voisintech.fr/devis ou consultez la page dépannage informatique Toulouse sur voisintech.fr/villes/toulouse.",
    ],
  },
  {
    slug: "reparation-pc-domicile-toulouse",
    title: "Réparation PC à domicile à Toulouse : quand faire appeler un technicien ?",
    excerpt:
      "PC lent, écran noir, virus, Wi-Fi : les signes qu'il faut un pro — et pourquoi le domicile est plus pratique qu'un magasin.",
    date: "2026-06-13",
    readTime: "4 min",
    content: [
      "Votre ordinateur ne démarre plus, rame ou affiche des messages incompréhensibles ? Voici quand appeler un **technicien informatique à domicile à Toulouse** plutôt que d'essayer seul.",
      "**Appelez si…** — Le PC met plus de 5 minutes à démarrer, l'écran reste noir, des pop-ups reviennent sans cesse, ou vous suspectez un virus. Un diagnostic sur place prend souvent 30 à 45 minutes.",
      "**Pourquoi à domicile ?** — Pas de transport, pas de file d'attente. Le technicien voit votre box, votre imprimante, votre environnement réel. Idéal pour les seniors ou si vous n'êtes pas mobile.",
      "**Ce qu'on répare** — Lenteur Windows/Mac, virus et malwares, Wi-Fi instable, écran noir, mises à jour bloquées, sauvegarde de données, configuration imprimante.",
      "**Transparence** — VoisinTech explique chaque étape en français simple, sans jargon. Devis gratuit avant intervention, reçu remis sur place.",
      "VoisinTech intervient à Toulouse et environs. Demandez un devis sur voisintech.fr/devis ou appelez le 05 82 95 06 42.",
    ],
  },
  {
    slug: "aide-informatique-seniors-toulouse",
    title: "Aide informatique seniors à Toulouse : accompagnement patient à domicile",
    excerpt:
      "Smartphone, tablette, arnaques, démarches en ligne : un technicien patient qui vient chez vous à Toulouse.",
    date: "2026-06-14",
    readTime: "4 min",
    content: [
      "Le numérique peut intimider — surtout quand on n'a personne pour expliquer calmement. **VoisinTech** propose une **aide informatique pour seniors à Toulouse**, à domicile, avec patience et sans jargon.",
      "**Smartphone et tablette** — Configuration, transfert de photos, applications utiles (météo, banque, Ameli), visio avec les petits-enfants. On répète autant que nécessaire.",
      "**Ordinateur** — Mails, navigation internet, mises à jour, impression. Vous gardez le contrôle : le technicien montre, vous validez.",
      "**Arnaques et sécurité** — Reconnaître un faux SMS, un email suspect, sécuriser ses mots de passe. Des réflexes simples pour naviguer sereinement.",
      "**Tarif senior** — **40€/h** au lieu de 50€/h pour les 65 ans et plus. Formation et dépannage au même tarif préférentiel.",
      "Zone : Toulouse, Blagnac, Colomiers, Tournefeuille, Balma, L'Union. Contactez VoisinTech sur voisintech.fr/contact ou demandez un devis gratuit sur voisintech.fr/devis.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return blogArticles.find((a) => a.slug === slug);
}
