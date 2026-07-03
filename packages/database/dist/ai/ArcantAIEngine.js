"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcantAIEngine = void 0;
const AIRule_1 = require("../models/AIRule");
const Server_1 = require("../models/Server");
const CustomBot_1 = require("../models/CustomBot");
class ArcantAIEngine {
    /**
     * Analyse et génère une réponse pour le Bot Discord, l'API ou le Site Web.
     */
    static async processMessage(userMessage, serverId, systemContext = '') {
        const msg = userMessage.toLowerCase().trim();
        // 1. Si c'est le Copilot de configuration (depuis l'API ou le site Web)
        if (systemContext.includes("Copilot") || systemContext.includes("JSON")) {
            return this.handleCopilot(userMessage, systemContext);
        }
        // 2. Recherche de règles personnalisées dans la DB si serverId est fourni
        if (serverId) {
            try {
                const rules = await AIRule_1.AIRule.find({ serverId });
                for (const rule of rules) {
                    const trigger = rule.trigger.toLowerCase().trim();
                    if (msg.includes(trigger)) {
                        let responseText = rule.response;
                        // Chercher les stats du serveur pour les variables dynamiques
                        const serverInfo = await Server_1.Server.findOne({ serverId });
                        const botInfo = await CustomBot_1.CustomBot.findOne({ serverId });
                        // Remplacement des variables
                        responseText = responseText.replace(/{user}/g, `<@user>`);
                        responseText = responseText.replace(/{server_name}/g, serverInfo?.name || "le serveur");
                        responseText = responseText.replace(/{time}/g, new Date().toLocaleTimeString('fr-FR'));
                        responseText = responseText.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'));
                        responseText = responseText.replace(/{bot_name}/g, botInfo?.botName || "Arcant");
                        return { reply: responseText };
                    }
                }
            }
            catch (err) {
                console.error("[ArcantAI] Erreur de lecture des règles DB:", err);
            }
        }
        // 3. Fallback conversationnel intelligent d'Arcant
        const reply = this.getFallbackReply(msg);
        return { reply };
    }
    static handleCopilot(userMessage, systemContext) {
        const msg = userMessage.toLowerCase();
        const replyParts = [];
        const featuresToAdd = [];
        let newPrompt = "";
        // Détection des modules
        if (msg.includes("aide") || msg.includes("help")) {
            featuresToAdd.push("help");
            replyParts.push("Module d'aide configuré.");
        }
        if (msg.includes("modér") || msg.includes("mod") || msg.includes("bannir") || msg.includes("kick")) {
            featuresToAdd.push("mod");
            replyParts.push("Module de modération configuré pour surveiller le chat.");
        }
        if (msg.includes("ticket") || msg.includes("support")) {
            featuresToAdd.push("tickets");
            replyParts.push("Système de tickets de support activé.");
        }
        if (msg.includes("éco") || msg.includes("eco") || msg.includes("argent") || msg.includes("boutique")) {
            featuresToAdd.push("economy");
            replyParts.push("Module d'économie et de récompenses activé.");
        }
        if (msg.includes("log") || msg.includes("audit") || msg.includes("historique")) {
            featuresToAdd.push("logs");
            replyParts.push("Module de logs de sécurité activé.");
        }
        // Extraction de la personnalité
        if (msg.includes("sois") || msg.includes("comporte-toi") || msg.includes("personnalité") || msg.includes("prompt")) {
            const match = userMessage.match(/(?:sois|comporte-toi comme|personnalité d[e'’])\s+([^,.]+)/i);
            if (match && match[1]) {
                newPrompt = `Tu es un assistant qui se comporte comme : ${match[1].trim()}`;
                replyParts.push(`Personnalité mise à jour : ${match[1].trim()}.`);
            }
            else {
                newPrompt = "Tu es un assistant drôle et sarcastique.";
                replyParts.push("Personnalité mise à jour en mode drôle.");
            }
        }
        if (featuresToAdd.length === 0 && (msg.includes("active") || msg.includes("ajoute") || msg.includes("installe"))) {
            featuresToAdd.push("help", "mod");
            replyParts.push("Modules standard installés par défaut (Aide, Modération).");
        }
        const replyMessage = replyParts.length > 0
            ? replyParts.join(" ")
            : "Paramètres mis à jour avec succès.";
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
    static getFallbackReply(msg) {
        if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("yo") || msg.includes("hello")) {
            return "Bonjour ! Je suis l'IA unifiée d'Arcant. Comment puis-je vous aider ?";
        }
        if (msg.includes("qui es-tu") || msg.includes("qui es tu")) {
            return "Je suis Arcant, l'intelligence artificielle autonome reliée à ce site web, à l'API, au bot et à la base de données.";
        }
        if (msg.includes("help") || msg.includes("aide")) {
            return "Mon panneau web vous permet d'associer des mots-clés à des réponses personnalisées et de configurer mes modules de modération et sécurité.";
        }
        if (msg.includes("premium")) {
            return "Arcant Premium débloque l'analyse sémantique illimitée et la génération d'architecture de serveurs 3D.";
        }
        return "Message bien reçu par l'IA unifiée d'Arcant. Configurez mes réponses de serveurs depuis le tableau de bord web !";
    }
}
exports.ArcantAIEngine = ArcantAIEngine;
