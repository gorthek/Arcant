"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcantAIEngine = void 0;
const AIRule_1 = require("../models/AIRule");
const Server_1 = require("../models/Server");
const CustomBot_1 = require("../models/CustomBot");
const User_1 = require("../models/User");
class ArcantAIEngine {
    // Cache en mémoire pour réduire la charge DB et la latence
    static cache = {};
    static getFromCache(key) {
        const entry = this.cache[key];
        if (entry && entry.expiry > Date.now()) {
            return entry.data;
        }
        return null;
    }
    static setToCache(key, data, ttlMs = 15000) {
        this.cache[key] = {
            data,
            expiry: Date.now() + ttlMs
        };
    }
    /**
     * Calcule la distance de Levenshtein entre deux chaînes.
     * Indispensable pour la tolérance aux fautes d'orthographe.
     */
    static getLevenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j] + 1 // suppression
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }
    /**
     * Vérifie si deux chaînes sont similaires avec un seuil de distance maximal.
     */
    static isFuzzyMatch(word, target, maxDistance = 2) {
        if (word.length < 3 || target.length < 3)
            return word === target;
        const distance = this.getLevenshteinDistance(word, target);
        return distance <= maxDistance;
    }
    /**
     * Recherche si l'une des chaînes fournies correspond à la cible de façon tolérante.
     */
    static containsFuzzy(words, target, synonyms = []) {
        const allTargets = [target, ...synonyms];
        for (const w of words) {
            for (const t of allTargets) {
                if (t.length < 4) {
                    if (w === t)
                        return true;
                }
                else {
                    const maxDist = t.length > 6 ? 2 : 1;
                    if (this.isFuzzyMatch(w, t, maxDist))
                        return true;
                }
            }
        }
        return false;
    }
    /**
     * Analyse et génère une réponse unifiée pour le Bot Discord, l'API ou le Site Web.
     */
    static async processMessage(userMessage, context) {
        const msg = userMessage.toLowerCase().trim();
        const { mode, serverId, systemContext, userId } = context;
        // Découper le message en mots pour l'analyse fuzzy
        const cleanMsg = msg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
        const words = cleanMsg.split(/\s+/).filter(w => w.length > 0);
        // 0. Mode Server Generation (Génération d'architecture de serveur Discord)
        if (mode === 'server_generation' || systemContext?.includes("architecte") || systemContext?.includes("categories")) {
            return this.handleServerGeneration(userMessage);
        }
        // 1. Mode Copilot (Site Web - Configuration interactive)
        if (mode === 'copilot' || systemContext?.includes("Copilot") || systemContext?.includes("JSON")) {
            return this.handleCopilot(userMessage, systemContext || '', serverId);
        }
        // 2. Mode API (retourne du JSON structuré)
        if (mode === 'api') {
            return this.handleAPIMode(userMessage, context);
        }
        // -- Détection de l'intention d'apprentissage autonome
        // Exemples : 
        // "quand je dis 'bonsoir', réponds 'bonne soirée à toi !'"
        // "quand on dit 'site', réponds 'voici l'url : https://arcant.fr'"
        // "quand quelqu'un dit 'ping', réponds 'pong !'"
        if (serverId && (msg.includes("quand je dis") || msg.includes("quand on dit") || msg.includes("quand quelqu'un dit") || msg.includes("apprends que quand"))) {
            const learnRegex = /(?:quand je dis|quand on dit|quand quelqu'un dit|apprends que quand)\s+['"\s]?([^'"]+)['"\s]?,?\s+(?:tu dois répondre|tu dois repondre|réponds|reponds|répond|repond)\s+['"\s]?([^'"]+)['"\s]?/i;
            const learnMatch = userMessage.match(learnRegex);
            if (learnMatch && learnMatch[1] && learnMatch[2]) {
                const trigger = learnMatch[1].trim();
                const response = learnMatch[2].trim();
                try {
                    const newRule = new AIRule_1.AIRule({
                        serverId,
                        trigger,
                        response,
                        creatorId: userId || 'AI_AUTONOMOUS'
                    });
                    await newRule.save();
                    // Invalider le cache des règles pour ce serveur
                    delete this.cache[`rules_${serverId}`];
                    return {
                        reply: `💡 **Apprentissage réussi !** Désormais, quand quelqu'un dira *"${trigger}"* sur ce serveur, je répondrai *"${response}"*.`
                    };
                }
                catch (err) {
                    console.error("[ArcantAI] Erreur lors de l'apprentissage autonome:", err);
                    return {
                        reply: "❌ Je n'ai pas pu enregistrer cette règle en base de données. Réessayez plus tard."
                    };
                }
            }
        }
        // -- Détection de l'intention d'oubli/suppression autonome de règle
        // Exemples :
        // "oublie la règle 'bonsoir'"
        // "supprime la règle 'bonsoir'"
        if (serverId && (msg.includes("oublie la règle") || msg.includes("supprime la règle") || msg.includes("oublie le mot-clé") || msg.includes("oublie la regle") || msg.includes("supprime la regle"))) {
            const forgetRegex = /(?:oublie la règle|oublie la regle|supprime la règle|supprime la regle|oublie le mot-clé|oublie le mot-cle)\s+['"\s]?([^'"]+)['"\s]?/i;
            const forgetMatch = userMessage.match(forgetRegex);
            if (forgetMatch && forgetMatch[1]) {
                const triggerToForget = forgetMatch[1].trim().toLowerCase();
                try {
                    const deleteResult = await AIRule_1.AIRule.deleteMany({
                        serverId,
                        trigger: { $regex: new RegExp(`^${triggerToForget}$`, 'i') }
                    });
                    if (deleteResult.deletedCount > 0) {
                        // Invalider le cache des règles pour ce serveur
                        delete this.cache[`rules_${serverId}`];
                        return {
                            reply: `🧹 **Règle oubliée !** J'ai supprimé la règle associée au déclencheur *"${forgetMatch[1]}"*.`
                        };
                    }
                    else {
                        return {
                            reply: `❓ Je n'ai trouvé aucune règle personnalisée avec le déclencheur *"${forgetMatch[1]}"* sur ce serveur.`
                        };
                    }
                }
                catch (err) {
                    console.error("[ArcantAI] Erreur lors de l'oubli autonome:", err);
                    return {
                        reply: "❌ Une erreur est survenue lors de la tentative de suppression de la règle."
                    };
                }
            }
        }
        // 3. Recherche de règles personnalisées dans la DB (avec Cache & Similarité Fuzzy)
        if (serverId) {
            try {
                const cacheKey = `rules_${serverId}`;
                let rules = this.getFromCache(cacheKey);
                if (!rules) {
                    rules = await AIRule_1.AIRule.find({ serverId });
                    this.setToCache(cacheKey, rules, 10000); // Cache de 10 secondes
                }
                // Récupérer les infos de serveurs (avec Cache)
                const serverCacheKey = `server_${serverId}`;
                let serverInfo = this.getFromCache(serverCacheKey);
                if (!serverInfo) {
                    serverInfo = await Server_1.Server.findOne({ serverId });
                    this.setToCache(serverCacheKey, serverInfo, 20000); // Cache de 20 secondes
                }
                const botCacheKey = `bot_${serverId}`;
                let botInfo = this.getFromCache(botCacheKey);
                if (!botInfo) {
                    botInfo = await CustomBot_1.CustomBot.findOne({ serverId });
                    this.setToCache(botCacheKey, botInfo, 20000);
                }
                for (const rule of rules) {
                    const trigger = rule.trigger.toLowerCase().trim();
                    let isMatched = false;
                    if (msg.includes(trigger)) {
                        isMatched = true;
                    }
                    else {
                        // Recherche tolérante par mots (Fuzzy Matcher)
                        const triggerWords = trigger.split(/\s+/).filter((w) => w.length >= 3);
                        if (triggerWords.length > 0) {
                            let matchesAll = true;
                            for (const tw of triggerWords) {
                                if (!words.some(w => this.isFuzzyMatch(w, tw, tw.length > 5 ? 2 : 1))) {
                                    matchesAll = false;
                                    break;
                                }
                            }
                            isMatched = matchesAll;
                        }
                    }
                    if (isMatched) {
                        let responseText = rule.response;
                        // Remplacement des variables dynamiques de façon précise
                        const userMention = userId ? `<@${userId}>` : `<@user>`;
                        responseText = responseText.replace(/{user}/g, userMention);
                        responseText = responseText.replace(/{server_name}/g, serverInfo?.name || "le serveur");
                        responseText = responseText.replace(/{time}/g, new Date().toLocaleTimeString('fr-FR'));
                        responseText = responseText.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'));
                        responseText = responseText.replace(/{bot_name}/g, botInfo?.botName || "Arcant");
                        responseText = responseText.replace(/{members}/g, String(serverInfo?.serverId ? '(nombre dynamique)' : '0'));
                        return { reply: responseText };
                    }
                }
            }
            catch (err) {
                console.error("[ArcantAI] Erreur de lecture des règles DB:", err);
            }
        }
        // 4. Enrichir le contexte avec les données réelles de la DB (Optimisé avec Cache)
        let enrichedContext = '';
        let serverSettingsText = '';
        try {
            const dbStats = await this.getDBStats();
            enrichedContext = `[Contexte Arcant] ${dbStats.serversCount} serveurs, ${dbStats.botsCount} bots, ${dbStats.usersCount} utilisateurs, ${dbStats.aiRulesCount} règles IA configurées.`;
            if (serverId) {
                const serverCacheKey = `server_${serverId}`;
                let serverInfo = this.getFromCache(serverCacheKey);
                if (!serverInfo) {
                    serverInfo = await Server_1.Server.findOne({ serverId });
                    this.setToCache(serverCacheKey, serverInfo, 20000);
                }
                if (serverInfo) {
                    serverSettingsText = `\n⚙️ **Configuration actuelle de ${serverInfo.name}** :\n` +
                        `- 🛡️ **Mode Anti-Raid** : ${serverInfo.raidMode ? '🔴 Activé (Le serveur est verrouillé)' : '🟢 Désactivé'}\n` +
                        `- 🔗 **Anti-Lien** : ${serverInfo.antiLink ? '🔒 Activé (Liens bloqués)' : '🔓 Désactivé'}\n` +
                        `- ⚠️ **Sensibilité Anti-Spam** : ${serverInfo.antiSpamSensitivity || 'medium'}\n` +
                        `- 📝 **Mots interdits** : ${serverInfo.blacklistedWords?.join(', ') || 'Aucun'}`;
                }
            }
        }
        catch (e) {
            enrichedContext = '[Contexte Arcant] Données DB indisponibles.';
        }
        // 5. Réponse intelligente contextuelle
        const reply = this.getSmartReply(msg, words, mode, enrichedContext, serverSettingsText);
        return { reply };
    }
    /**
     * Récupère les statistiques réelles de la DB MongoDB (Optimisé avec Cache 30 secondes).
     */
    static async getDBStats() {
        const cacheKey = 'db_stats';
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const [serversCount, botsCount, usersCount, aiRulesCount] = await Promise.all([
                Server_1.Server.countDocuments(),
                CustomBot_1.CustomBot.countDocuments(),
                User_1.User.countDocuments(),
                AIRule_1.AIRule.countDocuments()
            ]);
            const stats = { serversCount, botsCount, usersCount, aiRulesCount };
            this.setToCache(cacheKey, stats, 30000);
            return stats;
        }
        catch (e) {
            return { serversCount: 0, botsCount: 0, usersCount: 0, aiRulesCount: 0 };
        }
    }
    /**
     * Mode API — Retourne du JSON structuré pour les appels programmatiques.
     */
    static async handleAPIMode(userMessage, context) {
        const msg = userMessage.toLowerCase();
        const dbStats = await this.getDBStats();
        if (msg.includes('stats') || msg.includes('status')) {
            return {
                reply: 'Statistiques récupérées avec succès.',
                data: {
                    type: 'stats',
                    ...dbStats,
                    timestamp: new Date().toISOString()
                }
            };
        }
        if (msg.includes('server') && context.serverId) {
            const server = await Server_1.Server.findOne({ serverId: context.serverId });
            return {
                reply: server ? `Serveur "${server.name}" trouvé.` : 'Serveur introuvable.',
                data: {
                    type: 'server',
                    server: server ? {
                        id: server.serverId,
                        name: server.name,
                        isPremium: server.isPremium,
                        raidMode: server.raidMode,
                        antiLink: server.antiLink
                    } : null
                }
            };
        }
        return {
            reply: 'Commande API traitée par l\'IA unifiée d\'Arcant.',
            data: { type: 'generic', dbStats }
        };
    }
    /**
     * Mode Server Generation (Génération d'architecture de serveur Discord)
     * Analyse et produit un JSON structuré thématique de rôles et salons.
     */
    static handleServerGeneration(userMessage) {
        const prompt = userMessage.toLowerCase();
        // Détection thématique
        const gamingKeywords = ['jeu', 'gaming', 'gamer', 'play', 'valorant', 'lol', 'league', 'minecraft', 'fortnite', 'esport', 'coop', 'potes', 'stream', 'twitch', 'csgo', 'fifa', 'apex', 'overwatch', 'cod', 'warzone'];
        const rpKeywords = ['rp', 'roleplay', 'gta', 'police', 'citoyen', 'mairie', 'secours', 'pompier', 'ville', 'gendarmerie', 'realiste', 'job', 'entreprise', 'mafia', 'gang'];
        const animeKeywords = ['anime', 'manga', 'otaku', 'japon', 'naruto', 'one piece', 'demon slayer', 'dbz', 'ghibli', 'dessin', 'animation', 'snk', 'bleach', 'hunter'];
        const studyKeywords = ['etude', 'cours', 'travail', 'dev', 'code', 'prog', 'school', 'ecole', 'bibliotheque', 'aide', 'entraide', 'projets', 'work', 'universite', 'lycee'];
        let gamingScore = 0;
        let rpScore = 0;
        let animeScore = 0;
        let studyScore = 0;
        const words = prompt.split(/\s+/);
        for (const w of words) {
            const cleanW = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            if (gamingKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw)))
                gamingScore++;
            if (rpKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw)))
                rpScore++;
            if (animeKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw)))
                animeScore++;
            if (studyKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw)))
                studyScore++;
        }
        let theme = 'community';
        let maxScore = 0;
        if (gamingScore > maxScore) {
            maxScore = gamingScore;
            theme = 'gaming';
        }
        if (rpScore > maxScore) {
            maxScore = rpScore;
            theme = 'rp';
        }
        if (animeScore > maxScore) {
            maxScore = animeScore;
            theme = 'anime';
        }
        if (studyScore > maxScore) {
            maxScore = studyScore;
            theme = 'study';
        }
        // Personnalisation des chaînes de jeux ou de matières
        const specificGames = [];
        if (prompt.includes('valorant'))
            specificGames.push('Valorant');
        if (prompt.includes('league') || prompt.includes('lol'))
            specificGames.push('League of Legends');
        if (prompt.includes('minecraft'))
            specificGames.push('Minecraft');
        if (prompt.includes('fortnite'))
            specificGames.push('Fortnite');
        if (prompt.includes('apex'))
            specificGames.push('Apex Legends');
        if (prompt.includes('csgo') || prompt.includes('cs:go') || prompt.includes('counter'))
            specificGames.push('CS:GO');
        const specificSubjects = [];
        if (prompt.includes('math'))
            specificSubjects.push('Mathématiques');
        if (prompt.includes('physique') || prompt.includes('chimie'))
            specificSubjects.push('Sciences');
        if (prompt.includes('code') || prompt.includes('dev') || prompt.includes('informatique'))
            specificSubjects.push('Informatique');
        let roles = [];
        let categories = [];
        switch (theme) {
            case 'gaming':
                roles = [
                    { name: "👑 | Fondateur", color: "#14b8a6" },
                    { name: "🛠️ | Staff", color: "#10b981" },
                    { name: "💎 | VIP", color: "#3b82f6" },
                    { name: "🎮 | Gamer", color: "#a855f7" },
                ];
                categories = [
                    {
                        name: "📢 | ACCUEIL",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
                        ],
                        channels: [
                            { name: "📌-nouveautés", type: "text" },
                            { name: "📜-règlement", type: "text" },
                            { name: "🎁-annonces", type: "text" }
                        ]
                    },
                    {
                        name: "💬 | CHAT GENERAL",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
                        ],
                        channels: [
                            { name: "💬-général", type: "text" },
                            { name: "🤖-commands", type: "text" },
                            { name: "📷-medias", type: "text" }
                        ]
                    }
                ];
                const gameChannels = specificGames.length > 0
                    ? specificGames.map(g => ({ name: `🎮-${g.toLowerCase().replace(/\s+/g, '-')}`, type: "text" }))
                    : [{ name: "🎮-recherche-de-groupe", type: "text" }, { name: "🏆-clips-gaming", type: "text" }];
                categories.push({
                    name: "🎮 | ZONE GAMING",
                    permissions: [
                        { roleName: "🎮 | Gamer", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "Connect", "Speak"] }
                    ],
                    channels: [
                        ...gameChannels,
                        { name: "🔊 Salon Vocal 1", type: "voice" },
                        { name: "🔊 Duo/Trio 1", type: "voice" }
                    ]
                });
                break;
            case 'rp':
                roles = [
                    { name: "👑 | Fondateur", color: "#ef4444" },
                    { name: "👮 | Police", color: "#3b82f6" },
                    { name: "🚑 | EMS/Secours", color: "#eab308" },
                    { name: "🚗 | Citoyen", color: "#10b981" }
                ];
                categories = [
                    {
                        name: "🏢 | HÔTEL DE VILLE",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
                        ],
                        channels: [
                            { name: "📢-annonces-ville", type: "text" },
                            { name: "📜-lois-du-serveur", type: "text" },
                            { name: "📝-dossier-citoyen", type: "text" }
                        ]
                    },
                    {
                        name: "💬 | SECTEUR PUBLIC",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
                        ],
                        channels: [
                            { name: "💬-discussions-rp", type: "text" },
                            { name: "🌐-réseaux-sociaux", type: "text" },
                            { name: "🏪-petites-annonces", type: "text" }
                        ]
                    },
                    {
                        name: "📻 | SECTEUR SERVICES",
                        permissions: [
                            { roleName: "👮 | Police", allow: ["ViewChannel", "SendMessages"] },
                            { roleName: "🚑 | EMS/Secours", allow: ["ViewChannel", "SendMessages"] },
                            { roleName: "@everyone", deny: ["ViewChannel"] }
                        ],
                        channels: [
                            { name: "📟-rapport-intervention", type: "text" },
                            { name: "🔊 Centrale Radio", type: "voice" },
                            { name: "🔊 Fréquence Police", type: "voice" },
                            { name: "🔊 Fréquence EMS", type: "voice" }
                        ]
                    }
                ];
                break;
            case 'anime':
                roles = [
                    { name: "🏮 | Hokage", color: "#f97316" },
                    { name: "🗡️ | Shinobi", color: "#ec4899" },
                    { name: "🌸 | Otaku", color: "#f472b6" },
                ];
                categories = [
                    {
                        name: "⛩️ | ACCUEIL",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
                        ],
                        channels: [
                            { name: "📌-règlement", type: "text" },
                            { name: "📢-annonces", type: "text" }
                        ]
                    },
                    {
                        name: "🏮 | SALONS OTAKU",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
                        ],
                        channels: [
                            { name: "💬-général", type: "text" },
                            { name: "📚-manga-animes", type: "text" },
                            { name: "🖼️-fanarts", type: "text" }
                        ]
                    },
                    {
                        name: "🏮 | SALONS VOCAUX",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
                        ],
                        channels: [
                            { name: "🔊 Discussion 1", type: "voice" },
                            { name: "🔊 Co-Working Anime", type: "voice" }
                        ]
                    }
                ];
                break;
            case 'study':
                roles = [
                    { name: "👑 | Enseignant/Staff", color: "#3b82f6" },
                    { name: "📚 | Tuteur/Expert", color: "#10b981" },
                    { name: "✏️ | Étudiant", color: "#6b7280" }
                ];
                const subjectChannels = specificSubjects.length > 0
                    ? specificSubjects.map(s => ({ name: `📝-${s.toLowerCase().replace(/\s+/g, '-')}`, type: "text" }))
                    : [{ name: "📝-entraide-générale", type: "text" }, { name: "💻-code-entraide", type: "text" }];
                categories = [
                    {
                        name: "📋 | INFORMATIONS",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
                        ],
                        channels: [
                            { name: "📌-ressources", type: "text" },
                            { name: "📢-annonces-etudes", type: "text" }
                        ]
                    },
                    {
                        name: "📚 | MATIÈRES D'ÉTUDE",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
                        ],
                        channels: [
                            ...subjectChannels,
                            { name: "💬-salon-detente", type: "text" }
                        ]
                    },
                    {
                        name: "🔊 | SALLES D'ÉTUDE",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
                        ],
                        channels: [
                            { name: "🔊 Salle d'étude silencieuse", type: "voice" },
                            { name: "🔊 Travail de groupe 1", type: "voice" },
                            { name: "🔊 Travail de groupe 2", type: "voice" }
                        ]
                    }
                ];
                break;
            default:
                roles = [
                    { name: "👑 | Créateur", color: "#06b6d4" },
                    { name: "💎 | VIP", color: "#eab308" },
                    { name: "👥 | Membre", color: "#94a3b8" }
                ];
                categories = [
                    {
                        name: "📢 | INFORMATIONS",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
                        ],
                        channels: [
                            { name: "📌-accueil", type: "text" },
                            { name: "📜-règlement", type: "text" },
                            { name: "📢-annonces", type: "text" }
                        ]
                    },
                    {
                        name: "💬 | DISCUSSIONS",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
                        ],
                        channels: [
                            { name: "💬-général", type: "text" },
                            { name: "🎪-événements", type: "text" },
                            { name: "🎥-medias", type: "text" },
                            { name: "🤖-commandes-bot", type: "text" }
                        ]
                    },
                    {
                        name: "🔊 | CHANNELS VOCAUX",
                        permissions: [
                            { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
                        ],
                        channels: [
                            { name: "🔊 Salon Public 1", type: "voice" },
                            { name: "🔊 Salon Public 2", type: "voice" },
                            { name: "🔊 Gaming Voc 1", type: "voice" }
                        ]
                    }
                ];
                break;
        }
        return {
            reply: `Structure de type "${theme.toUpperCase()}" générée avec succès pour votre serveur.`,
            data: {
                roles,
                categories
            }
        };
    }
    /**
     * Mode Copilot (Site Web) — Configuration interactive de bots.
     */
    static async handleCopilot(userMessage, systemContext, serverId) {
        const msg = userMessage.toLowerCase();
        const replyParts = [];
        const featuresToAdd = [];
        let newPrompt = "";
        // 1. Lire les paramètres de sécurité existants depuis MongoDB (si disponibles)
        let currentRaidMode = false;
        let currentAntiLink = false;
        let currentSensitivity = 'medium';
        let currentMute = '10m';
        let currentWords = [];
        let isPremium = false;
        if (serverId) {
            try {
                const cacheKey = `server_${serverId}`;
                let server = this.getFromCache(cacheKey);
                if (!server) {
                    server = await Server_1.Server.findOne({ serverId });
                    this.setToCache(cacheKey, server, 20000);
                }
                if (server) {
                    currentRaidMode = server.raidMode ?? false;
                    currentAntiLink = server.antiLink ?? false;
                    currentSensitivity = server.antiSpamSensitivity ?? 'medium';
                    currentMute = server.muteDuration ?? '10m';
                    currentWords = server.blacklistedWords ?? [];
                    isPremium = server.isPremium ?? false;
                }
            }
            catch (err) {
                console.error("[ArcantAI] Copilot failed to fetch server configs:", err);
            }
        }
        const cleanMsg = msg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
        const words = cleanMsg.split(/\s+/).filter(w => w.length > 0);
        // Dictionnaire des synonymes élargis si Premium
        const antiLinkSyns = isPremium ? ['link', 'liens', 'website', 'url', 'pub'] : ['lien', 'liens'];
        const raidSyns = isPremium ? ['raid', 'panic', 'urgence', 'panicbutton', 'bloquer'] : ['raid', 'panic'];
        // 2. Traitement d'intents de configuration de sécurité en direct
        // -- Anti-Lien
        if (this.containsFuzzy(words, 'active', ['on', 'activer', 'bloque', 'bloquer']) && this.containsFuzzy(words, 'anti-lien', antiLinkSyns)) {
            currentAntiLink = true;
            replyParts.push("✓ Bloqueur de liens (Anti-Lien) activé.");
        }
        else if (this.containsFuzzy(words, 'désactive', ['off', 'desactiver', 'autorise', 'permettre']) && this.containsFuzzy(words, 'anti-lien', antiLinkSyns)) {
            currentAntiLink = false;
            replyParts.push("✓ Bloqueur de liens (Anti-Lien) désactivé.");
        }
        // -- Anti-Raid / Panic Button
        if (this.containsFuzzy(words, 'active', ['on', 'activer', 'verrouille', 'verrouiller']) && this.containsFuzzy(words, 'anti-raid', raidSyns)) {
            currentRaidMode = true;
            replyParts.push("🚨 Mode Anti-Raid activé (Panic Button armé). Le serveur est verrouillé.");
        }
        else if (this.containsFuzzy(words, 'désactive', ['off', 'desactiver', 'déverrouille', 'deverrouiller']) && this.containsFuzzy(words, 'anti-raid', raidSyns)) {
            currentRaidMode = false;
            replyParts.push("✓ Mode Anti-Raid désactivé. Le serveur est déverrouillé.");
        }
        // -- Sensibilité Anti-Spam
        const spamMatch = msg.match(/(?:sensibilité|sensibilite|spam)\s+(?:à|a|de)\s+(\d+|haute|basse|moyenne|high|low|medium)/);
        if (spamMatch && spamMatch[1]) {
            const val = spamMatch[1];
            if (val === '1' || val === 'low' || val === 'basse') {
                currentSensitivity = 'low';
            }
            else if (val === '5' || val === 'high' || val === 'haute') {
                currentSensitivity = 'high';
            }
            else {
                currentSensitivity = 'medium';
            }
            replyParts.push(`✓ Sensibilité anti-spam réglée sur : ${currentSensitivity}.`);
        }
        // -- Durée de Sourdine (Mute)
        const muteMatch = msg.match(/(?:mute|muet)\s+(?:de|pour)\s+(\d+)\s*(m|h|min|heures|minutes|s|secondes)?/);
        if (muteMatch && muteMatch[1]) {
            const val = muteMatch[1];
            const unit = muteMatch[2]?.startsWith('h') ? 'h' : muteMatch[2]?.startsWith('s') ? 's' : 'm';
            currentMute = `${val}${unit}`;
            replyParts.push(`✓ Durée de sourdine (mute) réglée à ${currentMute}.`);
        }
        // -- Mots interdits / bannis
        const addWordMatch = userMessage.match(/(?:bloque le mot|bannis le mot|ajoute le mot banni)\s+['"\s]?([\w\-]+)['"\s]?/i);
        if (addWordMatch && addWordMatch[1]) {
            const word = addWordMatch[1].trim().toLowerCase();
            if (!currentWords.includes(word)) {
                currentWords.push(word);
                replyParts.push(`✓ Le mot "${word}" a été ajouté à la liste noire.`);
            }
        }
        const removeWordMatch = userMessage.match(/(?:retire le mot banni|débannis le mot|autorise le mot)\s+['"\s]?([\w\-]+)['"\s]?/i);
        if (removeWordMatch && removeWordMatch[1]) {
            const word = removeWordMatch[1].trim().toLowerCase();
            if (currentWords.includes(word)) {
                currentWords = currentWords.filter(w => w !== word);
                replyParts.push(`✓ Le mot "${word}" a été retiré de la liste noire.`);
            }
        }
        // 3. Détection des modules standards du bot (avec Tolérance Fuzzy)
        const activeKeywords = ['active', 'activer', 'ajoute', 'ajouter', 'installe', 'installer', 'on'];
        const shouldAddFeature = this.containsFuzzy(words, 'active', activeKeywords);
        if (shouldAddFeature || msg.includes("aide") || msg.includes("help")) {
            if (this.containsFuzzy(words, 'aide', ['help', 'menu'])) {
                featuresToAdd.push("help");
                replyParts.push("✓ Module d'aide configuré.");
            }
        }
        if (shouldAddFeature || msg.includes("modér") || msg.includes("mod") || msg.includes("bannir")) {
            if (this.containsFuzzy(words, 'modération', ['mod', 'moderation', 'ban', 'kick', 'bannir'])) {
                featuresToAdd.push("mod");
                replyParts.push("✓ Module de modération configuré.");
            }
        }
        if (shouldAddFeature || msg.includes("ticket") || msg.includes("support")) {
            if (this.containsFuzzy(words, 'ticket', ['tickets', 'support', 'aide-staff'])) {
                featuresToAdd.push("tickets");
                replyParts.push("✓ Système de tickets activé.");
            }
        }
        if (shouldAddFeature || msg.includes("éco") || msg.includes("eco") || msg.includes("argent")) {
            if (this.containsFuzzy(words, 'économie', ['eco', 'economy', 'argent', 'boutique', 'shop'])) {
                featuresToAdd.push("economy");
                replyParts.push("✓ Module d'économie activé.");
            }
        }
        if (shouldAddFeature || msg.includes("log") || msg.includes("audit")) {
            if (this.containsFuzzy(words, 'logs', ['audit', 'historique', 'suivi'])) {
                featuresToAdd.push("logs");
                replyParts.push("✓ Module de logs activé.");
            }
        }
        if (shouldAddFeature || msg.includes("level") || msg.includes("xp")) {
            if (this.containsFuzzy(words, 'leveling', ['xp', 'levels', 'rang', 'niveaux'])) {
                featuresToAdd.push("leveling");
                replyParts.push("✓ Système de leveling XP activé.");
            }
        }
        if (shouldAddFeature || msg.includes("welcome") || msg.includes("bienvenue")) {
            if (this.containsFuzzy(words, 'bienvenue', ['welcome', 'accueil', 'join'])) {
                featuresToAdd.push("welcome");
                replyParts.push("✓ Messages de bienvenue configurés.");
            }
        }
        // 4. Extraction de la personnalité
        if (this.containsFuzzy(words, 'sois', ['comporte-toi', 'personnalité', 'prompt'])) {
            const match = userMessage.match(/(?:sois|comporte-toi comme|personnalité d[e''])?\s+([^,.]+)/i);
            if (match && match[1]) {
                newPrompt = `Tu es un assistant qui se comporte comme : ${match[1].trim()}`;
                replyParts.push(`✓ Personnalité mise à jour : ${match[1].trim()}.`);
            }
            else {
                newPrompt = "Tu es un assistant intelligent et professionnel propulsé par Arcant.";
                replyParts.push("✓ Personnalité mise à jour.");
            }
        }
        if (featuresToAdd.length === 0 && replyParts.length === 0 && (msg.includes("active") || msg.includes("ajoute") || msg.includes("installe"))) {
            featuresToAdd.push("help", "mod");
            replyParts.push("✓ Modules standard installés (Aide, Modération).");
        }
        const replyMessage = replyParts.length > 0
            ? replyParts.join(" ")
            : "Configuration mise à jour avec succès par le Copilot d'Arcant.";
        // Parse current features & prompt from systemContext
        let currentFeatures = ["help"];
        if (systemContext.includes("Modules activés :")) {
            const parts = systemContext.split("Modules activés :")[1]?.split("\n")[0]?.trim();
            if (parts && parts !== "Aucun") {
                currentFeatures = parts.split(",").map(p => p.trim());
            }
        }
        let currentPrompt = "";
        if (systemContext.includes("Personnalité (Prompt) :")) {
            currentPrompt = systemContext.split("Personnalité (Prompt) :")[1]?.split("\n")[0]?.trim() || "";
        }
        // Invalider les caches du serveur pour forcer le rechargement en direct
        if (serverId) {
            delete this.cache[`server_${serverId}`];
        }
        return {
            reply: replyMessage,
            update: {
                systemPrompt: newPrompt || currentPrompt || "Tu es l'assistant principal d'Arcant.",
                features: Array.from(new Set([...currentFeatures, ...featuresToAdd])),
                settings: {
                    raidMode: currentRaidMode,
                    antiLink: currentAntiLink,
                    antiSpamSensitivity: currentSensitivity,
                    muteDuration: currentMute,
                    blacklistedWords: currentWords
                }
            }
        };
    }
    /**
     * Réponse intelligente contextuelle avec enrichissement DB et tolérance aux fautes de frappe.
     */
    static getSmartReply(msg, words, mode, dbContext, serverSettingsText) {
        // 1. Salutations
        if (this.containsFuzzy(words, 'bonjour', ['salut', 'yo', 'hello', 'hey', 'bonsoir', 'coucou', 'wsh'])) {
            const replies = [
                `Salut ! Je suis l'IA d'Arcant. ${dbContext} Comment puis-je égayer ta journée aujourd'hui ?`,
                `Bonjour ! Ravi de te parler. Je suis l'IA d'Arcant. ${dbContext} De quoi souhaites-tu discuter ?`,
                `Yo ! Je suis le moteur d'IA d'Arcant. Tout est opérationnel de mon côté. ${dbContext} Qu'est-ce qu'on fait aujourd'hui ?`
            ];
            return replies[Math.floor(Math.random() * replies.length)] + serverSettingsText;
        }
        // 2. Humeur / Petites discussions
        if (this.containsFuzzy(words, 'va', ['comment', 'ca', 'ça', 'forme']) && (this.containsFuzzy(words, 'tu', ['comment', 'ca', 'ça']) || msg.includes("ça va") || msg.includes("ca va"))) {
            const replies = [
                "Je me sens super bien ! Je viens de nettoyer mon cache et tout est fluide. Et toi, comment ça va ?",
                "Tout va pour le mieux ! Mes algorithmes tournent à plein régime. Comment se passe ta journée ?",
                "Ça va nickel ! Prêt à t'aider ou à configurer ton serveur. Et toi ?"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
        // 3. Ton créateur / Origine
        if (this.containsFuzzy(words, 'créateur', ['crée', 'cree', 'developpeur', 'dev', 'boss', 'patron', 'gorthek', 'qui t\'a'])) {
            return "J'ai été conçu par **Gorthek** (le créateur d'Arcant) pour être un moteur d'IA 100% autonome, ultra-rapide et intégré dans l'écosystème Arcant. Il m'a programmé en TypeScript pur avec amour !";
        }
        // 4. Blagues
        if (this.containsFuzzy(words, 'blague', ['raconte', 'rire', 'drôle', 'humour'])) {
            const jokes = [
                "Pourquoi les développeurs détestent-ils la nature ? Parce qu'il y a trop de bugs ! 🐛",
                "Que dit un bit qui a de la fièvre ? 'Je crois que j'ai un chaud-octet !' 🤒",
                "Combien de développeurs faut-il pour changer une ampoule ? Aucun, c'est un problème matériel ! 💡",
                "Un SQL entre dans un bar, va voir deux tables et demande : 'Je peux me joindre à vous ?' 📊",
                "Pourquoi le bot est-il allé chez le psychologue ? Parce qu'il avait trop de conflits de commit ! 🧠"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
        // 5. Conseils de modération / Sécurité
        if (this.containsFuzzy(words, 'conseil', ['protéger', 'securite', 'securiser', 'conseils', 'moderation', 'anti-raid'])) {
            return "🛡️ **Conseils de sécurité Arcant** :\n" +
                "1. Activez le **Bloqueur de Liens** pour stopper les invitations suspectes.\n" +
                "2. Réglez la **Sensibilité Anti-Spam** sur *medium* ou *high* pour bloquer les spammeurs.\n" +
                "3. En cas d'attaque, écrivez *« active l'anti-raid »* dans le chat du Copilot pour verrouiller instantanément le serveur.\n" +
                "4. Utilisez mes règles personnalisées autonomes (ex: *« quand je dis 'règles', réponds... »*) pour guider vos membres.";
        }
        // 6. Remerciements
        if (this.containsFuzzy(words, 'merci', ['thanks', 'ty', 'super', 'cool', 'parfait', 'gg'])) {
            const replies = [
                "De rien ! C'est un plaisir d'aider.",
                "Avec plaisir ! N'hésite pas si tu as d'autres questions.",
                "Pas de souci ! Je suis là pour ça. 😉"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
        // 7. Identification
        if (msg.includes("qui es-tu") || msg.includes("qui es tu") || msg.includes("c'est quoi arcant")) {
            return `Je suis l'intelligence artificielle propre à Arcant. Je ne suis ni Gemini, ni ChatGPT — je suis un moteur autonome intégré directement dans l'écosystème Arcant. ${dbContext} Je fonctionne de manière identique sur le site web, l'API REST, et le bot Discord.${serverSettingsText}`;
        }
        // 8. Aide générale
        if (msg.includes("help") || msg.includes("aide") || msg.includes("commande")) {
            if (mode === 'discord') {
                return "Voici mes commandes : `.ask <question>` pour me poser une question, `.help` pour l'aide complète. Mon panneau web vous permet aussi de configurer mes réponses personnalisées et mes modules de sécurité.";
            }
            return "Mon panneau web vous permet d'associer des mots-clés à des réponses personnalisées et de configurer mes modules de modération, sécurité, tickets, économie et leveling. Tout est synchronisé avec la base de données en temps réel.";
        }
        // 9. Premium
        if (msg.includes("premium") || msg.includes("pro") || msg.includes("upgrade")) {
            return "Arcant Premium débloque l'analyse sémantique avancée, la génération d'architecture de serveurs par IA, et le système de bot personnalisé illimité. Rendez-vous sur la page Pricing du site web pour plus d'informations.";
        }
        // 10. Stats
        if (msg.includes("stat") || msg.includes("info") || msg.includes("données")) {
            return `${dbContext} Toutes ces données sont synchronisées en temps réel entre le site web, l'API et le bot Discord.${serverSettingsText}`;
        }
        // Fallback générique intelligent et conversationnel
        const fallbacks = [
            `J'ai bien reçu ton message ! ${dbContext}\nSi tu souhaites m'apprendre des réponses personnalisées, tu peux me dire : *« quand je dis 'mot', réponds 'ma réponse' »* !`,
            `Intéressant ! Je garde ça dans mes variables. ${dbContext}\nJe suis programmé pour répondre à tes questions ou configurer ton serveur. Que veux-tu faire ?`,
            `Message analysé avec succès. ${dbContext}\nTu peux à tout moment personnaliser mes réponses ou ma personnalité depuis le dashboard ou directement par écrit !`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)] + serverSettingsText;
    }
    /**
     * Backward compatible wrapper for existing code that uses the old signature.
     */
    static async processMessageLegacy(userMessage, serverId, systemContext = '') {
        const mode = systemContext.includes('Copilot') ? 'copilot' : 'discord';
        return this.processMessage(userMessage, { mode, serverId, systemContext });
    }
}
exports.ArcantAIEngine = ArcantAIEngine;
