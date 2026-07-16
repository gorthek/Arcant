import { Tokenizer } from './tokenizer';
import { Lexicon, TargetProfiles, TargetProfile, initializeVectorCache } from './dictionary';
import { Vector8D, VectorMath } from './math';
import { DiscordGenerator, DiscordGuildTemplate } from './generator';

export class VectorAIEngine {
  private static isInitialized = false;

  /**
   * Must be called ONCE at startup to pre-calculate all vector norms.
   */
  public static initialize(): void {
    if (this.isInitialized) return;
    initializeVectorCache();
    this.isInitialized = true;
    console.log('[VectorAIEngine] Math Engine Initialized & Vector Norms Cached.');
  }

  /**
   * Main pipeline:
   * 1. Tokenize input.
   * 2. Find matching vectors in Lexicon.
   * 3. Calculate Centroid.
   * 4. Find Best Match (Cosine Similarity).
   * 5. Generate Discord JSON.
   */
  public static processIntent(userInput: string): { 
    profile: TargetProfile; 
    score: number; 
    template: DiscordGuildTemplate 
  } {
    if (!this.isInitialized) {
      this.initialize();
    }

    const tokens = Tokenizer.tokenize(userInput);
    
    // Fallback if no valid words
    if (tokens.length === 0) {
      return this.fallback();
    }

    // Map to vectors
    const foundVectors: Vector8D[] = [];
    for (const token of tokens) {
      if (Lexicon[token]) {
        foundVectors.push(Lexicon[token].vector);
      }
    }

    // Fallback if no words match the lexicon
    if (foundVectors.length === 0) {
      return this.fallback();
    }

    // Calculate Sentence Centroid
    const centroid = VectorMath.calculateCentroid(foundVectors);
    const centroidNorm = VectorMath.calculateNorm(centroid);

    // If centroid is basically 0
    if (centroidNorm === 0) {
      return this.fallback();
    }

    // Compare with Targets
    let bestMatch: TargetProfile = 'DEFAULT_FALLBACK';
    let highestScore = -Infinity;

    for (const key of Object.keys(TargetProfiles)) {
      const profileId = key as TargetProfile;
      // Skip the fallback profile in similarity calculation
      if (profileId === 'DEFAULT_FALLBACK') continue;

      const profile = TargetProfiles[profileId];
      
      const similarity = VectorMath.cosineSimilarityOptimized(
        centroid,
        profile.vector,
        centroidNorm,
        profile.norm
      );

      if (similarity > highestScore) {
        highestScore = similarity;
        bestMatch = profileId;
      }
    }

    // Generate output based on best match
    const template = DiscordGenerator.generateForProfile(bestMatch);

    return {
      profile: bestMatch,
      score: highestScore,
      template
    };
  }

  private static fallback(): { profile: TargetProfile; score: number; template: DiscordGuildTemplate } {
    return {
      profile: 'DEFAULT_FALLBACK',
      score: 0,
      template: DiscordGenerator.generateForProfile('DEFAULT_FALLBACK')
    };
  }
}
