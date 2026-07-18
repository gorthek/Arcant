/**
 * A highly optimized tokenizer for French NLP.
 */
export declare class Tokenizer {
    private static STOP_WORDS;
    /**
     * Fast tokenization:
     * 1. Lowercase
     * 2. Replace accents (normalize)
     * 3. Remove punctuation
     * 4. Split by whitespace
     * 5. Filter stop-words and empty strings
     */
    static tokenize(text: string): string[];
}
