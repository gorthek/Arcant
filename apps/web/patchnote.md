# 🚀 Arcant - Documentation Développeur & Journal des Patchnotes

Ce document centralise **l'explication complète de l'architecture d'Arcant** pour l'équipe de développement ainsi que le **historique détaillé des patchnotes** du Dashboard Web et de l'écosystème.

---

# 📘 GUIDE DU DÉVELOPPEUR & EXPLICATION DU PROJET

### 1. 🌐 Vision & Raison d'être d'Arcant
Arcant est un écosystème d'**Intelligence Artificielle Locale autonome pour Discord**. 
Contrairement aux bots Discord classiques qui exécutent des commandes prédéfinies ou dépendent d'API tierces coûteuses (OpenAI/Gemini), Arcant intègre un **moteur NLP et d'IA locale** capable de :
- Comprendre le langage naturel, tolérer les fautes de frappe (*algorithme de Levenshtein*).
- Générer automatiquement des structures de serveurs (salons, catégories, rôles).
- Apprendre des règles personnalisées définies directement par les propriétaires de serveurs via le dashboard ou le chat.
- Conserver la confidentialité absolue des jetons de sécurité grâce au chiffrement **AES-256-GCM**.

---

### 2. 🏗️ Architecture du Monorepo

Le projet est structuré sous forme de monorepo Turbo / npm workspaces :

```
BOT-Velthor/
├── apps/
│   ├── web/                # Dashboard Web & Landing Page (Next.js 16, Tailwind, Framer Motion, Three.js)
│   ├── bot/                # Bot Discord principal (discord.js v14, Dynamic BotManager Spawner, HTTP API)
│   └── api/                # Service API backend central
├── packages/
│   └── database/           # Package Mongoose partagé (@arcant/database) avec les schémas MongoDB
```

#### 🛠️ Détail des composants clés :

1. **Dashboard Web (`apps/web`)** :
   - Propulsé par **Next.js 16 (App Router)** et **NextAuth** (connexion OAuth2 Discord).
   - Propose une expérience personnalisée selon le rôle Discord détecté.
   - Intègre un éditeur visuel de serveurs (Discord Mockup), un Copilot Builder interactif et une console d'administration globale.

2. **Bot Discord & Spawner (`apps/bot`)** :
   - Moteur `discord.js v14` autonome.
   - **BotManager (`apps/bot/src/utils/BotManager.ts`)** : Permet l'instanciation dynamic à chaud d'instances de bots personnalisés créées par les utilisateurs.
   - Serveur HTTP interne sur le port 3000 permettant au Dashboard Web de déclencher les opérations à chaud (`/spawn-bot`, `/copilot`, `/sync-server`, `/announce`).

3. **Package Base de Données (`packages/database`)** :
   - Connecteur MongoDB centralisé (`dbConnect()`).
   - Schémas réutilisables :
     - `User` : Identifiants Discord, rôles, sessions, emails et médailles.
     - `Server` : Paramètres Anti-Raid, Anti-Lien, sensibilité et salons configurés.
     - `CustomBot` : Config des bots personnalisés (token AES-256, personality prompt, modules activés).
     - `Rule` : Base de connaissances et déclencheurs de réponses IA par serveur.

---

### 3. 🔐 Système de Rôles & Sécurité

L'accès à l'application web s'adapte dynamiquement selon les droits utilisateur :

- **Bot Owner / CEO (Gorthek, Marvin, Nono)** :
  - ID Discord maîtres (ex: `1061340110219640905`).
  - Déverrouille la **Console Suprême** (Visualisation globale DB, terminal d'annonces aux serveurs).

- **Owner Serveur (Thème Émeraude)** :
  - Créateur/Propriétaire du serveur Discord.
  - Contrôle total sur la création de bots, les règles d'IA et la génération dynamique de salons.

- **Admin (Thème Démoniaque Rouge)** :
  - Administrateur du serveur (permissions Discord `Administrator`).
  - Accès aux outils de modération et règles de sécurité avec verrouillage en lecture seule des crédits/abonnements.

- **Membre (Thème Bleu Spatial)** :
  - Membre classique du serveur.
  - Consultation de son niveau d'expérience (XP), succès débloqués et statistiques du serveur.

---

# 🟢 JOURNAL COMPLET DES PATCHNOTES

---

## 🟢 Version 2.4.0
*Dernière modification : 14 Juillet 2026*

### 🌐 Logo 3D Animé, Explication Rédigée & Documentation Développeur (Qui Sommes-Nous)
- **[Emblème Logo 3D Interactif]** Intégration d'un composant WebGL 3D Three.js (`Arcant3DLogo.tsx`) reproduisant fidèlement l'emblème géométrique d'Arcant avec relief extrudé, biseautage métallique cyan/blanc, anneau de particules d'énergie et inclinaison dynamique au mouvement de la souris.
- **[Suppression de la Console de Code]** Remplacement de la fenêtre d'éditeur VS Code par un texte explicatif structuré valorisant la vision d'Arcant, l'hébergement d'IA autonome et l'infrastructure de chiffrement cryptographique AES-256-GCM.
- **[Refonte des Fiches Fondateurs]** Amélioration des cartes de Gorthek (CEO Lead Dev), Marvin (CEO Investisseur) et Nono (CEO Développeur) avec avatars stylisés haute définition, fallback d'initiales métalliques et boutons de copie d'ID Discord.
- **[Guide Développeur Intégré]** Reconversion du fichier `patchnote.md` en documentation technique d'architecture pour l'équipe de développement.

---

## 🟢 Version 2.3.0
*Dernière modification : 14 Juillet 2026*

### 🌐 Section des 3 Fondateurs & Photos de Profil Discord
- **[Profils des 3 Fondateurs]** Refonte visuelle complète intégrant la vitrine des 3 fondateurs : Gorthek (CEO & Lead Developer), Marvin (CEO & Investisseur), et Nono (CEO & Développeur).
- **[Badges & Rôles Stylisés]** Ajout de badges sémantiques thématiques (Architecte Système, Stratégie Business, Core Bot & UI) avec bordures néon interactives.
- **[Copie Rapide des ID Discord]** Intégration de boutons cliquables permettant de copier directement les identifiants Discord de Marvin et Nono.

---

## 🟢 Version 2.2.15
*Dernière modification : 12 Juillet 2026*

### 🌐 Éditeur de Code Interactif Complet (Qui Sommes-Nous)
- **[Système d'Onglets Clés]** Implémentation de 3 onglets cliquables pour naviguer dans l'éditeur : `qui_sommes_nous.ts`, `bot_spawner.ts`, et `security_vault.json`.
- **[Simulateur de Terminal Réactif]** Ajout d'un bouton `RUN SCRIPT` déclenchant une simulation de déploiement en direct dans une console bash réactive au bas de l'éditeur.
- **[Effet Spotlight Curseur]** Intégration d'un halo de lumière diffuse radiale qui suit en temps réel le curseur de la souris.

---

## 🟢 Version 2.2.14
*Dernière modification : 12 Juillet 2026*

### 🌐 Amélioration Constellation Interactive
- **[Attraction Gravitationnelle]** Ajout d'une force d'attraction magnétique attirant les particules à proximité du curseur.
- **[Dégradés Multicolores]** Remplacement des lignes unicolores par des dégradés dynamiques entre le turquoise d'Arcant et l'indigo.

---

## 🟢 Version 2.2.13
*Dernière modification : 12 Juillet 2026*

### 🌐 Paragraphe Descriptif & Routes de Test d'Animations
- **[Texte Descriptif d'Arcant]** Ajout d'un paragraphe descriptif du projet Arcant.
- **[4 Routes de Test]** Création de 4 routes de test distinctes (`/about/test-a`, `/about/test-b`, `/about/test-c`, `/about/test-d`).

---

## 🟢 Version 2.2.0 à 2.2.12
*Dernière modification : 09-12 Juillet 2026*

### 🌐 Moteur d'IA Locale Suprême & Self-Learning
- **[Générateur Intelligent Local]** Implémentation d'un parseur sémantique local dans notre IA unifiée générant salons, rôles et permissions Discord selon 5 thèmes.
- **[Self-Learning & Dialogue]** Possibilité pour l'IA d'enregistrer de nouvelles règles de commande ou de réponse par elle-même directement à l'écrit via le chat.
- **[Copilot Builder]** Interface scindée permettant de dicter les modules et personnalités des bots en conversation naturelle.

---

## 🟢 Version 2.0.0 & 2.1.0
*Dernière modification : 04-07 Juillet 2026*

### 🌐 Console Suprême CEO & Optimisations Mobiles
- **[Console Suprême CEO]** Console d'administration suprême réservée au Bot Owner avec explorateur de base de données globale et terminal d'annonces.
- **[Compatibilité Mobile]** Menu hamburger responsive, tiroir sidebar et unités dynamiques `min-h-dvh`.
- **[Performance WebGL]** Remplacement des nœuds DOM lourds par des Canvas HTML5 2D ultra-légers.

---

## 🟢 Version 1.0.0 à 1.2.3
*Dernière modification : 30 Juin - 03 Juillet 2026*

### 🌐 Fondation du Projet Arcant
- Renommage du projet de *BOT-Velthor* à **Arcant**.
- Création du package commun `@arcant/database` (Mongoose).
- Authentification OAuth2 Discord avec NextAuth.
- Adoption de la charte graphique Turquoise/Émeraude (Teal/Emerald).
