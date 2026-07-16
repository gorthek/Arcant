import * as fs from 'fs';
import * as path from 'path';
import { Vector16D, VectorMath } from './math';

export interface LexiconEntry {
  vector: Vector16D;
  norm: number;
}

export class DictionaryManager {
  private static lexicon: Record<string, LexiconEntry> = {};
  // For a real DB app, this would be stored in MongoDB. For local execution/demo:
  private static filePath = path.join(__dirname, 'lexicon.json');

  public static initialize() {
    this.loadDefaultLexicon();
    // In a real scenario, we'd merge with DB or a local file
    this.precalculateNorms();
  }

  public static getWord(word: string): LexiconEntry | undefined {
    return this.lexicon[word];
  }

  public static getAllWords(): Record<string, LexiconEntry> {
    return this.lexicon;
  }

  /**
   * ACTIVE MACHINE LEARNING:
   * Adds a new word to the lexicon, or updates an existing word's vector
   * by moving it closer to the target vector (learning rate).
   */
  public static learnWord(word: string, targetVector: Vector16D, learningRate: number = 0.5) {
    if (this.lexicon[word]) {
      // Move existing vector towards target
      const current = this.lexicon[word].vector;
      for (let i = 0; i < 16; i++) {
        current[i] = current[i] + learningRate * (targetVector[i] - current[i]);
      }
      this.lexicon[word].norm = VectorMath.calculateNorm(current);
    } else {
      // Add new word
      this.lexicon[word] = {
        vector: [...targetVector] as Vector16D,
        norm: VectorMath.calculateNorm(targetVector)
      };
    }
    // We would save to DB here
    console.log(`[AI LEARNING] Learned new context for word: "${word}"`);
  }

  private static precalculateNorms() {
    for (const word of Object.keys(this.lexicon)) {
      this.lexicon[word].norm = VectorMath.calculateNorm(this.lexicon[word].vector);
    }
  }

  private static loadDefaultLexicon() {
    this.lexicon = {
      "rp": { vector: [0, 0.2, 0.5, 0.8, 0.5, 0.9, 0.4, 1.0, 0.8, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "fivem": { vector: [0.3, 0.4, 0.8, 0.7, 0.4, 0.9, 0.5, 1.0, 0.7, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "lspd": { vector: [0.5, 0.9, 0.5, 0.3, 0.6, 0.7, 0.2, 1.0, 0, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "ems": { vector: [0.5, 0.2, 0.3, 0.6, 0.5, 0.6, 0.2, 1.0, 0, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "gang": { vector: [0.6, 0.1, 0.8, 0.7, 0.2, 0.6, 0.3, 1.0, 0.8, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "minecraft": { vector: [0.1, 0.1, 1.0, 0.6, 0.2, 0.5, 0.4, 0, 0.5, 0.1, 0.2, 0, 0, 0, 0, 0], norm: 0 },
      "skyblock": { vector: [0, 0.1, 1.0, 0.5, 0.3, 0.6, 0.3, 0, 0.9, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "million": { vector: [0, 0.8, 0, 0.9, 0.8, 1.0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "immense": { vector: [0, 0.5, 0, 0.8, 0.7, 1.0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0], norm: 0 },
      "entreprise": { vector: [0, 0.8, 0, 0.3, 1.0, 0.9, 0.8, 0, 0.6, 0.5, 0, 0, 0, 0, 0, 0.9], norm: 0 },
      "streamer": { vector: [0.8, 0.2, 0.6, 0.9, 0.3, 0.5, 0.4, 0, 0.2, 0, 0, 0, 1.0, 0, 0.5, 0], norm: 0 },
      "youtubeur": { vector: [0.5, 0.2, 0.5, 0.9, 0.4, 0.5, 0.4, 0, 0.2, 0, 0, 0, 1.0, 0, 0.8, 0], norm: 0 },
      "crypto": { vector: [0, 0.3, 0, 0.6, 0.5, 0.5, 0.3, 0, 0.8, 0.4, 0, 0, 0, 1.0, 0, 0], norm: 0 },
      "nft": { vector: [0, 0.3, 0.1, 0.6, 0.5, 0.5, 0.3, 0, 0.7, 0.3, 0, 0, 0, 1.0, 0.6, 0], norm: 0 },
      "art": { vector: [0.2, 0.1, 0, 0.6, 0.4, 0.3, 0.1, 0, 0.2, 0, 0, 0, 0, 0, 1.0, 0], norm: 0 },
      "ecole": { vector: [0.3, 0.5, 0, 0.6, 0.8, 0.6, 0.4, 0, 0, 0, 0, 1.0, 0, 0, 0, 0.4], norm: 0 },
      "support": { vector: [0.1, 0.6, 0, 0.4, 0.8, 0.7, 0.3, 0, 0, 0.2, 0, 0, 0, 0, 0, 1.0], norm: 0 },
      "dev": { vector: [0.1, 0.2, 0, 0.4, 0.6, 0.5, 0.2, 0, 0, 1.0, 0, 0.3, 0, 0, 0, 0.2], norm: 0 }
    };
  }
}
