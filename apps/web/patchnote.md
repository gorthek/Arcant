# 🚀 Arcant - Patchnotes (Dashboard Web)

Bienvenue dans le journal des mises à jour du Dashboard Web d'Arcant ! 
Ce document est mis à jour à chaque fin de tâche pour suivre l'évolution du site.

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
