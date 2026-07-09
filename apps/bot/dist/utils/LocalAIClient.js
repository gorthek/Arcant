"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localAI = exports.LocalAIClient = void 0;
const database_1 = require("@arcant/database");
class LocalAIClient {
    constructor() {
        console.log("[CustomAI] Initialisation du moteur d'IA personnalisé d'Arcant (Bot Proxy).");
    }
    /**
     * Analyse un message utilisateur et génère une réponse en appelant le moteur unifié.
     */
    async generateResponse(prompt, systemContext = '', serverId) {
        // Détermine le mode depuis le contexte
        const isServerGen = systemContext.includes("architecte") || systemContext.includes("categories");
        const isCopilot = !isServerGen && (systemContext.includes("Copilot") || systemContext.includes("JSON"));
        const mode = isServerGen ? 'server_generation' : isCopilot ? 'copilot' : 'discord';
        // Appel du moteur d'IA unifié partagé avec la nouvelle API
        const result = await database_1.ArcantAIEngine.processMessage(prompt, {
            mode,
            serverId,
            systemContext
        });
        // Si c'est de la génération de serveur, on renvoie directement l'objet data sérialisé
        if (isServerGen) {
            return JSON.stringify(result.data || {});
        }
        // Si c'est un format Copilot, on renvoie la structure sous forme de chaîne JSON
        if (isCopilot) {
            return JSON.stringify({
                reply: result.reply,
                update: result.update
            });
        }
        return result.reply;
    }
    /**
     * Analyse un message et renvoie le payload d'action et de mise à jour complet.
     */
    async generateResponseWithAction(prompt, systemContext = '', serverId, userId) {
        const isServerGen = systemContext.includes("architecte") || systemContext.includes("categories");
        const isCopilot = !isServerGen && (systemContext.includes("Copilot") || systemContext.includes("JSON"));
        const mode = isServerGen ? 'server_generation' : isCopilot ? 'copilot' : 'discord';
        const result = await database_1.ArcantAIEngine.processMessage(prompt, {
            mode,
            serverId,
            systemContext,
            userId
        });
        return result;
    }
}
exports.LocalAIClient = LocalAIClient;
exports.localAI = new LocalAIClient();
//# sourceMappingURL=LocalAIClient.js.map