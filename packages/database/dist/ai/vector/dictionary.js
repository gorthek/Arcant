"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryManager = void 0;
const path = __importStar(require("path"));
const math_1 = require("./math");
class DictionaryManager {
    static lexicon = {};
    // For a real DB app, this would be stored in MongoDB. For local execution/demo:
    static filePath = path.join(__dirname, 'lexicon.json');
    static initialize() {
        this.loadDefaultLexicon();
        // In a real scenario, we'd merge with DB or a local file
        this.precalculateNorms();
    }
    static getWord(word) {
        return this.lexicon[word];
    }
    static getAllWords() {
        return this.lexicon;
    }
    /**
     * ACTIVE MACHINE LEARNING:
     * Adds a new word to the lexicon, or updates an existing word's vector
     * by moving it closer to the target vector (learning rate).
     */
    static learnWord(word, targetVector, learningRate = 0.5) {
        if (this.lexicon[word]) {
            // Move existing vector towards target
            const current = this.lexicon[word].vector;
            for (let i = 0; i < 16; i++) {
                current[i] = current[i] + learningRate * (targetVector[i] - current[i]);
            }
            this.lexicon[word].norm = math_1.VectorMath.calculateNorm(current);
        }
        else {
            // Add new word
            this.lexicon[word] = {
                vector: [...targetVector],
                norm: math_1.VectorMath.calculateNorm(targetVector)
            };
        }
        // We would save to DB here
        console.log(`[AI LEARNING] Learned new context for word: "${word}"`);
    }
    static precalculateNorms() {
        for (const word of Object.keys(this.lexicon)) {
            this.lexicon[word].norm = math_1.VectorMath.calculateNorm(this.lexicon[word].vector);
        }
    }
    static loadDefaultLexicon() {
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
exports.DictionaryManager = DictionaryManager;
