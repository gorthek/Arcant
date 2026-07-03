# 🚀 Arcant - Patchnotes (Dashboard Web)

Bienvenue dans le journal des mises à jour du Dashboard Web d'Arcant ! 
Ce document est mis à jour à chaque fin de tâche pour suivre l'évolution du site.

---

## 🟢 Version 1.2.3
*Dernière modification : 03 Juillet 2026*

### 🌐 Dashboard (Constructeur Copilot IA)
- **[Copilot Builder]** Remplacement du formulaire statique de création de bot par une véritable interface "Copilot". L'utilisateur discute directement avec l'IA dans un chat interactif pour dicter les modules (économie, tickets, modération) et la personnalité qu'il souhaite.
- **[Live State Viewer]** Ajout d'un panneau "État en direct" sur la droite du Copilot. Ce panneau écoute l'API et se met à jour en temps réel (sous les yeux de l'utilisateur) chaque fois que le Copilot décide d'installer un module ou de changer le prompt du bot, prouvant que l'action a bien eu lieu.
- **[Interface Scindée]** Le design a été scindé en deux colonnes (Dashboard IA type IDE) pour offrir une expérience professionnelle "Agentic".

---

## 🟢 Version 1.2.2
*Dernière modification : 03 Juillet 2026*

### 🌐 Dashboard (Refonte IA V4)
- **[Commandes Directes IA]** L'IA ne nécessite plus d'être assignée à un salon spécifique (`#discussion-ia`). L'interface a été mise à jour pour indiquer que l'assistant fonctionne désormais de manière globale sur le serveur via des commandes directes (`/ask` ou mention du bot).
- **[Bots Personnalisés]** Ajout d'une nouvelle interface de configuration pour permettre aux utilisateurs de créer, personnaliser (nom, avatar, personnalité) et déployer leurs propres bots propulsés par Arcant. 

---

## 🟢 Version 1.2.1
*Dernière modification : 03 Juillet 2026*

### 🌐 Dashboard (Correctifs & Améliorations DB)
- **[Abonnement & Crédits]** Nettoyage des anciennes données codées en dur ("1450 crédits", "Premium Actif"). L'interface affiche maintenant le vrai statut (Arcant Gratuit, 0 crédits).
- **[NextAuth & MongoDB]** La connexion Discord sauvegarde désormais automatiquement l'adresse e-mail et le pseudo Discord de l'utilisateur dans MongoDB. Correction des conflits de typage stricts avec Next.js 16 (`Profile.id` et `Profile.username`).
- **[Notifications]** Le bouton `Tout marquer comme lu` fonctionne et vide correctement la liste animée.
- **[Grade CEO]** Correction du système de vérification des permissions pour garantir que le statut "Owner Bot" écrase automatiquement le statut "Membre" sans nécessiter d'action manuelle, même en cas de bug de l'URL (`params.id`).

---

## 🟢 Version 1.2.0
*Dernière modification : 03 Juillet 2026*

### 🌐 Base de données & Abonnements
- **[Base de données Partagée]** Création du package `@arcant/database` (Mongoose) commun à toute l'architecture (Site Web, API, Bot Discord).
- **[Suppression des Crédits]** Le système de crédits obsolète a été totalement supprimé des dashboards Owner et Admin.
- **[Nouveau Modèle Premium]** Remplacement des Crédits par un Statut d'Abonnement (Gratuit ou Arcant Premium) avec accès illimité à l'IA.
- **[Abonnement Animé]** Refonte de la page Boutique (`/pricing`). Suppression de la boutique de crédits et ajout de cartes d'abonnement stylisées et animées.
- **[API de synchronisation]** Le dashboard vérifie désormais de manière fiable si le Bot est réellement sur les serveurs en interrogeant la vraie base de données.

---

## 🟢 Version 1.1.2
*Dernière modification : 03 Juillet 2026*

### 🌐 Dashboard (Rôles & Permissions)
- **[Permissions Dynamiques]** Le dashboard lit désormais les véritables permissions depuis l'API Discord au lieu de simuler un accès. Il différencie automatiquement : le Propriétaire du Bot (CEO), le Créateur du Serveur (Owner Serveur), l'Administrateur (Admin), et le simple Membre.
- **[Séparation par Rôle]** Création de 3 expériences totalement distinctes selon le rôle de l'utilisateur :
  - **Owner Serveur (Thème Émeraude)** : Accès intégral, génération IA, configuration globale. Thème luxueux avec animations vertes.
  - **Admin (Thème Démoniaque/Rouge)** : Interface de sécurité et modération. L'IA est verrouillée en "Lecture Seule" pour empêcher l'utilisation des crédits. Design agressif avec lueurs rouges.
  - **Membre (Thème Spatial/Bleu)** : Dashboard public d'informations. Impossible de modifier les paramètres, mais possibilité de voir ses statistiques, messages et XP sur le serveur avec des animations fluides bleutées.

---

## 🟢 Version 1.1.1
*Dernière modification : 02 Juillet 2026*

### 🌐 Dashboard (Animations & IA V3)
- **[Animations Header]** Refonte totale des effets de grades de la barre de navigation. Ajout d'une nuée d'âmes fantomatiques animées pour l'Admin et d'un halo divin d'étincelles pour l'Owner Serveur.
- **[Notifications]** Création d'un menu déroulant interactif complet et animé pour la cloche de notifications.
- **[Crédits PRO]** Désengorgement du module IA en déplaçant toute l'interface complexe des forfaits/crédits dans la page des paramètres (`/settings`). 
- **[IA Générative V3]** Ajout de commandes poussées pour la création IA : Gestion experte des Rôles et Permissions, intégration de typographies spéciales (Fonts), architecture de design des salons (Emojis et Séparateurs), et option d'enregistrement de l'historique de l'IA (Database).

---

## 🟢 Version 1.1.0
*Dernière modification : 02 Juillet 2026*

### 🌐 Dashboard (Refonte UI & IA)
- **[Sélection Serveur]** Refonte totale avec intégration de l'API Discord (`/users/@me/guilds`) pour afficher les vrais serveurs gérés par l'utilisateur.
- **[Animations]** Ajout d'un fond interactif de particules fluides qui réagissent à la souris, et d'effets de "Glow" intenses au survol des cartes.
- **[Grades Dynamiques]** Le Header affiche désormais la vraie photo de profil et le pseudo. Intégration de badges animés ultra-premium selon le rôle (Owner, Admin, Owner Serveur, Membre).
- **[Module IA]** Refonte complète du module d'Intelligence Artificielle. Ajout des barres de "Limites d'utilisation PRO". Séparation claire entre l'IA de création de serveur (prompt, images, vocal) et l'Assistant ChatBot.
- **[Améliorations]** Ajout des liens vers le Support Discord et l'État des Services dans la Sidebar, ainsi qu'un badge "Premium Actif" brillant.

---

## 🟢 Version 1.0.1
*Dernière modification : 01 Juillet 2026*

### 🌐 Déploiement Vercel
- **[Hébergement]** Préparation du Dashboard pour le déploiement natif sur **Vercel**.
- **[Suppression]** Le script `index.js` à la racine n'est plus nécessaire pour le Dashboard, Vercel gère automatiquement le lancement de Next.js.

---

## 🟢 Version 1.0.0
*Dernière modification : 30 Juin 2026*

### 🌐 Dashboard (Interface Web)
- **[Page À Propos]** Création de la page `/about` pour présenter l'histoire d'Arcant, nos valeurs et l'équipe.
- **[Authentification]** Mise en place d'une véritable connexion OAuth2 via Discord avec gestion de session (NextAuth).
- **[Menu Profil]** Création d'un menu déroulant interactif pour les utilisateurs connectés (Avatar, pseudo, ID unique, déconnexion).
- **[Refonte Identité]** Changement du nom du projet de *BOT-Velthor* à **Arcant**.
- **[Nouveau Thème]** Passage d'un thème Violet/Bleu à un thème **Turquoise/Émeraude (Teal/Emerald)** pour matcher le nouveau logo.
- **[Intégration Logo]** Ajout du logo dans la Navbar (avec une astuce CSS secrète de zoom pour cacher le filigrane Gemini).
- **[Animations Avancées]** Ajout massif d'animations cachées et visibles :
  - Particules flottantes en arrière-plan.
  - "Respiration" du halo lumineux au centre.
  - Rotation secrète du logo à 360° au survol.
  - Apparition en cascade "spring" (rebond) des cartes tarifaires et de leurs caractéristiques.
  - Effet de brillance tournante (spin) continue autour de la carte d'abonnement Premium.
  - Effet de lumière (sweep) au survol des boutons principaux.
  - Cartes d'avis 3D avec apparition progressive des étoiles jaunes (staggered).
- **[Style "Glassed Windows"]** Intégration du Glassmorphism (effets vitrés transparents, flou d'arrière-plan, et bordures très arrondies).
