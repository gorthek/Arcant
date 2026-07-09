# 🚀 Arcant - Patchnotes (Bot Discord & API)

Bienvenue dans le journal des mises à jour du Bot Discord et de l'API d'Arcant ! 
Ce document est mis à jour à chaque fin de tâche pour suivre l'évolution de ces services.

---

## 🔴 Version 1.6.0
*Dernière modification : 09 Juillet 2026*

### 🤖 Cœur du Bot & Intelligence Artificielle unifiée
- **[Mode Server Generation]** Liaison et décodage du nouveau mode de génération d'architecture de serveur du client IA locale, fournissant des modèles JSON directement exploitables par le générateur de serveur.
- **[Liaison de paramètres MongoDB via Copilot]** Le bot intercepte les requêtes de configuration du Copilot Web pour persister directement les modifications (ex: activation de l'anti-lien, de l'anti-raid, des mots blacklistés) en base de données MongoDB.

---

## 🟢 Version 1.5.1
*Dernière modification : 08 Juillet 2026*

### 🤖 Cœur du Bot & Optimisations Client
- **[Synchronisation & Nettoyage]** Correction des fuites de mémoire potentielles sur le tracking de la souris dans l'arrière-plan interactif du dashboard client, améliorant la réactivité de l'application sur le long terme.

---

## 🔴 Version 1.5.0
*Dernière modification : 04 Juillet 2026*

### 🤖 Cœur du Bot (Hébergeur & IA)
- **[Moteur IA 100% Personnel]** Remplacement définitif de l'API Gemini par le moteur local `CustomAIEngine`. Analyse les messages par mots-clés, gère le matching d'intentions configuré depuis le Web, et injecte les variables dynamiques (`{user}`, `{server_name}`, `{time}`, `{date}`).
- **[Terminal d'Annonces Globales]** Implémentation du point d'écoute `/announce` sur le serveur web interne du bot. Permet de diffuser instantanément des messages d'alertes enrichis (Embeds verts émeraude) sur tous les serveurs connectés.
- **[Configuration Persistante en DB]** Liaison totale des modules de sécurité (Panic Button / Raid mode, sensibilité spam, mots interdits) à MongoDB via Express, rendant le paramétrage effectif et fonctionnel.

---

## 🔴 Version 1.2.3
*Dernière modification : 03 Juillet 2026*

### 🤖 Cœur du Bot (Hébergeur & IA)
- **[Copilot IA]** Implémentation complète de l'API Copilot (`/copilot`). Le serveur peut maintenant recevoir des requêtes du Dashboard Web, lire l'état du bot dans MongoDB, injecter l'état dans l'IA locale, puis recharger les paramètres du bot à chaud.
- **[Rechargement à Chaud]** Le `BotManager` intègre désormais une fonction `reloadBot` pour mettre à jour instantanément les permissions et les fonctionnalités d'un bot actif, sans aucune interruption de service.
- **[Anti-Crash Global]** Mise en place d'un système de `try/catch` robuste sur l'exécution des commandes IA et ajout d'écouteurs globaux (`unhandledRejection` / `uncaughtException`). Si une commande de bot personnalisé plante (ex: manque de permissions), l'erreur est ignorée par le bot pour éviter un crash serveur massif.

---

## 🔴 Version 1.2.2
*Dernière modification : 03 Juillet 2026*

### 🤖 Cœur du Bot (Hébergeur)
- **[Architecture Multi-Bots]** L'application a été restructurée avec un `BotManager`. Elle peut désormais héberger dynamiquement de multiples instances de bots Discord (`CustomBots`) simultanément en se basant sur une base de données MongoDB.
- **[API Interne]** Le serveur HTTP du Bot agit désormais comme une API interne (`/spawn-bot`) pour écouter les ordres de déploiement venant du Dashboard Web, permettant le déploiement instantané d'un bot sans redémarrer le serveur.
- **[IA Locale]** Intégration d'un module d'Intelligence Artificielle "Maison" (`LocalAIClient`). Fin de la dépendance au cloud : le bot gère l'IA en local et y répond de manière autonome, que ce soit via la commande globale `/ask` ou en le mentionnant directement (`@Arcant`).

---

## 🟢 Version 1.2.1
*Dernière modification : 03 Juillet 2026*

### 🤖 Bot Discord & ⚙️ Base de Données
- **[Sauvegarde de l'Icone]** Lors de son arrivée sur un serveur, le bot sauvegarde désormais le lien de l'icône du serveur (`iconURL`) dans la base de données.

---

## 🟢 Version 1.2.0
*Dernière modification : 03 Juillet 2026*

### 🤖 Bot Discord & ⚙️ Base de Données
- **[Connexion MongoDB]** Le bot se connecte désormais de manière asynchrone à MongoDB (Mongoose) dès son lancement via le package partagé `@arcant/database`.
- **[Event: GuildCreate]** Le bot détecte son ajout sur un nouveau serveur et l'inscrit automatiquement (ou le met à jour) dans la base de données avec l'Owner ID.
- **[Event: GuildDelete]** À son départ, le bot nettoie la base de données s'il n'y a pas d'abonnement Premium actif.
- **[Sécurisation au démarrage]** Le bot démarrera même sans base de données (`MONGO_URI` manquant) pour éviter de crash en local le temps de la configuration.

---

## 🟢 Version 1.1.0

### 🤖 Bot Discord & ⚙️ API
- **[Architecture]** Mise en place du cœur du Bot : Event Handler et Command Handler dynamiques.
- **[Intents]** Configuration de l'intent `MessageContent` pour lire les commandes préfixées.
- **[Esthétique]** Création du système d'Embeds personnalisés (Thème Teal/Emerald exclusif).
- **[Commandes]** Ajout de la toute première commande `.help`, ultra-premium avec bannière générée par IA.
- **[Déploiement]** Le bot compile et se déploie de manière 100% autonome sur Render.

---

## 🟢 Version 1.0.1
*Dernière modification : 30 Juin 2026*

### 🤖 Bot Discord & ⚙️ API
- **[Architecture]** Initialisation de l'infrastructure globale en 3 pôles : `apps/bot`, `apps/web` et `apps/api`.
- **[IA Custom]** Préparation du terrain pour accueillir l'intelligence artificielle sur-mesure.
- **[Commandes]** Ajout de la future commande `.patchnote` aux tâches prévues (elle lira ce fichier pour l'afficher sur Discord).
