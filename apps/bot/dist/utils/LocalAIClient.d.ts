/**
 * LocalAIClient
 * Gère l'interfaçage avec un LLM local (ex: Ollama, Llama.cpp)
 */
export declare class LocalAIClient {
    private apiUrl;
    private model;
    constructor(apiUrl?: string, model?: string);
    /**
     * Génère une réponse via l'IA locale.
     * Si l'API n'est pas disponible (ex: serveur sans GPU ou Ollama non lancé),
     * on utilise un fallback basique pour la démo.
     */
    generateResponse(prompt: string, systemContext?: string): Promise<string>;
}
export declare const localAI: LocalAIClient;
//# sourceMappingURL=LocalAIClient.d.ts.map