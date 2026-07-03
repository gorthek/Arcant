import { ArcantAIEngine } from '@arcant/database';

export class LocalAIClient {
  constructor() {
    console.log("[CustomAI] Initialisation du moteur d'IA personnalisé d'Arcant (Bot Proxy).");
  }

  /**
   * Analyse un message utilisateur et génère une réponse en appelant le moteur unifié.
   */
  public async generateResponse(
    prompt: string, 
    systemContext: string = '', 
    serverId?: string
  ): Promise<string> {
    // Appel du moteur d'IA unifié partagé
    const result = await ArcantAIEngine.processMessage(prompt, serverId, systemContext);

    // Si c'est un format Copilot, on renvoie la structure sous forme de chaîne JSON
    if (systemContext.includes("Copilot") || systemContext.includes("JSON")) {
      return JSON.stringify({
        reply: result.reply,
        update: result.update
      });
    }

    return result.reply;
  }
}

export const localAI = new LocalAIClient();
