# 🚀 Arcant - Patchnotes (Bot Discord & API)

Bienvenue dans le journal des mises à jour du Bot Discord et de l'API d'Arcant ! 
Ce document est mis à jour à chaque fin de tâche pour suivre l'évolution de ces services.

---

## 🟢 Version 1.0.1 (En cours de développement)
*Dernière modification : 01 Juillet 2026*

### 🤖 Bot Discord & ⚙️ API
- **[Déploiement Render]** Préparation du projet pour un hébergement gratuit sur **Render** (création du fichier `render.yaml`).
- **[Structure]** Création des points d'entrée de base (`index.ts`) pour l'API Express et le Bot Discord.
- **[Scripts]** Ajout des scripts `build`, `start` et `dev` (avec `tsc` et `ts-node`) dans les `package.json` respectifs.
- **[Configuration]** Ajustement des `tsconfig.json` (`rootDir`, `outDir`, et module `commonjs`).

---

## 🟢 Version 1.0.0
*Dernière modification : 30 Juin 2026*

### 🤖 Bot Discord & ⚙️ API
- **[Architecture]** Initialisation de l'infrastructure globale en 3 pôles : `apps/bot`, `apps/web` et `apps/api`.
- **[IA Custom]** Préparation du terrain pour accueillir l'intelligence artificielle sur-mesure.
- **[Commandes]** Ajout de la future commande `.patchnote` aux tâches prévues (elle lira ce fichier pour l'afficher sur Discord).
