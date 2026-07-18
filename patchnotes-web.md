# Patchnotes Arcant Web

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
