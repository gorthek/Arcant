/**
 * 16-Dimensional Vector for Procedural AI Architecture
 * Dimensions:
 * 0: Audio (Vocal, Music)
 * 1: Moderation (Security, Logs, Rules)
 * 2: Gaming (Games, Play, Fun)
 * 3: Social (Chat, Community, Meet)
 * 4: Structured (Forums, Tickets, Organization)
 * 5: Complexity (Amount of roles/channels)
 * 6: Scale (Massive community vs Small group)
 * 7: Roleplay (FiveM, Gmod, Factions, Lore)
 * 8: Economy (Trades, Auction House, Business)
 * 9: Dev/Tech (Code, GitHub, Bots)
 * 10: Esport (Competitive, Matchmaking)
 * 11: Education (School, Classes, Library)
 * 12: Content Creation (Streaming, YouTube, Notifications)
 * 13: Web3 (Crypto, NFT, Whitelist)
 * 14: Art/Media (Design, Video, Portfolios)
 * 15: Support/Customer (Helpdesk, Enterprise Support)
 */
export type Vector16D = [
  number, number, number, number, 
  number, number, number, number, 
  number, number, number, number, 
  number, number, number, number
];

export class VectorMath {
  public static calculateNorm(v: Vector16D): number {
    let sumSq = 0;
    for (let i = 0; i < 16; i++) {
      sumSq += v[i] * v[i];
    }
    return Math.sqrt(sumSq);
  }

  public static cosineSimilarityOptimized(
    v1: Vector16D,
    v2: Vector16D,
    norm1: number,
    norm2: number
  ): number {
    if (norm1 === 0 || norm2 === 0) return 0;
    
    let dotProduct = 0;
    // Manual unroll for extreme performance
    dotProduct += v1[0] * v2[0];
    dotProduct += v1[1] * v2[1];
    dotProduct += v1[2] * v2[2];
    dotProduct += v1[3] * v2[3];
    dotProduct += v1[4] * v2[4];
    dotProduct += v1[5] * v2[5];
    dotProduct += v1[6] * v2[6];
    dotProduct += v1[7] * v2[7];
    dotProduct += v1[8] * v2[8];
    dotProduct += v1[9] * v2[9];
    dotProduct += v1[10] * v2[10];
    dotProduct += v1[11] * v2[11];
    dotProduct += v1[12] * v2[12];
    dotProduct += v1[13] * v2[13];
    dotProduct += v1[14] * v2[14];
    dotProduct += v1[15] * v2[15];

    return dotProduct / (norm1 * norm2);
  }

  public static calculateCentroid(vectors: Vector16D[]): Vector16D {
    const count = vectors.length;
    if (count === 0) return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    const centroid: Vector16D = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < count; i++) {
      const v = vectors[i];
      for(let j=0; j<16; j++) {
        centroid[j] += v[j];
      }
    }

    for (let j = 0; j < 16; j++) {
      centroid[j] /= count;
    }

    return centroid;
  }
}
