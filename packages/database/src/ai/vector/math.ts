/**
 * Represents an 8-dimensional vector for our AI classification.
 * Dimensions:
 * 0: Audio (Vocal, Music)
 * 1: Moderation (Security, Logs, Rules)
 * 2: Gaming (Games, Play, Fun)
 * 3: Social (Chat, Community, Meet)
 * 4: Structured (Forums, Tickets, Organization)
 * 5: Complexity (Amount of roles/channels, heavy setup)
 * 6: Dev/Tech (Code, GitHub, Bots)
 * 7: Esport/Competitive (Teams, Matchmaking, Ranks)
 */
export type Vector8D = [number, number, number, number, number, number, number, number];

export class VectorMath {
  /**
   * Calculates the Euclidean norm (length) of an 8D vector.
   * This should ONLY be called at startup/caching time, NEVER during a request.
   */
  public static calculateNorm(v: Vector8D): number {
    let sumSq = 0;
    for (let i = 0; i < 8; i++) {
      sumSq += v[i] * v[i];
    }
    return Math.sqrt(sumSq);
  }

  /**
   * Hyper-optimized Cosine Similarity.
   * Uses PRE-CALCULATED norms to avoid Math.sqrt at runtime.
   * Returns a value between -1 and 1.
   */
  public static cosineSimilarityOptimized(
    v1: Vector8D,
    v2: Vector8D,
    norm1: number,
    norm2: number
  ): number {
    if (norm1 === 0 || norm2 === 0) return 0;
    
    let dotProduct = 0;
    // Manual unrolling for extreme speed in V8 Engine
    dotProduct += v1[0] * v2[0];
    dotProduct += v1[1] * v2[1];
    dotProduct += v1[2] * v2[2];
    dotProduct += v1[3] * v2[3];
    dotProduct += v1[4] * v2[4];
    dotProduct += v1[5] * v2[5];
    dotProduct += v1[6] * v2[6];
    dotProduct += v1[7] * v2[7];

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Calculates the centroid (average vector) of an array of vectors.
   */
  public static calculateCentroid(vectors: Vector8D[]): Vector8D {
    const count = vectors.length;
    if (count === 0) return [0, 0, 0, 0, 0, 0, 0, 0];

    const centroid: Vector8D = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < count; i++) {
      const v = vectors[i];
      centroid[0] += v[0];
      centroid[1] += v[1];
      centroid[2] += v[2];
      centroid[3] += v[3];
      centroid[4] += v[4];
      centroid[5] += v[5];
      centroid[6] += v[6];
      centroid[7] += v[7];
    }

    for (let j = 0; j < 8; j++) {
      centroid[j] /= count;
    }

    return centroid;
  }
}
