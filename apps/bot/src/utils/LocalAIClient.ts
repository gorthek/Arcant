import { GoogleGenAI } from '@google/genai';

/**
 * LocalAIClient (Maintenant propulsé par Gemini)
 * Gère l'interfaçage avec l'API Gemini de Google.
 */
export class LocalAIClient {
  private ai: GoogleGenAI | null = null;
  private model: string = 'gemini-2.5-flash'; // Modèle rapide, peu coûteux en tokens

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("[LocalAI] Attention : Aucune GEMINI_API_KEY trouvée dans le .env du bot !");
    }
  }

  /**
   * Génère une réponse via Gemini.
   */
  public async generateResponse(prompt: string, systemContext: string = ''): Promise<string> {
    if (!this.ai) {
      console.error("[LocalAI] Impossible de générer la réponse : Client non initialisé (Clé manquante ?)");
      return '{"error": "API Key missing"}';
    }

    try {
      console.log(`[LocalAI] Requête envoyée à Gemini (${this.model})`);

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: systemContext,
          responseMimeType: "application/json", // Force la sortie JSON pour éviter que l'IA ne bave du markdown
        }
      });

      return response.text || "{}";
    } catch (error) {
      console.error('[LocalAI] Erreur de génération avec Gemini:', error);
      return "{}";
    }
  }
}

export const localAI = new LocalAIClient();
