export type AIContextMode = 'site' | 'discord' | 'api' | 'copilot';
interface AIContext {
    mode: AIContextMode;
    serverId?: string | undefined;
    userId?: string | undefined;
    systemContext?: string | undefined;
    dbStats?: {
        serversCount: number;
        botsCount: number;
        usersCount: number;
        aiRulesCount: number;
    } | undefined;
}
export declare class ArcantAIEngine {
    /**
     * Analyse et génère une réponse unifiée pour le Bot Discord, l'API ou le Site Web.
     * L'IA est propre à Arcant — aucune dépendance externe (pas de Gemini, pas d'OpenAI).
     * Elle utilise un moteur de règles intelligent avec détection de patterns avancés.
     */
    static processMessage(userMessage: string, context: AIContext): Promise<{
        reply: string;
        update?: any;
        data?: any;
    }>;
    /**
     * Récupère les statistiques réelles de la DB MongoDB.
     */
    static getDBStats(): Promise<{
        serversCount: number;
        botsCount: number;
        usersCount: number;
        aiRulesCount: number;
    }>;
    /**
     * Mode API — Retourne du JSON structuré pour les appels programmatiques.
     */
    private static handleAPIMode;
    /**
     * Mode Copilot (Site Web) — Configuration interactive de bots.
     */
    private static handleCopilot;
    /**
     * Réponse intelligente contextuelle avec enrichissement DB.
     */
    private static getSmartReply;
    /**
     * Backward compatible wrapper for existing code that uses the old signature.
     */
    static processMessageLegacy(userMessage: string, serverId?: string, systemContext?: string): Promise<{
        reply: string;
        update?: any;
    }>;
}
export {};
