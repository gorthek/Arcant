import { Vector8D, VectorMath } from './math';

export type TargetProfile = 'SIMPLE_GAMING' | 'COMPLEX_COMMUNITY' | 'DEV_TEAM' | 'STAFF_MODERATION' | 'ESPORT_TEAM' | 'DEFAULT_FALLBACK';

export interface TargetDefinition {
  id: TargetProfile;
  vector: Vector8D;
  norm: number; // Will be pre-calculated
}

export const TargetProfiles: Record<TargetProfile, TargetDefinition> = {
  SIMPLE_GAMING: {
    id: 'SIMPLE_GAMING',
    vector: [0.8, 0.1, 1.0, 0.7, 0.0, 0.1, 0.0, 0.1], // High audio, gaming, social. Low complexity, structured.
    norm: 0
  },
  COMPLEX_COMMUNITY: {
    id: 'COMPLEX_COMMUNITY',
    vector: [0.6, 0.7, 0.4, 1.0, 0.9, 0.9, 0.2, 0.1], // High social, structured (forums), complexity, moderation.
    norm: 0
  },
  DEV_TEAM: {
    id: 'DEV_TEAM',
    vector: [0.4, 0.3, 0.0, 0.5, 0.8, 0.6, 1.0, 0.0], // High dev/tech, structured, moderate complexity and social.
    norm: 0
  },
  STAFF_MODERATION: {
    id: 'STAFF_MODERATION',
    vector: [0.2, 1.0, 0.0, 0.3, 0.7, 0.8, 0.4, 0.0], // High moderation, complexity, structured.
    norm: 0
  },
  ESPORT_TEAM: {
    id: 'ESPORT_TEAM',
    vector: [0.9, 0.4, 0.9, 0.6, 0.5, 0.7, 0.1, 1.0], // High competitive, gaming, audio, complexity.
    norm: 0
  },
  DEFAULT_FALLBACK: {
    id: 'DEFAULT_FALLBACK',
    vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], // Neutral baseline
    norm: 0
  }
};

/**
 * 8D Word Embeddings Lexicon
 * Dimensions: [Audio, Moderation, Gaming, Social, Structured, Complexity, Dev/Tech, Esport/Competitive]
 */
export const Lexicon: Record<string, { vector: Vector8D, norm: number }> = {
  // --- GAMING & ESPORT ---
  "jeu": { vector: [0.2, 0.0, 1.0, 0.4, 0.0, 0.1, 0.0, 0.1], norm: 0 },
  "jouer": { vector: [0.3, 0.0, 0.9, 0.5, 0.0, 0.1, 0.0, 0.2], norm: 0 },
  "gaming": { vector: [0.4, 0.1, 1.0, 0.6, 0.1, 0.2, 0.1, 0.4], norm: 0 },
  "esport": { vector: [0.6, 0.2, 0.9, 0.5, 0.3, 0.6, 0.0, 1.0], norm: 0 },
  "tournoi": { vector: [0.5, 0.4, 0.8, 0.6, 0.6, 0.7, 0.0, 0.9], norm: 0 },
  "equipe": { vector: [0.6, 0.2, 0.6, 0.8, 0.4, 0.5, 0.1, 0.8], norm: 0 },
  "team": { vector: [0.6, 0.2, 0.6, 0.8, 0.4, 0.5, 0.1, 0.8], norm: 0 },
  "match": { vector: [0.4, 0.2, 0.8, 0.5, 0.3, 0.4, 0.0, 0.9], norm: 0 },

  // --- AUDIO / VOCAL ---
  "vocal": { vector: [1.0, 0.1, 0.3, 0.7, 0.0, 0.1, 0.0, 0.2], norm: 0 },
  "musique": { vector: [0.9, 0.0, 0.2, 0.6, 0.0, 0.1, 0.0, 0.0], norm: 0 },
  "parler": { vector: [0.8, 0.1, 0.1, 0.9, 0.1, 0.1, 0.0, 0.1], norm: 0 },
  "vocaux": { vector: [1.0, 0.2, 0.3, 0.6, 0.1, 0.3, 0.0, 0.2], norm: 0 },

  // --- SOCIAL & COMMUNITY ---
  "communaute": { vector: [0.5, 0.3, 0.3, 1.0, 0.6, 0.5, 0.1, 0.1], norm: 0 },
  "amis": { vector: [0.6, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0], norm: 0 },
  "potes": { vector: [0.6, 0.0, 0.6, 0.9, 0.0, 0.0, 0.0, 0.0], norm: 0 },
  "rencontre": { vector: [0.4, 0.2, 0.1, 0.9, 0.2, 0.1, 0.0, 0.0], norm: 0 },
  "discuter": { vector: [0.5, 0.1, 0.1, 1.0, 0.3, 0.1, 0.0, 0.0], norm: 0 },

  // --- MODERATION & SECURITY ---
  "moderation": { vector: [0.1, 1.0, 0.0, 0.2, 0.6, 0.7, 0.2, 0.0], norm: 0 },
  "securite": { vector: [0.0, 1.0, 0.0, 0.1, 0.5, 0.8, 0.4, 0.0], norm: 0 },
  "staff": { vector: [0.3, 0.9, 0.1, 0.4, 0.7, 0.8, 0.3, 0.1], norm: 0 },
  "admin": { vector: [0.2, 0.9, 0.1, 0.3, 0.7, 0.9, 0.5, 0.1], norm: 0 },
  "logs": { vector: [0.0, 0.8, 0.0, 0.0, 0.6, 0.7, 0.5, 0.0], norm: 0 },
  "regles": { vector: [0.0, 0.9, 0.1, 0.3, 0.8, 0.6, 0.0, 0.1], norm: 0 },

  // --- STRUCTURE (Forums, Tickets) & COMPLEXITY ---
  "forum": { vector: [0.0, 0.3, 0.0, 0.6, 1.0, 0.6, 0.2, 0.0], norm: 0 },
  "forums": { vector: [0.0, 0.3, 0.0, 0.6, 1.0, 0.6, 0.2, 0.0], norm: 0 },
  "ticket": { vector: [0.0, 0.6, 0.0, 0.3, 0.9, 0.7, 0.1, 0.0], norm: 0 },
  "tickets": { vector: [0.0, 0.6, 0.0, 0.3, 0.9, 0.7, 0.1, 0.0], norm: 0 },
  "roles": { vector: [0.0, 0.5, 0.1, 0.4, 0.6, 1.0, 0.1, 0.1], norm: 0 },
  "complexe": { vector: [0.1, 0.5, 0.1, 0.2, 0.7, 1.0, 0.4, 0.2], norm: 0 },
  "structurer": { vector: [0.0, 0.4, 0.0, 0.3, 1.0, 0.8, 0.2, 0.0], norm: 0 },
  "categories": { vector: [0.1, 0.3, 0.1, 0.4, 0.8, 0.9, 0.1, 0.1], norm: 0 },
  "simple": { vector: [0.2, 0.0, 0.2, 0.3, 0.0, -1.0, 0.0, 0.0], norm: 0 }, // Negative complexity

  // --- DEV & TECH ---
  "dev": { vector: [0.1, 0.2, 0.0, 0.4, 0.6, 0.5, 1.0, 0.0], norm: 0 },
  "developpement": { vector: [0.1, 0.2, 0.0, 0.4, 0.6, 0.6, 1.0, 0.0], norm: 0 },
  "code": { vector: [0.0, 0.1, 0.0, 0.3, 0.5, 0.5, 1.0, 0.0], norm: 0 },
  "bot": { vector: [0.1, 0.4, 0.1, 0.3, 0.4, 0.7, 0.9, 0.0], norm: 0 },
  "github": { vector: [0.0, 0.1, 0.0, 0.2, 0.6, 0.4, 1.0, 0.0], norm: 0 },
  "programmation": { vector: [0.0, 0.1, 0.0, 0.3, 0.6, 0.5, 1.0, 0.0], norm: 0 }
};

/**
 * Initializes the vector engine by pre-calculating all norms.
 * This runs ONCE at startup to ensure the runtime is extremely fast.
 */
export function initializeVectorCache() {
  // Pre-calculate target norms
  for (const key of Object.keys(TargetProfiles)) {
    const profile = TargetProfiles[key as TargetProfile];
    profile.norm = VectorMath.calculateNorm(profile.vector);
  }

  // Pre-calculate lexicon norms
  for (const word of Object.keys(Lexicon)) {
    Lexicon[word].norm = VectorMath.calculateNorm(Lexicon[word].vector);
  }
}
