"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localAI = exports.LocalAIClient = void 0;
const genai_1 = require("@google/genai");
/**
 * LocalAIClient (Maintenant propulsé par Gemini)
 * Gère l'interfaçage avec l'API Gemini de Google.
 */
class LocalAIClient {
    ai = null;
    model = 'gemini-2.5-flash'; // Modèle rapide, peu coûteux en tokens
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.ai = new genai_1.GoogleGenAI({ apiKey });
        }
        else {
            console.warn("[LocalAI] Attention : Aucune GEMINI_API_KEY trouvée dans le .env du bot !");
        }
    }
    /**
     * Génère une réponse via Gemini.
     */
    async generateResponse(prompt, systemContext = '') {
        if (!this.ai) {
            console.error("[LocalAI] Impossible de générer la réponse : Client non initialisé (Clé manquante ?)");
            return '{"error": "API Key missing"}';
        }
        try {
            console.log(`[LocalAI] Requête envoyée à Gemini (${this.model})`);
            const response = await this.ai.models.generateContent({
                model: this.model,
                contents: prompt,
                config: {
                    systemInstruction: systemContext,
                    responseMimeType: "application/json", // Force la sortie JSON pour éviter que l'IA ne bave du markdown
                }
            });
            return response.text || "{}";
        }
        catch (error) {
            console.error('[LocalAI] Erreur de génération avec Gemini:', error);
            return "{}";
        }
    }
}
exports.LocalAIClient = LocalAIClient;
exports.localAI = new LocalAIClient();
//# sourceMappingURL=LocalAIClient.js.map