# Patchnotes Arcant Web

## v3.3.1 (Fix Chargement Infini Dashboard Vercel)
- **Correction des Requêtes API du Dashboard (`OwnerDashboard`, `AdminDashboard`, `MemberDashboard`)** :
  - Suppression des prefixes d'URL `http://localhost:4000` en dur qui provoquaient un blocage Mixed Content (HTTP/HTTPS) et un statut "Chargement des données du serveur..." infini sur Vercel.
  - Conversion vers des routes d'API relatives Next.js (`/api/server/[id]/...`) ultra-rapides et sécurisées.
  - Ajout d'une gestion `try/catch/finally` garantie pour débloquer le rendu du dashboard même en cas de latence du bot.

## v3.3.0 (Expérience Webflow 3D & Interactivité Suprême)
- **Nouveau Webflow 3D Interactif (`Interactive3DWorkflow.tsx`)** :
  - Intégration d'un visualiseur 3D temps réel du flux d'automatisation (Événement Discord $\rightarrow$ Filtre Anti-Raid $\rightarrow$ Moteur IA $\rightarrow$ Action Bot/Embed).
  - Faisceaux d'énergie 3D lumineuse avec particules en mouvement entre les nœuds.
  - Scène 3D orientable et zoomable avec `OrbitControls` et panneau HUD interactif permettant d'inspecter et de simuler le workflow.
- **Hero 3D Core Interactif (`InteractiveScene.tsx`)** :
  - Ajout d'interactivité au clic sur le noyau 3D central déclenchant des impulsions d'ondes de choc et accélérant la rotation.
  - Satellites 3D en orbite (Velthor Bot, Anti-Raid Shield, Custom Engine, 0ms Latency) avec badges interactifs au survol.
- **Cartes de Fonctionnalités avec Micro-Scènes 3D (`Features.tsx`)** :
  - Cartes avec effet Tilt 3D réactif à la position de la souris et reflets radiaux.
  - Intégration de micro-canvases 3D avec gemmes en cristal rotatives personnalisées pour chaque fonctionnalité.
- **Champ d'Étoiles 3D Réactif à la Souris (`StardustBackground.tsx`)** :
  - Physique de répulsion magnétique douce repoussant les particules au passage du curseur de l'utilisateur.

## v3.2.0 (Studio IA & Premium Paywall Update)
- **Monétisation & Paywall Premium**
  - Ajout du `PremiumLockWrapper` : les fonctionnalités nécessitant un abonnement (ex: IA générative) sont désormais floutées avec un cadenas interactif.
  - Refonte totale de la Landing Page (`Pricing.tsx`) avec les forfaits VIP Serveur/Membre (1, 6, 12 mois) et l'intégration du forfait "Lifetime" caché via un easter-egg.
- **Studio IA & Création de Bots (Module IA)**
  - Extraction du "Studio IA" dans `ModuleIA.tsx` depuis le Dashboard Owner.
  - Page **IA Architecte** : Planification visuelle de rôles et salons.
  - Page **Créateur de Bot Indépendant** : Ajout de 3 méthodes de création :
    - Mode **Magie IA** (Interface de Chat Génératif).
    - Mode **No-Code Scratch** (Implémentation de `ScratchEditor` propulsé par `ReactFlow` avec éditeur de paramètres sur double-clic des nœuds).
    - Mode **Code Pro** (Intégration de `Monaco Editor` pour les développeurs JS/TS).
- **Stabilité et Architecture (Next.js 15+ & SWR)**
  - Refactoring complet du Dashboard via SWR (`useSWR`) pour des requêtes fluides, éliminant les `useState` et les `setTimeout`.
  - Résolution des erreurs de compilation liées à l'App Router (`params` async) pour toutes les routes API internes (`/api/server/[id]/...`).
  - L'intégration de la base de données Mongoose a été solidifiée pour inclure le support `isLifetimePremium`.

## v3.1.0 (Performance & Background Update)
- **Refonte des arrière-plans du Dashboard**
  - Remplacement total des scènes 3D (`three.js` / `@react-three/fiber`) devenues trop lourdes et inutiles par un vrai fond 2D animé et stylé.
  - Utilisation de `framer-motion` pour générer des orbes lumineuses dynamiques et un système de particules fluides pour chaque rôle (Bot Owner, Server Owner, Admin, Member).
  - Amélioration majeure des performances de rendu côté client sur la page du dashboard.

## v3.0.0 (Dashboard Re-Imagination Update)
- **Refonte visuelle totale des Dashboards (Console Suprême & Rôles)**
  - `BotOwnerGlobalDashboard` : Intégration du thème Cyberpunk (Console Suprême) avec effets CRT (Scanlines CSS), terminal interactif et bordures holographiques.
  - `OwnerDashboard` : Intégration du thème Luxe / Or avec halos de lumière dynamiques.
  - `AdminDashboard` : Intégration du thème Tactique / Rouge Cramoisi avec une grille de sécurité et design rigide / imposant.
  - `MemberDashboard` : Intégration du thème Fluide / Violet & Bleu avec des formes arrondies et des animations Framer Motion adoucies.
- **RoleBackground (3D)**
  - Les arrière-plans `three.js` changent désormais radicalement d'atmosphère en fonction du rôle sélectionné (cyberpunk, particules dorées, radar tactique, ondes relaxantes).
- Mise en place de `globals.css` pour supporter l'animation `scanline`.
