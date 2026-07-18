"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorMath = void 0;
class VectorMath {
    static calculateNorm(v) {
        let sumSq = 0;
        for (let i = 0; i < 16; i++) {
            sumSq += v[i] * v[i];
        }
        return Math.sqrt(sumSq);
    }
    static cosineSimilarityOptimized(v1, v2, norm1, norm2) {
        if (norm1 === 0 || norm2 === 0)
            return 0;
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
    static calculateCentroid(vectors) {
        const count = vectors.length;
        if (count === 0)
            return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const centroid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < count; i++) {
            const v = vectors[i];
            for (let j = 0; j < 16; j++) {
                centroid[j] += v[j];
            }
        }
        for (let j = 0; j < 16; j++) {
            centroid[j] /= count;
        }
        return centroid;
    }
}
exports.VectorMath = VectorMath;
