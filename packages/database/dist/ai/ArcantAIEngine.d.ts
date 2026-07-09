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
    /**
     * Calcule la distance de Levenshtein entre deux chaînes.
     * Indispensable pour la tolérance aux fautes d'orthographe.
     */
    private static getLevenshteinDistance;
    /**
     * Vérifie si deux chaînes sont similaires avec un seuil de distance maximal.
     */
    private static isFuzzyMatch;
    /**
     * Recherche si l'une des chaînes fournies correspond à la cible de façon tolérante.
     */
    private static containsFuzzy;
    /**
     * Analyse et génère une réponse unifiée pour le Bot Discord, l'API ou le Site Web.
     */
    static processMessage(userMessage: string, context: AIContext): Promise<{
        reply: string;
        update?: any;
        data?: any;
    }>;
    /**
     * Récupère les statistiques réelles de la DB MongoDB (Optimisé avec Cache 30 secondes).
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
     * Mode Server Generation (Génération d'architecture de serveur Discord)
     * Analyse et produit un JSON structuré thématique de rôles et salons.
     */
    private static handleServerGeneration;
    /**
     * Mode Copilot (Site Web) — Configuration interactive de bots.
     */
    private static handleCopilot;
    /**
     * Réponse intelligente contextuelle avec enrichissement DB et tolérance aux fautes de frappe.
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
