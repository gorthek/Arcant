"use strict";
/**
 * LocalAIClient
 * Gère l'interfaçage avec un LLM local (ex: Ollama, Llama.cpp)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localAI = exports.LocalAIClient = void 0;
class LocalAIClient {
    apiUrl;
    model;
    constructor(apiUrl = 'http://localhost:11434', model = 'llama3') {
        this.apiUrl = apiUrl;
        this.model = model;
    }
    /**
     * Génère une réponse via l'IA locale.
     * Si l'API n'est pas disponible (ex: serveur sans GPU ou Ollama non lancé),
     * on utilise un fallback basique pour la démo.
     */
    async generateResponse(prompt, systemContext = '') {
        try {
            // NOTE: Remplacer par un vrai appel API (ex: fetch) vers Ollama
            // const response = await fetch(`${this.apiUrl}/api/generate`, { ... });
            console.log(`[LocalAI] Requête reçue pour le modèle ${this.model}`);
            // Simulation pour l'instant
            return `Je suis l'IA locale d'Arcant. (Contexte: ${systemContext ? 'Personnalisé' : 'Standard'})\nVous avez dit : "${prompt}"`;
        }
        catch (error) {
            console.error('[LocalAI] Erreur de génération:', error);
            return "Erreur du système IA local.";
        }
    }
}
exports.LocalAIClient = LocalAIClient;
exports.localAI = new LocalAIClient();
//# sourceMappingURL=LocalAIClient.js.map