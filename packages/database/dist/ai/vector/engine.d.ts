import { DiscordGuildTemplate } from './generator';
export interface AIResponse {
    type: 'ASKING' | 'GENERATING' | 'UPDATING';
    messageToUser: string;
    blueprint: DiscordGuildTemplate | null;
}
export declare class ConversationalAIEngine {
    private static isInitialized;
    static initialize(): void;
    static processChat(userId: string, userInput: string): AIResponse;
    private static askForClarification;
    private static handleUpdate;
}
