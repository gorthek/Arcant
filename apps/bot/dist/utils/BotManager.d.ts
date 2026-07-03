declare class BotManager {
    private bots;
    initAllBots(): Promise<void>;
    spawnBot(botId: string, token: string, features?: string[], systemPrompt?: string): Promise<void>;
    stopBot(botId: string): Promise<void>;
    reloadBot(botId: string, newFeatures: string[], newSystemPrompt: string): Promise<void>;
}
export declare const botManager: BotManager;
export {};
//# sourceMappingURL=BotManager.d.ts.map