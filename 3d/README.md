# Trou Noir 3D - Génération & Importation avec Blender (Scripts Séparés)

Pour concevoir ce trou noir "Gargantua" ultra-stylisé avec toutes ses animations de rotation et distorsions de fluides, la génération a été découpée en **3 scripts séparés** à exécuter dans l'ordre. Cela permet de construire la scène élément par élément et d'éviter les conflits de nettoyage de scène.

## Étape 1 : Ouvrir Blender
1. Lancez **Blender** (compatible de Blender 2.8x jusqu'à 4.x+).
2. Créez un nouveau projet général et placez-vous sur l'onglet **Scripting** dans la barre des menus en haut.

---

## Étape 2 : Lancer les scripts dans l'ordre

### 1. La Singularité (Event Horizon)
Ce script nettoie la scène par défaut et crée la sphère centrale noire absolue.
1. Dans l'éditeur de texte de l'onglet Scripting, cliquez sur **+ New** (Nouveau).
2. Ouvrez le fichier [01_create_singularity.py](file:///c:/Users/gorth/Desktop/DEV/BOT-Velthor/3d/01_create_singularity.py), copiez son contenu, collez-le dans Blender et cliquez sur **Run Script** (le bouton de lecture ▶️).

### 2. Le Disque d'Accrétion Fluide Animé
Ce script génère le disque d'accrétion horizontal en spirale, déformé par une fonction d'ondes de fluides superposées, avec son gradient émissif thermique (vertex colors) et son animation de rotation loopable de 120 frames.
1. Créez un nouveau bloc de texte dans l'éditeur Blender (cliquez sur l'icône de document ou le bouton New).
2. Ouvrez le fichier [02_create_accretion_disk.py](file:///c:/Users/gorth/Desktop/DEV/BOT-Velthor/3d/02_create_accretion_disk.py), copiez son contenu, collez-le dans Blender et cliquez sur **Run Script** ▶️.

### 3. Les Anneaux de Lentille Gravitationnelle Animés
Ce script génère les anneaux de lumière déformés verticaux (Back et Front) qui ceinturent la singularité pour simuler la déflexion gravitationnelle. Ils intègrent une distorsion spatiale courbe (warp) et des animations de rotation lentes dans des sens opposés pour créer du contraste.
1. Créez un troisième bloc de texte dans Blender.
2. Ouvrez le fichier [03_create_lensing_rings.py](file:///c:/Users/gorth/Desktop/DEV/BOT-Velthor/3d/03_create_lensing_rings.py), copiez son contenu, collez-le dans Blender et cliquez sur **Run Script** ▶️.

---

## Étape 3 : Aperçu & Rendu (Optionnel mais recommandé)
Dans le viewport de Blender, pour voir la transparence et le glow de votre trou noir :
1. Appuyez sur la touche `Z` dans la vue 3D et sélectionnez **Material Preview** ou **Rendered** (au lieu de *Solid*).
2. Appuyez sur la barre d'espace (ou cliquez sur Play dans la timeline de Blender) pour regarder le disque d'accrétion et les anneaux de lentille tourner en continu !

---

## Étape 4 : Exporter le modèle au format GLTF (.glb)
1. Sélectionnez tous les objets générés dans la scène (appuyez sur la touche `A` dans le viewport 3D).
2. Allez dans le menu : **File** -> **Export** -> **glTF 2.0 (.glb/.gltf)**.
3. Dans le panneau d'options d'exportation de droite, vérifiez ces réglages :
   - **Format** : `glTF Binary (.glb)`.
   - **Include** : Cochez **Selected Objects** (Objets sélectionnés).
   - **Animation** : Cochez **Animation** (pour intégrer la rotation continue de 120 frames du disque et des anneaux).
4. Nommez le fichier `black_hole.glb` et exportez-le.

---

## Étape 5 : Intégration Web automatique
1. Copiez/Déplacez le fichier `black_hole.glb` exporté dans le dossier du projet :
   `apps/web/public/models/black_hole.glb`
2. Lancez le serveur web local (`npm run dev`) et rendez-vous sur `/about`. Le site chargera instantanément le modèle 3D animé !
