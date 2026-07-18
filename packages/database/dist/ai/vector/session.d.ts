import { DiscordGuildTemplate } from './generator';
import { Vector16D } from './math';
export interface ChatMessage {
    role: 'user' | 'agent';
    content: string;
}
export declare class Session {
    id: string;
    history: ChatMessage[];
    currentBlueprint: DiscordGuildTemplate | null;
    lastVector: Vector16D | null;
    constructor(id: string);
    addMessage(role: 'user' | 'agent', content: string): void;
    getContextVector(): Vector16D;
}
export declare class SessionManager {
    private static sessions;
    static getSession(userId: string): Session;
    static clearSession(userId: string): void;
}
