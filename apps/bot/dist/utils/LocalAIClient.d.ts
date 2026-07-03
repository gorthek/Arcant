export declare class LocalAIClient {
    constructor();
    /**
     * Analyse un message utilisateur et génère une réponse basée sur des règles ou de la simulation.
     */
    generateResponse(prompt: string, systemContext?: string, serverId?: string): Promise<string>;
    private handleCopilotRequest;
    private generateFallbackResponse;
}
export declare const localAI: LocalAIClient;
//# sourceMappingURL=LocalAIClient.d.ts.map