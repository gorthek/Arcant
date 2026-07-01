// MOTEUR MULTI-AGENTS REEL (Node.js)
// Ne nécessite AUCUN package NPM externe (utilise fetch natif)

const fs = require('fs');
const path = require('path');

// 1. Chargement manuel du fichier .env pour éviter d'avoir besoin du package 'dotenv'
let apiKey = process.env.GEMINI_API_KEY;
try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Erreur lors de la lecture du .env :", e.message);
}

// Vérification de sécurité
if (!apiKey || apiKey === 'METS_TON_API_KEY_ICI' || apiKey === '') {
    console.error("❌ ERREUR CRITIQUE : L'API Key de Gemini est manquante !");
    console.error("-> Ajoute GEMINI_API_KEY=ta_cle_api dans le fichier .env à la racine de BOT-Velthor.");
    console.error("-> Tu peux obtenir une clé gratuite ici : https://aistudio.google.com/app/apikey");
    process.exit(1);
}

// 2. Fonction d'appel HTTP vers la vraie API de l'IA (Gemini 3.1 Pro Preview)
async function callAI(systemPrompt, userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`;
    
    const payload = {
        system_instruction: {
            parts: [{ text: systemPrompt }]
        },
        contents: [{
            role: "user",
            parts: [{ text: userPrompt }]
        }],
        generationConfig: {
            temperature: 0.7, // Assez créatif pour le code, mais pas trop aléatoire
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("❌ Erreur de l'API IA :", error.message);
        process.exit(1);
    }
}

// 3. Le Pipeline Multi-Agents (Orchestration Réelle)
async function runAgents(taskDescription) {
    console.log(`\n🚀 [ORCHESTRATEUR] Démarrage de la tâche : "${taskDescription}"\n`);
    
    // --- ETAPE 1 : LE SCRIPTER (Génération Initiale) ---
    const scripterSystem = `Tu es le Scripter (Développeur Senior). 
Ton but est d'écrire le meilleur code possible pour la tâche demandée. 
Ne renvoie QUE du code et de brèves explications. Pas de blabla.`;
    
    console.log("💻 [SCRIPTER] En train de réfléchir et de coder...");
    const scripterCode = await callAI(scripterSystem, `Tâche : ${taskDescription}`);
    console.log("✅ [SCRIPTER] Code initial généré.\n");

    // --- ETAPE 2 : LE DEBUGGER (Critique Autonome) ---
    const debuggerSystem = `Tu es le Debugger (Testeur Impitoyable).
Ton rôle est de lire le code fourni par le Scripter et de trouver toutes les failles : 
bugs, problèmes de sécurité, mauvaises pratiques, optimisations manquantes. 
Sois direct et leste les problèmes sans écrire le code corrigé.`;

    console.log("🐛 [DEBUGGER] Analyse du code du Scripter...");
    const debuggerReview = await callAI(debuggerSystem, `Code à analyser :\n\n${scripterCode}`);
    console.log("✅ [DEBUGGER] Failles trouvées et listées.\n");

    // --- ETAPE 3 : L'ORCHESTRATEUR (Fusion et Correction Finale) ---
    const orchestratorSystem = `Tu es l'Orchestrateur (Lead Tech). 
Tu vas recevoir le code initial du Scripter ET les critiques du Debugger.
Ta mission est d'appliquer toutes les corrections du Debugger pour fournir la version FINALE et PARFAITE du code.`;
    
    const finalPrompt = `
    Tâche initiale demandée par l'utilisateur: ${taskDescription}
    
    --- CODE INITIAL (Scripter) ---
    ${scripterCode}
    
    --- CRITIQUES A CORRIGER (Debugger) ---
    ${debuggerReview}
    
    Génère la version finale corrigée du code.
    `;

    console.log("🧠 [ORCHESTRATEUR] Application des corrections et finalisation...");
    const finalCode = await callAI(orchestratorSystem, finalPrompt);
    console.log("✅ [ORCHESTRATEUR] Code final prêt.\n");

    // 4. Sauvegarde du rapport complet
    const resultPath = path.join(__dirname, '..', 'agent_result.md');
    const reportContent = `# Rapport d'Exécution Multi-Agents
**Tâche :** ${taskDescription}

## 1. 💻 Proposition Initiale (Scripter)
${scripterCode}

## 2. 🐛 Analyse et Critiques (Debugger)
${debuggerReview}

## 3. 🧠 Résultat Final Corrigé (Orchestrateur)
${finalCode}
`;

    fs.writeFileSync(resultPath, reportContent, 'utf-8');
    console.log(`🎉 SUCCÈS ! Les agents ont terminé de débattre pour de vrai.`);
    console.log(`📄 Lis le fichier 'agent_result.md' à la racine pour voir leur travail !`);
}

// 4. Point d'entrée du script (récupération de la tâche)
const args = process.argv.slice(2);
const task = args.join(" ");

if (!task) {
    console.log("❌ Erreur : Tu dois fournir une tâche aux agents !");
    console.log("Exemple d'utilisation :");
    console.log('node .agents/engine.js "Créer une fonction JavaScript pour trier un tableau dobjets par date"');
} else {
    runAgents(task);
}
