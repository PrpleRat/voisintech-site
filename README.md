# VoisinTech — Site Web

Site vitrine et formulaire de devis pour **VoisinTech**, dépannage informatique à domicile à Toulouse.

## Fonctionnalités

- Page d'accueil avec services, témoignages et zone d'intervention
- Page services avec grille tarifaire complète
- Formulaire de devis multi-étapes (senior-friendly)
- Formulaire de contact avec FAQ
- Page avis clients avec soumission et modération
- Tableau de bord admin (devis, messages, avis)
- Emails automatiques via Resend
- Base de données SQLite via Prisma

## Prérequis

- [Node.js](https://nodejs.org/) version 18 ou plus
- Un compte [Resend](https://resend.com) (gratuit) pour les emails

## Installation locale

### 1. Installer les dépendances

```bash
cd voisintech-site
npm install
```

### 2. Configurer les variables d'environnement

Copiez le fichier d'exemple :

```bash
copy .env.example .env
```

Puis éditez `.env` :

```
DATABASE_URL="file:./dev.db"
RESEND_API_KEY=re_votre_cle_ici
NOTIFICATION_EMAIL=voisintech3@gmail.com
FROM_EMAIL=onboarding@resend.dev
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

### 3. Configurer Resend (emails)

1. Créez un compte gratuit sur [resend.com](https://resend.com)
2. Allez dans **API Keys** → **Create API Key**
3. Copiez la clé dans `RESEND_API_KEY` dans votre `.env`
4. En développement, utilisez `onboarding@resend.dev` comme `FROM_EMAIL`
5. Pour la production, ajoutez et vérifiez votre domaine dans Resend

> Sans clé Resend, le site fonctionne quand même — les formulaires enregistrent les données en base, mais les emails ne sont pas envoyés.

### 4. Initialiser la base de données

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Lancer le site

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Modifier le contenu (sans toucher au code)

Tout le contenu éditable est dans **`config/content.ts`** :

- Nom, téléphone, email, slogan
- Liste des services et descriptions
- Tarifs et forfaits
- Témoignages par défaut
- FAQ
- Texte « À propos »
- URL avis Google

Modifiez ce fichier, sauvegardez, et le site se met à jour automatiquement.

## Administration

- URL : [http://localhost:3000/admin](http://localhost:3000/admin)
- Mot de passe : celui défini dans `ADMIN_PASSWORD` (`.env`)

Le tableau de bord permet de :
- Voir et gérer les demandes de devis
- Lire les messages de contact
- Approuver ou rejeter les avis clients

## Mise en ligne sur voisintech.fr (guide complet)

### Étape 1 — Acheter le domaine

Registrars recommandés pour un `.fr` :
- [OVH](https://www.ovh.com/fr/domaines/) — le plus courant en France (~7€/an)
- [Gandi](https://www.gandi.net/fr) — simple, propre
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) — au prix coûtant

Cherchez **voisintech.fr**, achetez-le. Gardez l'accès au **panneau DNS** (zone DNS du domaine).

### Étape 2 — Déployer sur Vercel

1. Compte sur [vercel.com](https://vercel.com) (connexion GitHub)
2. Poussez le code sur GitHub (depuis `voisintech-site/`) :
   ```bash
   git add .
   git commit -m "Site VoisinTech"
   git push
   ```
3. Vercel → **Add New Project** → sélectionnez le repo
4. Si le repo est `BOS-main`, mettez **Root Directory** : `voisintech-site`
5. **Environment Variables** (Production) :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Voir note base de données ci-dessous |
| `RESEND_API_KEY` | Votre clé Resend |
| `NOTIFICATION_EMAIL` | voisintech3@gmail.com |
| `FROM_EMAIL` | `contact@voisintech.fr` (après vérif domaine) |
| `ADMIN_PASSWORD` | Mot de passe fort (pas `changeme123`) |

6. Cliquez **Deploy**

### Étape 3 — Connecter voisintech.fr à Vercel

1. Vercel → projet → **Settings → Domains**
2. Ajoutez `voisintech.fr` et `www.voisintech.fr`
3. Vercel affiche les enregistrements DNS à créer. Dans le panneau de votre registrar :

| Type | Nom | Valeur |
|------|-----|--------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

*(Les valeurs exactes sont affichées par Vercel — utilisez celles-là.)*

4. Attendez 5 min à 48h (souvent < 1h). Le site sera live sur **https://voisintech.fr**

### Étape 4 — Configurer Resend avec voisintech.fr (obligatoire pour les emails)

Tant que le domaine n'est pas vérifié, Resend n'envoie qu'à l'email du compte (jouet.enzo@gmail.com). Les notifications vers voisintech3@gmail.com sont bloquées.

1. [resend.com/domains](https://resend.com/domains) → **Add Domain** → `voisintech.fr`
2. Resend donne des enregistrements DNS (SPF, DKIM). Ajoutez-les dans le panneau DNS du domaine
3. Une fois vérifié (statut vert), mettez à jour :
   - Vercel : `FROM_EMAIL=contact@voisintech.fr`
   - Redéployez (ou attendez le prochain deploy)

Les emails partiront alors de `@voisintech.fr` vers **n'importe quelle adresse** (voisintech3@gmail.com inclus).

### Étape 5 — Base de données en production

SQLite ne persiste pas sur Vercel (fichier effacé à chaque redéploiement). Options :

- **[Turso](https://turso.tech)** — gratuit, SQLite compatible, 5 min de setup (recommandé)
- **Vercel Postgres** — payant après quota gratuit

Sans base persistante, les formulaires marchent mais les données admin disparaissent au redéploiement.

### Étape 6 — Checklist finale

- [ ] Site accessible sur https://voisintech.fr
- [ ] Formulaire de devis testé en prod
- [ ] Email reçu sur voisintech3@gmail.com (notification)
- [ ] Email de confirmation reçu par le client test
- [ ] Admin `/admin` accessible avec mot de passe fort
- [ ] SIRET réel dans `config/content.ts` et mentions légales

## Déploiement sur Vercel (résumé)

### 1. Créer un compte Vercel

Allez sur [vercel.com](https://vercel.com) et créez un compte (connexion GitHub recommandée).

### 2. Pousser le code sur GitHub

```bash
git add .
git commit -m "Site VoisinTech"
git push
```

### 3. Importer le projet sur Vercel

1. Cliquez **Add New Project** sur Vercel
2. Sélectionnez votre dépôt GitHub
3. Framework : **Next.js** (détecté automatiquement)
4. Root Directory : `voisintech-site` (si le repo contient d'autres dossiers)

### 4. Ajouter les variables d'environnement

Dans **Settings → Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `file:./prod.db` |
| `RESEND_API_KEY` | Votre clé Resend |
| `NOTIFICATION_EMAIL` | voisintech3@gmail.com |
| `FROM_EMAIL` | Votre email vérifié Resend |
| `ADMIN_PASSWORD` | Mot de passe admin fort |

### 5. Déployer

Cliquez **Deploy**. Vercel construit et déploie automatiquement.

> **Note SQLite sur Vercel** : SQLite en fichier local ne persiste pas entre les redéploiements sur Vercel. Pour la production, migrez vers [Turso](https://turso.tech) ou [PlanetScale](https://planetscale.com) — ou utilisez [Vercel Postgres](https://vercel.com/storage/postgres). Pour un MVP/test, le site fonctionne mais les données peuvent être perdues au redéploiement.

### 6. Configurer un domaine personnalisé (optionnel)

Dans Vercel → **Settings → Domains**, ajoutez `voisintech.fr` (ou votre domaine) et suivez les instructions DNS.

## Structure du projet

```
voisintech-site/
├── app/                  # Pages Next.js (App Router)
├── components/           # Composants React
├── config/content.ts     # ★ Contenu éditable
├── lib/                  # Prisma, emails, auth
├── prisma/schema.prisma  # Schéma base de données
└── .env.example          # Variables d'environnement
```

## Accessibilité

- Police minimum 16px
- Zones cliquables 44×44px minimum
- Contraste WCAG AA
- Navigation clavier
- Support `prefers-reduced-motion`
- Labels et messages d'erreur en français clair

## Support

Pour toute question technique : voisintech3@gmail.com
