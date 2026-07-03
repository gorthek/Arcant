/**
 * LocalAIClient (Maintenant propulsé par Gemini)
 * Gère l'interfaçage avec l'API Gemini de Google.
 */
export declare class LocalAIClient {
    private ai;
    private model;
    constructor();
    /**
     * Génère une réponse via Gemini.
     */
    generateResponse(prompt: string, systemContext?: string): Promise<string>;
}
export declare const localAI: LocalAIClient;
//# sourceMappingURL=LocalAIClient.d.ts.map