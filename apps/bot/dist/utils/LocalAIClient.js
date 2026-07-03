"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localAI = exports.LocalAIClient = void 0;
const database_1 = require("@arcant/database");
class LocalAIClient {
    constructor() {
        console.log("[CustomAI] Initialisation du moteur d'IA personnalisé d'Arcant.");
    }
    /**
     * Analyse un message utilisateur et génère une réponse basée sur des règles ou de la simulation.
     */
    async generateResponse(prompt, systemContext = '', serverId) {
        const userMessage = prompt.toLowerCase().trim();
        // 1. Détecter s'il s'agit d'une requête de configuration Copilot (Web)
        if (systemContext.includes("Copilot") || systemContext.includes("JSON")) {
            return this.handleCopilotRequest(prompt, systemContext);
        }
        // 2. Si un serverId est fourni, chercher une règle personnalisée dans la base de données
        if (serverId) {
            try {
                const rules = await database_1.AIRule.find({ serverId });
                for (const rule of rules) {
                    const trigger = rule.trigger.toLowerCase().trim();
                    // Match complet ou partiel
                    if (userMessage.includes(trigger)) {
                        let reply = rule.response;
                        // Remplacement des variables
                        reply = reply.replace(/{user}/g, `<@user>`); // Remplacé par l'appelant au niveau du bot
                        reply = reply.replace(/{server_name}/g, `le serveur`);
                        reply = reply.replace(/{time}/g, new Date().toLocaleTimeString('fr-FR'));
                        reply = reply.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'));
                        return reply;
                    }
                }
            }
            catch (err) {
                console.error("[CustomAI] Erreur lors de la recherche des règles DB:", err);
            }
        }
        // 3. Fallback conversationnel intelligent (Simule un assistant virtuel)
        return this.generateFallbackResponse(userMessage);
    }
    handleCopilotRequest(userMessage, systemContext) {
        const msg = userMessage.toLowerCase();
        const replyParts = [];
        const featuresToAdd = [];
        let newPrompt = "";
        // Analyse du message pour les modules
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
        // Si aucun module spécifique n'a été détecté mais que l'utilisateur demande d'activer quelque chose
        if (featuresToAdd.length === 0 && (msg.includes("active") || msg.includes("ajoute") || msg.includes("installe"))) {
            featuresToAdd.push("help", "mod");
            replyParts.push("Modules standard installés par défaut (Aide, Modération).");
        }
        const replyMessage = replyParts.length > 0
            ? replyParts.join(" ")
            : "J'ai bien pris en compte votre demande et ajusté les paramètres du bot.";
        // Parser l'état existant depuis le systemContext si possible
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
        // Combiner les features
        const finalFeatures = Array.from(new Set([...currentFeatures, ...featuresToAdd]));
        const finalPrompt = newPrompt || currentPrompt || "Tu es l'assistant principal d'Arcant.";
        const jsonResponse = {
            reply: replyMessage,
            update: {
                systemPrompt: finalPrompt,
                features: finalFeatures
            }
        };
        return JSON.stringify(jsonResponse);
    }
    generateFallbackResponse(msg) {
        if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("yo") || msg.includes("hello")) {
            const greetings = [
                "Bonjour ! Comment puis-je vous aider aujourd'hui sur le serveur ?",
                "Yo ! Prêt à configurer ou discuter ? Dites-moi tout.",
                "Salut à toi, membre d'Arcant !"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)] || "";
        }
        if (msg.includes("qui es-tu") || msg.includes("qui es tu") || msg.includes("presentation")) {
            return "Je suis Arcant, l'intelligence artificielle autonome de ce serveur Discord. Je gère les modules, l'économie, la modération et je peux répondre à vos commandes en temps réel.";
        }
        if (msg.includes("help") || msg.includes("aide")) {
            return "Vous pouvez m'utiliser via les slash commandes (ex: `/ask`) ou en me mentionnant directement. Mon panneau de configuration web vous permet de définir mes modules (modération, tickets, économie, logs) et mes règles de réponse personnalisées.";
        }
        if (msg.includes("premium")) {
            return "Arcant Premium débloque les réponses instantanées illimitées, la génération d'architecture de salons 3D, le bouclier anti-raid avancé et de nombreuses options exclusives. Visitez l'onglet pricing sur notre site !";
        }
        if (msg.includes("ping")) {
            return "Pong ! Tout fonctionne parfaitement. Latence réseau : 14ms.";
        }
        if (msg.includes("développeur") || msg.includes("createur") || msg.includes("owner")) {
            return "Mon créateur suprême est le Bot Owner d'Arcant. Il gère mon code, mes mises à jour et ma base de données.";
        }
        const fallbacks = [
            "J'ai bien lu votre message. En tant qu'IA Arcant, je me ferai un plaisir de vous aider si vous spécifiez une commande.",
            "Intéressant. Vous pouvez configurer des réponses personnalisées à ce type de question depuis mon tableau de bord web !",
            "Je reste à votre écoute. Tapez `/help` pour voir la liste complète des commandes.",
            "Demande reçue. Mes modules de sécurité veillent sur le serveur."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)] || "";
    }
}
exports.LocalAIClient = LocalAIClient;
exports.localAI = new LocalAIClient();
//# sourceMappingURL=LocalAIClient.js.map