import { DiscordGuildTemplate } from './generator';
import { Vector16D, VectorMath } from './math';

export interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
}

export class Session {
  public id: string;
  public history: ChatMessage[] = [];
  public currentBlueprint: DiscordGuildTemplate | null = null;
  public lastVector: Vector16D | null = null;

  constructor(id: string) {
    this.id = id;
  }

  public addMessage(role: 'user' | 'agent', content: string) {
    this.history.push({ role, content });
  }

  public getContextVector(): Vector16D {
    // A simplified way to merge context over time. 
    // In a real NLP AGI, we'd do attention mechanism.
    return this.lastVector || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  }
}

export class SessionManager {
  private static sessions: Map<string, Session> = new Map();

  public static getSession(userId: string): Session {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new Session(userId));
    }
    return this.sessions.get(userId)!;
  }

  public static clearSession(userId: string) {
    this.sessions.delete(userId);
  }
}
