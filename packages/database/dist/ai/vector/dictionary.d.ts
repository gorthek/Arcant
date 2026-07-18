import { Vector16D } from './math';
export interface LexiconEntry {
    vector: Vector16D;
    norm: number;
}
export declare class DictionaryManager {
    private static lexicon;
    private static filePath;
    static initialize(): void;
    static getWord(word: string): LexiconEntry | undefined;
    static getAllWords(): Record<string, LexiconEntry>;
    /**
     * ACTIVE MACHINE LEARNING:
     * Adds a new word to the lexicon, or updates an existing word's vector
     * by moving it closer to the target vector (learning rate).
     */
    static learnWord(word: string, targetVector: Vector16D, learningRate?: number): void;
    private static precalculateNorms;
    private static loadDefaultLexicon;
}
