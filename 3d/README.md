# Trou Noir 3D - Génération & Importation dans Blender

Ce dossier contient le script nécessaire pour générer un trou noir 3D ultra-stylisé de type "Gargantua" pour l'arrière-plan interactif de l'application.

## Étape 1 : Ouvrir Blender et préparer la scène
1. Lancez **Blender** (version 3.2 ou supérieure recommandée, compatible Blender 4.x).
2. Créez un nouveau projet général.

## Étape 2 : Exécuter le script de génération
1. Dans la barre supérieure des onglets de Blender, cliquez sur **Scripting** (tout à droite).
2. Cliquez sur le bouton **+ New** (Nouveau) au centre de l'éditeur de texte pour créer un nouveau fichier de script.
3. Ouvrez le fichier [generate_black_hole.py](file:///c:/Users/gorth/Desktop/DEV/BOT-Velthor/3d/generate_black_hole.py) de ce projet, copiez l'intégralité de son contenu, et collez-le dans l'éditeur de texte de Blender.
4. Cliquez sur le bouton **Run Script** (l'icône de lecture ▶️) situé en haut à droite de l'éditeur de script pour exécuter le script.
5. Une fois exécuté, le script nettoie la scène par défaut et génère instantanément :
   * La **Singularité** (le centre noir).
   * Le **Disque d'Accrétion Plat** (avec une topologie en spirale ondulée et un gradient de couleurs émissives + transparence).
   * L'**Anneau de Lentille Arrière** (LensingRing_Back) et l'**Anneau de Lentille Avant** (LensingRing_Front) pour l'effet de distorsion lumineuse.
   * L'**Animation** de rotation du disque d'accrétion.

## Étape 3 : Exporter le modèle au format GLTF (.glb)
1. Sélectionnez tous les objets générés dans la scène (appuyez sur la touche `A` dans le viewport 3D).
2. Allez dans le menu supérieur : **File** -> **Export** -> **glTF 2.0 (.glb/.gltf)**.
3. Dans les options d'exportation sur le panneau de droite :
   * **Format** : Choisissez **glTF Binary (.glb)**.
   * **Include** : Cochez **Selected Objects** (Objets sélectionnés).
   * **Geometry** : Laissez les options par défaut (notamment *Apply Modifiers*).
   * **Animation** : Cochez **Animation** (pour inclure l'animation de rotation).
4. Nommez le fichier `black_hole.glb` et exportez-le.

## Étape 4 : Déplacer le modèle dans l'application Web
1. Créez un dossier nommé `models` dans le répertoire public du site s'il n'existe pas : `apps/web/public/models/`.
2. Déplacez le fichier `black_hole.glb` que vous venez d'exporter dans ce dossier :
   `apps/web/public/models/black_hole.glb`

## Étape 5 : Lancer le projet et admirer !
Démarrez le serveur de développement :
```bash
npm run dev
```
Rendez-vous sur la page `/about` de votre navigateur. L'application détectera automatiquement la présence du fichier `black_hole.glb` et chargera votre magnifique trou noir 3D animé ! Si le fichier est manquant ou en cours de transfert, le système de secours (fallback) continuera de s'afficher sans casser l'expérience utilisateur.
