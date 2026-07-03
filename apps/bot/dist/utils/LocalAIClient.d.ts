export declare class LocalAIClient {
    constructor();
    /**
     * Analyse un message utilisateur et génère une réponse en appelant le moteur unifié.
     */
    generateResponse(prompt: string, systemContext?: string, serverId?: string): Promise<string>;
}
export declare const localAI: LocalAIClient;
//# sourceMappingURL=LocalAIClient.d.ts.map