# Déménagement Lorgues

PWA familiale pour organiser votre déménagement vers Lorgues — synchronisée en temps réel entre tous vos appareils.

**Départ le 29 juillet — État des lieux le 30 juillet**

## Fonctionnalités

- Tableau de bord visuel avec progression globale
- 8 modules : Échéancier, Démarches, Cartons, Voitures, Documents, Contacts, Vérifications, Budget
- Espace familial partagé via code d'invitation
- Synchronisation Supabase Realtime entre appareils
- Cache local pour consultation hors ligne
- PWA installable sur ordinateur et téléphone
- Export JSON / CSV
- Modèle préchargé avec toutes les tâches du déménagement

## Installation locale

```bash
npm install
cp .env.example .env
# Renseignez vos clés Supabase dans .env
npm run dev
```

L'application sera disponible sur `http://localhost:5173`.

## Configuration Supabase

### 1. Créer un projet

1. Allez sur [supabase.com](https://supabase.com) et créez un projet
2. Notez l'**URL** et la clé **anon public**

### 2. Activer l'authentification anonyme

Dans le dashboard Supabase :

**Authentication → Providers → Anonymous Sign-Ins → Enable**

### 3. Exécuter les scripts SQL

Dans **SQL Editor**, exécutez dans cet ordre :

1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/functions.sql`

> Si `ALTER PUBLICATION supabase_realtime ADD TABLE` échoue (table déjà ajoutée), ignorez l'erreur ou activez Realtime manuellement dans **Database → Replication**.

### 4. Activer Realtime

Dans **Database → Replication**, activez Realtime pour :

- `items`
- `comments`
- `activity_log`

### 5. Configurer les variables d'environnement

Créez un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

Ne commitez jamais le fichier `.env`.

### 6. Générer les icônes PWA (optionnel)

```bash
npx pwa-asset-generator public/favicon.svg public/icons --icon-only --favicon
```

Ou placez manuellement `icon-192.png` et `icon-512.png` dans `public/icons/`.

## Déploiement

### GitHub Pages (recommandé)

L'app sera disponible sur : **https://clemP-App.github.io/demenagement-lorgues/**

#### 1. Activer GitHub Pages

Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**

#### 2. Ajouter les secrets Supabase

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valeur |
|--------|--------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé anon public Supabase |

#### 3. Déployer

À chaque push sur `main`, le workflow `.github/workflows/deploy.yml` build et déploie automatiquement.

Vous pouvez aussi lancer manuellement : **Actions → Deploy GitHub Pages → Run workflow**

#### 4. Supabase — URL autorisée (si besoin)

Dans Supabase **Authentication → URL Configuration**, ajoutez :

```
https://clemP-App.github.io/demenagement-lorgues/**
```

#### Build local (test)

```bash
# PowerShell
$env:GITHUB_PAGES="true"
npm run build:pages
cp dist/index.html dist/404.html   # Linux/Mac
# Puis servir le dossier dist/ avec un serveur local
```

### Vercel

```bash
npm run build
npx vercel
```

Ajoutez les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les paramètres du projet Vercel.

### Netlify

```bash
npm run build
```

- Build command : `npm run build`
- Publish directory : `dist`
- Ajoutez les variables d'environnement dans Netlify

Le fichier `netlify.toml` est inclus.

## Utilisation familiale

### Premier appareil (vous)

1. Ouvrez l'application
2. Cliquez **Créer mon espace déménagement**
3. Entrez votre prénom et le code d'invitation (ex : `LORGUES-2026`)
4. Allez dans **Paramètres → Charger le modèle complet du déménagement**

### Second appareil (conjointe)

1. Ouvrez l'application sur le téléphone
2. Cliquez **Rejoindre un espace existant**
3. Entrez le code d'invitation et votre prénom
4. Les données se synchronisent automatiquement

### Au quotidien

- Utilisez les **statuts** et le bouton **Valider** pour avancer
- Ajoutez des **commentaires** sur chaque élément
- Consultez **À faire maintenant** sur le tableau de bord
- Appuyez sur **Synchroniser** si besoin

## Structure du projet

```
src/
  components/     # UI réutilisable
  pages/          # Pages par module
  hooks/          # useWorkspace, useItems, useRealtime…
  lib/            # Supabase, cache, utils
  services/       # API Supabase
  types/          # Types TypeScript
  data/           # Données initiales (seed)
  styles/         # CSS Tailwind
  pwa/            # Service worker
supabase/
  schema.sql      # Tables
  policies.sql    # RLS
  functions.sql   # RPC create/join workspace
```

## Sécurité

- Row Level Security activé sur toutes les tables
- Chaque utilisateur n'accède qu'aux workspaces dont il est membre
- Auth anonyme Supabase (session persistante par appareil)
- **Ne stockez pas** de documents sensibles dans les notes

## Mode hors ligne

- Les dernières données chargées restent visibles sans connexion
- Les modifications sont bloquées hors ligne avec un message clair
- Le service worker met en cache les fichiers statiques

## Licence

Usage personnel — projet familial.
