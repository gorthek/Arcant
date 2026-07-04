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
    // Détermine le mode depuis le contexte
    const isCopilot = systemContext.includes("Copilot") || systemContext.includes("JSON");
    const mode = isCopilot ? 'copilot' as const : 'discord' as const;

    // Appel du moteur d'IA unifié partagé avec la nouvelle API
    const result = await ArcantAIEngine.processMessage(prompt, {
      mode,
      serverId,
      systemContext
    });

    // Si c'est un format Copilot, on renvoie la structure sous forme de chaîne JSON
    if (isCopilot) {
      return JSON.stringify({
        reply: result.reply,
        update: result.update
      });
    }

    return result.reply;
  }
}

export const localAI = new LocalAIClient();
