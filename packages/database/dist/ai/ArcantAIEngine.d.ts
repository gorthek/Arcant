export declare class ArcantAIEngine {
    /**
     * Analyse et génère une réponse pour le Bot Discord, l'API ou le Site Web.
     */
    static processMessage(userMessage: string, serverId?: string, systemContext?: string): Promise<{
        reply: string;
        update?: any;
    }>;
    private static handleCopilot;
    private static getFallbackReply;
}
