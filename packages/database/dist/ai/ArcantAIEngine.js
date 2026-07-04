"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcantAIEngine = void 0;
const AIRule_1 = require("../models/AIRule");
const Server_1 = require("../models/Server");
const CustomBot_1 = require("../models/CustomBot");
const User_1 = require("../models/User");
class ArcantAIEngine {
    /**
     * Analyse et génère une réponse unifiée pour le Bot Discord, l'API ou le Site Web.
     * L'IA est propre à Arcant — aucune dépendance externe (pas de Gemini, pas d'OpenAI).
     * Elle utilise un moteur de règles intelligent avec détection de patterns avancés.
     */
    static async processMessage(userMessage, context) {
        const msg = userMessage.toLowerCase().trim();
        const { mode, serverId, systemContext } = context;
        // 1. Mode Copilot (Site Web - Configuration interactive)
        if (mode === 'copilot' || systemContext?.includes("Copilot") || systemContext?.includes("JSON")) {
            return this.handleCopilot(userMessage, systemContext || '');
        }
        // 2. Mode API (retourne du JSON structuré)
        if (mode === 'api') {
            return this.handleAPIMode(userMessage, context);
        }
        // 3. Recherche de règles personnalisées dans la DB
        if (serverId) {
            try {
                const rules = await AIRule_1.AIRule.find({ serverId });
                for (const rule of rules) {
                    const trigger = rule.trigger.toLowerCase().trim();
                    if (msg.includes(trigger)) {
                        let responseText = rule.response;
                        const serverInfo = await Server_1.Server.findOne({ serverId });
                        const botInfo = await CustomBot_1.CustomBot.findOne({ serverId });
                        // Remplacement des variables dynamiques
                        responseText = responseText.replace(/{user}/g, `<@user>`);
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
        // 4. Enrichir le contexte avec les données réelles de la DB
        let enrichedContext = '';
        try {
            const dbStats = await this.getDBStats();
            enrichedContext = `[Contexte Arcant] ${dbStats.serversCount} serveurs, ${dbStats.botsCount} bots, ${dbStats.usersCount} utilisateurs, ${dbStats.aiRulesCount} règles IA configurées.`;
        }
        catch (e) {
            enrichedContext = '[Contexte Arcant] Données DB indisponibles.';
        }
        // 5. Réponse intelligente contextuelle
        const reply = this.getSmartReply(msg, mode, enrichedContext);
        return { reply };
    }
    /**
     * Récupère les statistiques réelles de la DB MongoDB.
     */
    static async getDBStats() {
        try {
            const [serversCount, botsCount, usersCount, aiRulesCount] = await Promise.all([
                Server_1.Server.countDocuments(),
                CustomBot_1.CustomBot.countDocuments(),
                User_1.User.countDocuments(),
                AIRule_1.AIRule.countDocuments()
            ]);
            return { serversCount, botsCount, usersCount, aiRulesCount };
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
     * Mode Copilot (Site Web) — Configuration interactive de bots.
     */
    static handleCopilot(userMessage, systemContext) {
        const msg = userMessage.toLowerCase();
        const replyParts = [];
        const featuresToAdd = [];
        let newPrompt = "";
        // Détection des modules
        if (msg.includes("aide") || msg.includes("help")) {
            featuresToAdd.push("help");
            replyParts.push("✓ Module d'aide configuré.");
        }
        if (msg.includes("modér") || msg.includes("mod") || msg.includes("bannir") || msg.includes("kick")) {
            featuresToAdd.push("mod");
            replyParts.push("✓ Module de modération configuré.");
        }
        if (msg.includes("ticket") || msg.includes("support")) {
            featuresToAdd.push("tickets");
            replyParts.push("✓ Système de tickets activé.");
        }
        if (msg.includes("éco") || msg.includes("eco") || msg.includes("argent") || msg.includes("boutique")) {
            featuresToAdd.push("economy");
            replyParts.push("✓ Module d'économie activé.");
        }
        if (msg.includes("log") || msg.includes("audit") || msg.includes("historique")) {
            featuresToAdd.push("logs");
            replyParts.push("✓ Module de logs activé.");
        }
        if (msg.includes("level") || msg.includes("xp") || msg.includes("rang")) {
            featuresToAdd.push("leveling");
            replyParts.push("✓ Système de leveling XP activé.");
        }
        if (msg.includes("welcome") || msg.includes("bienvenue") || msg.includes("accueil")) {
            featuresToAdd.push("welcome");
            replyParts.push("✓ Messages de bienvenue configurés.");
        }
        // Extraction de la personnalité
        if (msg.includes("sois") || msg.includes("comporte-toi") || msg.includes("personnalité") || msg.includes("prompt")) {
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
        if (featuresToAdd.length === 0 && (msg.includes("active") || msg.includes("ajoute") || msg.includes("installe"))) {
            featuresToAdd.push("help", "mod");
            replyParts.push("✓ Modules standard installés (Aide, Modération).");
        }
        const replyMessage = replyParts.length > 0
            ? replyParts.join(" ")
            : "Configuration mise à jour avec succès par l'IA Arcant.";
        // Parse current state from context
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
        return {
            reply: replyMessage,
            update: {
                systemPrompt: newPrompt || currentPrompt || "Tu es l'assistant principal d'Arcant.",
                features: Array.from(new Set([...currentFeatures, ...featuresToAdd]))
            }
        };
    }
    /**
     * Réponse intelligente contextuelle avec enrichissement DB.
     */
    static getSmartReply(msg, mode, dbContext) {
        // Salutations
        if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("yo") || msg.includes("hello") || msg.includes("hey")) {
            return `Bonjour ! Je suis l'IA d'Arcant, le moteur unifié qui propulse le site web, l'API, le bot Discord et la base de données. ${dbContext} Comment puis-je vous aider ?`;
        }
        // Identification
        if (msg.includes("qui es-tu") || msg.includes("qui es tu") || msg.includes("c'est quoi arcant")) {
            return `Je suis l'intelligence artificielle propre à Arcant. Je ne suis ni Gemini, ni ChatGPT — je suis un moteur autonome intégré directement dans l'écosystème Arcant. ${dbContext} Je fonctionne de manière identique sur le site web, l'API REST, et le bot Discord.`;
        }
        // Aide
        if (msg.includes("help") || msg.includes("aide") || msg.includes("commande")) {
            if (mode === 'discord') {
                return "Voici mes commandes : `.ask <question>` pour me poser une question, `.help` pour l'aide complète. Mon panneau web vous permet aussi de configurer mes réponses personnalisées et mes modules de sécurité.";
            }
            return "Mon panneau web vous permet d'associer des mots-clés à des réponses personnalisées et de configurer mes modules de modération, sécurité, tickets, économie et leveling. Tout est synchronisé avec la base de données en temps réel.";
        }
        // Premium
        if (msg.includes("premium") || msg.includes("pro") || msg.includes("upgrade")) {
            return "Arcant Premium débloque l'analyse sémantique avancée, la génération d'architecture de serveurs par IA, et le système de bot personnalisé illimité. Rendez-vous sur la page Pricing du site web pour plus d'informations.";
        }
        // Stats
        if (msg.includes("stat") || msg.includes("info") || msg.includes("données")) {
            return `${dbContext} Toutes ces données sont synchronisées en temps réel entre le site web, l'API et le bot Discord.`;
        }
        // Sécurité
        if (msg.includes("sécurité") || msg.includes("raid") || msg.includes("protection") || msg.includes("anti")) {
            return "Le module de sécurité d'Arcant inclut : Anti-Raid (Panic Button), Captcha par MP, Anti-Lien, Anti-Selfbot, Scanner d'âge de compte, Limite de mentions, et Protection Staff anti-mass ban. Tout est configurable depuis le dashboard.";
        }
        // Fallback générique
        return `Message bien reçu par l'IA unifiée d'Arcant. ${dbContext} Configurez mes réponses personnalisées depuis le tableau de bord web !`;
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
