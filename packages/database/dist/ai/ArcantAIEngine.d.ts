export type AIContextMode = 'site' | 'discord' | 'api' | 'copilot' | 'server_generation';
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
    private static cache;
    private static getFromCache;
    private static setToCache;
    private static FRENCH_STOPWORDS;
    /**
     * Nettoie et fragmente le message en tokens utiles.
     */
    private static tokenize;
    /**
     * Stemmer ultra-rapide pour ramener les mots français à leur racine.
     */
    private static stem;
    /**
     * Calcule la distance de Levenshtein entre deux chaînes. Tolère les typos.
     */
    private static getLevenshteinDistance;
    private static isFuzzyMatch;
    private static containsFuzzy;
    static processMessage(userMessage: string, context: AIContext): Promise<{
        reply: string;
        update?: any;
        data?: any;
    }>;
    static getDBStats(): Promise<{
        serversCount: number;
        botsCount: number;
        usersCount: number;
        aiRulesCount: number;
    }>;
    private static handleAPIMode;
    /**
     * Syntétiseur Dynamique de Serveur (NLP & Extraction d'Entités)
     * Génère une architecture sur-mesure mot par mot en fonction du prompt.
     */
    private static handleServerGeneration;
    /**
     * Mode Copilot (Site Web) — Configuration interactive de bots.
     */
    private static handleCopilot;
    /**
     * Réponse intelligente par classification d'intentions
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
