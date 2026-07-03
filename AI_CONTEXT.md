# 🤖 Contexte IA - Projet Arcant (Anciennement BOT-Velthor)

**À lire obligatoirement par toute IA au début d'une nouvelle conversation pour reprendre le contexte du projet.**

## 📖 Résumé du Projet
**Arcant** est un projet monorepo comprenant un Bot Discord (TypeScript/discord.js), un Dashboard Web (Next.js/React/Tailwind) et une API (Express.js). Le but global est de fournir un bot haut de gamme (thème Teal/Emerald) pour les serveurs Discord, dont la configuration et les statistiques sont gérables depuis un dashboard web élégant (Glassmorphism, animations).

---

## 📂 Arborescence et Modules

Le projet est structuré sous forme de monorepo npm :

```text
📦Arcant (BOT-Velthor)
 ┣ 📂apps
 ┃ ┣ 📂api (Serveur de pont API Express.js)
 ┃ ┣ 📂bot (Bot Discord en discord.js v14)
 ┃ ┗ 📂web (Dashboard Web en Next.js 16 App Router)
 ┣ 📂packages
 ┃ ┗ 📂database (Package partagé Mongoose & Schemas)
 ┣ 📜AI_CONTEXT.md
 ┣ 📜package.json
 ┗ 📜render.yaml
```

### 1. `apps/bot` (Le Bot Discord)
- **Rôle** : Bot Discord principal avec système de Commandes et Événements dynamiques.
- **Modules clés** : `discord.js` (v14), `dotenv`, `typescript`.
- **Structure** : `src/commands`, `src/events`, `src/handlers`, `src/utils`.
- **Déploiement** : Hébergé sur **Render** (utilise un serveur HTTP factice sur le port 3000 pour maintenir le service actif).

### 2. `apps/web` (Le Dashboard Web)
- **Rôle** : Interface utilisateur pour gérer le bot, voir les statistiques et souscrire au Premium. Design premium, Glassmorphism, animations avancées.
- **Modules clés** : `next` (v16.2.9), `react` (v19), `tailwindcss` (v4), `framer-motion`, `next-auth` (connexion Discord OAuth2), `lucide-react`.
- **Structure** : Architecture Next.js App Router (`src/app`, `src/components`).
- **Déploiement** : Hébergé sur **Vercel**.

### 3. `apps/api` (L'API)
- **Rôle** : Servir de pont/liaison entre le Dashboard Web et le Bot Discord.
- **Modules clés** : `express`, `cors`, `dotenv`.
- **Structure** : `src/index.ts` (actuellement une route de test sur le port 4000).
- **Déploiement** : Hébergée sur **Render**.

---

## 🔗 Chemins, Routes, APIs et Liaisons

### ✅ Ce qui est fait :
- **Web** : 
  - Route d'accueil (`/`) avec offres Premium, avis, animations.
  - Route `/about` présentant Arcant.
  - Authentification OAuth2 Discord fonctionnelle via `NextAuth` avec menu Profil interactif.
- **Bot** :
  - Handler de commandes/événements fonctionnel.
  - Commande `.help` ultra-premium (Embeds Teal/Emerald, bannière IA).
- **API** :
  - Route `/` (GET) basique pour vérifier que l'API tourne.

### 🚧 Ce qu'il reste à faire (Liaisons Site ↔ Bot) :
- **Création des routes API** : Construire les routes dans `apps/api` pour exposer les données du Bot au Web (ex: `/api/bot/stats`, `/api/guilds`).
- **Communication Inter-services** : 
  - Permettre au Dashboard Web (Next.js) de récupérer la liste des serveurs de l'utilisateur connecté via l'API, et vérifier sur lesquels le bot est présent (nécessite une communication Web -> API -> Bot).
  - Permettre la modification des paramètres du bot depuis le Web via des requêtes POST/PUT vers l'API.

---

## 🎯 Plan d'Action & Tâches

### 🔴 Très Important (Priorité Haute)
1. **Développer l'API** : L'API (`apps/api`) est actuellement une coquille vide. Il faut créer les routes et la logique nécessaires pour faire la passerelle Dashboard ↔ Bot.
2. **Liaison Web ↔ API ↔ Bot** : Mettre en place les appels de l'API depuis le Dashboard, et la transmission des ordres au Bot.
3. **Commande `.patchnote`** : Implémenter la commande bot `.patchnote` qui lit et affiche le fichier `patchnote.md` du bot sur Discord.
4. **Intégration IA (Commandes directes)** : L'IA ne doit pas créer de channel spécifique pour interagir avec elle, l'utilisation de l'IA se fera via une commande directe sur le bot.
5. **Création de bots personnalisés** : Le système doit permettre à l'IA de créer des bots personnalisés.

### 🟡 Moins Important (Priorité Moyenne/Basse)
1. **Nouvelles Commandes Bot** : Ajouter d'autres commandes utiles (modération, utilitaires, économie) une fois la structure de base solide.
2. **Dashboard UI/UX** : Continuer d'améliorer les animations ou ajouter des pages de configuration spécifiques à chaque serveur une fois l'API prête.

---

## 💡 Ajustements Recommandés
- **Gestion des Types Partagés** : Je recommande de créer un dossier `packages/shared` à la racine du monorepo pour partager les types/interfaces TypeScript (ex: `User`, `ServerConfig`) entre le bot, le web et l'api afin d'éviter la duplication de code et les erreurs de typage.
- **Patchnotes (Règle en vigueur)** : Toujours penser à mettre à jour séparément les fichiers `patchnote.md` du site et du bot à chaque changement de version important !
