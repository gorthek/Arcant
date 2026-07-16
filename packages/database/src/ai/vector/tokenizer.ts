/**
 * A highly optimized tokenizer for French NLP.
 */
export class Tokenizer {
  private static STOP_WORDS = new Set([
    'le', 'la', 'les', 'de', 'des', 'un', 'une', 'et', 'ou', 'est', 'sont', 
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'pour', 'avec', 
    'dans', 'sur', 'en', 'par', 'a', 'au', 'aux', 'qui', 'que', 'quoi', 'dont', 
    'où', 'ce', 'cet', 'cette', 'ces', 'mon', 'ton', 'son', 'ma', 'ta', 'sa', 
    'mes', 'tes', 'ses', 'du', 'pas', 'plus', 'moins', 'tres', 'trop', 'fait',
    'veux', 'voudrais', 'aimerais', 'faire', 'avoir', 'etre', 'suis', 'es'
  ]);

  /**
   * Fast tokenization:
   * 1. Lowercase
   * 2. Replace accents (normalize)
   * 3. Remove punctuation
   * 4. Split by whitespace
   * 5. Filter stop-words and empty strings
   */
  public static tokenize(text: string): string[] {
    // 1 & 2. Lowercase and remove accents
    let normalized = text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // 3. Replace punctuation with spaces
    normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ");
    
    // Replace apostrophes with spaces (e.g. "l'arbre" -> "l arbre")
    normalized = normalized.replace(/['’]/g, " ");

    // 4. Split
    const tokens = normalized.split(/\s+/);

    // 5. Filter
    const result: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.length > 1 && !this.STOP_WORDS.has(token)) {
        result.push(token);
      }
    }

    return result;
  }
}
