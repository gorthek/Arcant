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
        const isCopilot = systemContext.includes("Copilot") || systemContext.includes("JSON");
        const mode = isCopilot ? 'copilot' : 'discord';
        // Appel du moteur d'IA unifié partagé avec la nouvelle API
        const result = await database_1.ArcantAIEngine.processMessage(prompt, {
            mode,
            serverId,
            systemContext
        });
        // Si c'est un format Copilot, on renvoie la structure sous forme de chaîne JSON
        if (isCopilot) {
            return JSON.stringify({
                reply: result.reply,
                update: result.update
            });
        }
        return result.reply;
    }
}
exports.LocalAIClient = LocalAIClient;
exports.localAI = new LocalAIClient();
//# sourceMappingURL=LocalAIClient.js.map