import { Tokenizer } from './tokenizer';
import { DictionaryManager } from './dictionary';
import { Vector16D, VectorMath } from './math';
import { DiscordGuildTemplate } from './generator';
import { ProceduralBuilder } from './procedural';
import { SessionManager } from './session';

export interface AIResponse {
  type: 'ASKING' | 'GENERATING' | 'UPDATING';
  messageToUser: string;
  blueprint: DiscordGuildTemplate | null;
}

export class ConversationalAIEngine {
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;
    DictionaryManager.initialize();
    this.isInitialized = true;
    console.log('[ConversationalAIEngine] AGI Engine Initialized (16D Procedural).');
  }

  public static processChat(userId: string, userInput: string): AIResponse {
    if (!this.isInitialized) this.initialize();

    const session = SessionManager.getSession(userId);
    session.addMessage('user', userInput);

    const tokens = Tokenizer.tokenize(userInput);

    if (tokens.length === 0) {
      return this.askForClarification(session);
    }

    // Active learning trigger (simplified logic for demo)
    // If the user says "apprends le mot X pour faire Y"
    if (tokens.includes("apprends") || tokens.includes("ajoute") && session.currentBlueprint) {
      // In a full implementation, we extract the new word and its context vector.
      // Here we just update the session history and do an UPDATING.
      return this.handleUpdate(session, userInput);
    }

    // Map to 16D vectors
    const foundVectors: Vector16D[] = [];
    const unknownWords: string[] = [];

    for (const token of tokens) {
      const entry = DictionaryManager.getWord(token);
      if (entry) {
        foundVectors.push(entry.vector);
      } else {
        unknownWords.push(token);
      }
    }

    // If the engine doesn't understand enough context (Context-Loss)
    if (foundVectors.length === 0) {
      // It asks the user to clarify using the unknown words.
      const question = `Tu as mentionné "${unknownWords.slice(0, 3).join(', ')}", mais je manque de contexte. Peux-tu préciser le type exact (RP, E-commerce, École...) ou me dire de quoi il s'agit ?`;
      session.addMessage('agent', question);
      return {
        type: 'ASKING',
        messageToUser: question,
        blueprint: session.currentBlueprint
      };
    }

    // Calculate sentence centroid
    const centroid = VectorMath.calculateCentroid(foundVectors);
    const centroidNorm = VectorMath.calculateNorm(centroid);

    // Save context to session
    session.lastVector = centroid;

    // Check confidence/strength (if the vector is too weak, ask for details)
    if (centroidNorm < 0.2) {
      const question = "Je capte l'idée globale, mais j'aurais besoin de plus de détails. Souhaites-tu une grosse structure ou un petit serveur privé ? As-tu des besoins spécifiques comme des forums ou du support ?";
      session.addMessage('agent', question);
      return {
        type: 'ASKING',
        messageToUser: question,
        blueprint: session.currentBlueprint
      };
    }

    // BUILD PROCEDURALLY
    const newBlueprint = ProceduralBuilder.buildFromVector(centroid);
    session.currentBlueprint = newBlueprint;

    // If we have unknown words, we "Learn" them softly based on the context of the known words
    for (const word of unknownWords) {
      // Associate the new word with the current conversation's centroid vector!
      // This is the Active Machine Learning part!
      DictionaryManager.learnWord(word, centroid, 0.5);
    }

    const msg = `J'ai conçu l'architecture ! (Inspiré par tes critères vectoriels). J'ai généré ${newBlueprint.roles.length} rôles et ${newBlueprint.channels.length} salons. Dis-moi si tu veux modifier quelque chose !`;
    session.addMessage('agent', msg);

    return {
      type: 'GENERATING',
      messageToUser: msg,
      blueprint: newBlueprint
    };
  }

  private static askForClarification(session: any): AIResponse {
    const msg = "Je n'ai pas bien compris. Peux-tu décrire quel type de serveur tu veux créer ?";
    session.addMessage('agent', msg);
    return {
      type: 'ASKING',
      messageToUser: msg,
      blueprint: session.currentBlueprint
    };
  }

  private static handleUpdate(session: any, userInput: string): AIResponse {
    // Simplified update logic
    if (session.currentBlueprint) {
      // Just to demonstrate procedural modification
      session.currentBlueprint.channels.push({
        name: 'salon-modifié-dynamiquement',
        type: 0
      });
      const msg = "J'ai appliqué tes modifications sur le plan existant en mémoire !";
      session.addMessage('agent', msg);
      return {
        type: 'UPDATING',
        messageToUser: msg,
        blueprint: session.currentBlueprint
      };
    } else {
      return this.askForClarification(session);
    }
  }
}
