export declare class LocalAIClient {
    constructor();
    /**
     * Analyse un message utilisateur et génère une réponse en appelant le moteur unifié.
     */
    generateResponse(prompt: string, systemContext?: string, serverId?: string): Promise<string>;
    /**
     * Analyse un message et renvoie le payload d'action et de mise à jour complet.
     */
    generateResponseWithAction(prompt: string, systemContext?: string, serverId?: string, userId?: string): Promise<{
        reply: string;
        update?: any;
        data?: any;
    }>;
}
export declare const localAI: LocalAIClient;
//# sourceMappingURL=LocalAIClient.d.ts.map