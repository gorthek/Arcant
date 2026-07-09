import { AIRule } from '../models/AIRule';
import { Server } from '../models/Server';
import { CustomBot } from '../models/CustomBot';
import { User } from '../models/User';

export type AIContextMode = 'site' | 'discord' | 'api' | 'copilot' | 'server_generation';

interface AIContext {
  mode: AIContextMode;
  serverId?: string | undefined;
  userId?: string | undefined;
  systemContext?: string | undefined;
  dbStats?: {
    serversCount: number;
    botsCount: number;
    usersCount: number;
    aiRulesCount: number;
  } | undefined;
}

export class ArcantAIEngine {
  // Cache en mémoire TTL
  private static cache: Record<string, { data: any; expiry: number }> = {};

  private static getFromCache<T>(key: string): T | null {
    const entry = this.cache[key];
    if (entry && entry.expiry > Date.now()) {
      return entry.data as T;
    }
    return null;
  }

  private static setToCache(key: string, data: any, ttlMs: number = 15000): void {
    this.cache[key] = {
      data,
      expiry: Date.now() + ttlMs
    };
  }

  // --- LOGIQUE NLP LOCALE & STEMMING ---

  private static FRENCH_STOPWORDS = new Set([
    'de', 'la', 'le', 'les', 'des', 'pour', 'avec', 'dans', 'sur', 'en', 'aux', 'par', 'dans', 'un', 'une',
    'ce', 'cet', 'cette', 'ces', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'mon', 'ton',
    'son', 'ma', 'ta', 'sa', 'mes', 'tes', 'ses', 'du', 'au', 'qui', 'que', 'quoi', 'dont', 'ou', 'où'
  ]);

  /**
   * Nettoie et fragmente le message en tokens utiles.
   */
  private static tokenize(text: string): string[] {
    const cleanText = text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ")
      .replace(/['’]/g, " ");
    return cleanText.split(/\s+/)
      .filter(w => w.length > 0 && !this.FRENCH_STOPWORDS.has(w));
  }

  /**
   * Stemmer ultra-rapide pour ramener les mots français à leur racine.
   */
  private static stem(word: string): string {
    const w = word.trim();
    if (w.startsWith("modér") || w.startsWith("moder") || w.startsWith("modo")) return "moder";
    if (w.startsWith("sécur") || w.startsWith("secur") || w.startsWith("protect")) return "secur";
    if (w.startsWith("serveur") || w.startsWith("guild") || w.startsWith("disc")) return "serveur";
    if (w.startsWith("salon") || w.startsWith("channel") || w.startsWith("chan")) return "salon";
    if (w.startsWith("éco") || w.startsWith("eco") || w.startsWith("argent") || w.startsWith("boutique")) return "eco";
    if (w.startsWith("stat") || w.startsWith("info") || w.startsWith("donnée")) return "stats";
    if (w.startsWith("aide") || w.startsWith("help") || w.startsWith("command")) return "aide";
    if (w.startsWith("blague") || w.startsWith("rire") || w.startsWith("drôle") || w.startsWith("drole")) return "blague";
    if (w.startsWith("créat") || w.startsWith("creat") || w.startsWith("conçu") || w.startsWith("developpeur")) return "creator";
    if (w.startsWith("premium") || w.startsWith("upgrade") || w.startsWith("pay")) return "premium";
    if (w.startsWith("level") || w.startsWith("xp") || w.startsWith("niveau")) return "level";
    if (w.startsWith("ticket") || w.startsWith("support")) return "ticket";
    if (w.startsWith("bienvenue") || w.startsWith("welcome") || w.startsWith("accueil")) return "welcome";
    if (w.startsWith("bonjour") || w.startsWith("salut") || w.startsWith("hello") || w.startsWith("coucou")) return "hello";
    if (w.startsWith("merci") || w.startsWith("thanks") || w.startsWith("super")) return "thanks";
    return w;
  }

  /**
   * Calcule la distance de Levenshtein entre deux chaînes. Tolère les typos.
   */
  private static getLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // suppression
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  private static isFuzzyMatch(word: string, target: string, maxDistance: number = 2): boolean {
    if (word.length < 3 || target.length < 3) return word === target;
    const distance = this.getLevenshteinDistance(word, target);
    return distance <= maxDistance;
  }

  private static containsFuzzy(words: string[], target: string, synonyms: string[] = []): boolean {
    const targetStems = [this.stem(target), ...synonyms.map(s => this.stem(s))];
    const wordStems = words.map(w => this.stem(w));

    for (const ws of wordStems) {
      for (const ts of targetStems) {
        if (ts.length < 4) {
          if (ws === ts) return true;
        } else {
          const maxDist = ts.length > 6 ? 2 : 1;
          if (this.isFuzzyMatch(ws, ts, maxDist)) return true;
        }
      }
    }
    return false;
  }

  // --- LOGIQUE DU MOTEUR D'IA ---

  public static async processMessage(
    userMessage: string,
    context: AIContext
  ): Promise<{ reply: string; update?: any; data?: any }> {
    const msg = userMessage.toLowerCase().trim();
    const { mode, serverId, systemContext, userId } = context;

    // Analyse lexicale du message
    const tokens = this.tokenize(msg);

    // 0. Mode Server Generation (Génération d'architecture de serveur Discord)
    if (mode === 'server_generation' || systemContext?.includes("architecte") || systemContext?.includes("categories")) {
      return this.handleServerGeneration(userMessage);
    }

    // 1. Mode Copilot (Site Web - Configuration interactive)
    if (mode === 'copilot' || systemContext?.includes("Copilot") || systemContext?.includes("JSON")) {
      return this.handleCopilot(userMessage, systemContext || '', serverId);
    }

    // 2. Mode API (retourne du JSON structuré)
    if (mode === 'api') {
      return this.handleAPIMode(userMessage, context);
    }

    // -- Détection de l'apprentissage autonome (Self-Learning)
    if (serverId && (msg.includes("quand je dis") || msg.includes("quand on dit") || msg.includes("quand quelqu'un dit") || msg.includes("apprends que quand"))) {
      const learnRegex = /(?:quand je dis|quand on dit|quand quelqu'un dit|apprends que quand)\s+['"\s]?([^'"]+)['"\s]?,?\s+(?:tu dois répondre|tu dois repondre|réponds|reponds|répond|repond)\s+['"\s]?([^'"]+)['"\s]?/i;
      const learnMatch = userMessage.match(learnRegex);
      
      if (learnMatch && learnMatch[1] && learnMatch[2]) {
        const trigger = learnMatch[1].trim();
        const response = learnMatch[2].trim();
        
        try {
          const newRule = new AIRule({
            serverId,
            trigger,
            response,
            creatorId: userId || 'AI_AUTONOMOUS'
          });
          await newRule.save();
          delete this.cache[`rules_${serverId}`]; // Invalider cache
          
          return {
            reply: `💡 **Apprentissage réussi !** Désormais, quand quelqu'un dira *"${trigger}"* sur ce serveur, je répondrai *"${response}"*.`
          };
        } catch (err) {
          console.error("[ArcantAI] Erreur apprentissage autonome:", err);
          return { reply: "❌ Je n'ai pas pu enregistrer cette règle. Réessayez plus tard." };
        }
      }
    }

    // -- Détection de l'oubli autonome de règle (Self-Forgetting)
    if (serverId && (msg.includes("oublie la règle") || msg.includes("supprime la règle") || msg.includes("oublie le mot-clé") || msg.includes("oublie la regle") || msg.includes("supprime la regle"))) {
      const forgetRegex = /(?:oublie la règle|oublie la regle|supprime la règle|supprime la regle|oublie le mot-clé|oublie le mot-cle)\s+['"\s]?([^'"]+)['"\s]?/i;
      const forgetMatch = userMessage.match(forgetRegex);
      
      if (forgetMatch && forgetMatch[1]) {
        const triggerToForget = forgetMatch[1].trim().toLowerCase();
        try {
          const deleteResult = await AIRule.deleteMany({
            serverId,
            trigger: { $regex: new RegExp(`^${triggerToForget}$`, 'i') }
          });
          
          if (deleteResult.deletedCount > 0) {
            delete this.cache[`rules_${serverId}`];
            return {
              reply: `🧹 **Règle oubliée !** J'ai supprimé la règle associée au déclencheur *"${forgetMatch[1]}"*.`
            };
          } else {
            return {
              reply: `❓ Je n'ai trouvé aucune règle personnalisée avec le déclencheur *"${forgetMatch[1]}"* sur ce serveur.`
            };
          }
        } catch (err) {
          console.error("[ArcantAI] Erreur oubli autonome:", err);
          return { reply: "❌ Une erreur est survenue lors de la suppression de la règle." };
        }
      }
    }

    // 3. Recherche de règles personnalisées dans la DB (Cache & Fuzzy Matching)
    if (serverId) {
      try {
        const cacheKey = `rules_${serverId}`;
        let rules = this.getFromCache<any[]>(cacheKey);
        if (!rules) {
          rules = await AIRule.find({ serverId });
          this.setToCache(cacheKey, rules, 10000);
        }

        const serverCacheKey = `server_${serverId}`;
        let serverInfo = this.getFromCache<any>(serverCacheKey);
        if (!serverInfo) {
          serverInfo = await Server.findOne({ serverId });
          this.setToCache(serverCacheKey, serverInfo, 20000);
        }

        const botCacheKey = `bot_${serverId}`;
        let botInfo = this.getFromCache<any>(botCacheKey);
        if (!botInfo) {
          botInfo = await CustomBot.findOne({ serverId });
          this.setToCache(botCacheKey, botInfo, 20000);
        }

        for (const rule of rules) {
          const trigger = rule.trigger.toLowerCase().trim();
          let isMatched = false;

          if (msg.includes(trigger)) {
            isMatched = true;
          } else {
            // Analyse fuzzy des déclencheurs
            const triggerWords = trigger.split(/\s+/).filter((w: string) => w.length >= 3);
            if (triggerWords.length > 0) {
              let matchesAll = true;
              for (const tw of triggerWords) {
                if (!tokens.some(w => this.isFuzzyMatch(w, tw, tw.length > 5 ? 2 : 1))) {
                  matchesAll = false;
                  break;
                }
              }
              isMatched = matchesAll;
            }
          }

          if (isMatched) {
            let responseText = rule.response;
            const userMention = userId ? `<@${userId}>` : `<@user>`;
            responseText = responseText.replace(/{user}/g, userMention);
            responseText = responseText.replace(/{server_name}/g, serverInfo?.name || "le serveur");
            responseText = responseText.replace(/{time}/g, new Date().toLocaleTimeString('fr-FR'));
            responseText = responseText.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'));
            responseText = responseText.replace(/{bot_name}/g, botInfo?.botName || "Arcant");
            responseText = responseText.replace(/{members}/g, String(serverInfo?.serverId ? '(nombre dynamique)' : '0'));

            return { reply: responseText };
          }
        }
      } catch (err) {
        console.error("[ArcantAI] Erreur de lecture des règles DB:", err);
      }
    }

    // 4. Enrichir le contexte avec les données de la DB
    let enrichedContext = '';
    let serverSettingsText = '';
    try {
      const dbStats = await this.getDBStats();
      enrichedContext = `[Contexte Arcant] ${dbStats.serversCount} serveurs, ${dbStats.botsCount} bots, ${dbStats.usersCount} utilisateurs, ${dbStats.aiRulesCount} règles IA configurées.`;
      
      if (serverId) {
        const serverCacheKey = `server_${serverId}`;
        let serverInfo = this.getFromCache<any>(serverCacheKey);
        if (!serverInfo) {
          serverInfo = await Server.findOne({ serverId });
          this.setToCache(serverCacheKey, serverInfo, 20000);
        }

        if (serverInfo) {
          serverSettingsText = `\n⚙️ **Configuration actuelle de ${serverInfo.name}** :\n` +
            `- 🛡️ **Mode Anti-Raid** : ${serverInfo.raidMode ? '🔴 Activé (Le serveur est verrouillé)' : '🟢 Désactivé'}\n` +
            `- 🔗 **Anti-Lien** : ${serverInfo.antiLink ? '🔒 Activé (Liens bloqués)' : '🔓 Désactivé'}\n` +
            `- ⚠️ **Sensibilité Anti-Spam** : ${serverInfo.antiSpamSensitivity || 'medium'}\n` +
            `- 📝 **Mots interdits** : ${serverInfo.blacklistedWords?.join(', ') || 'Aucun'}`;
        }
      }
    } catch (e) {
      enrichedContext = '[Contexte Arcant] Données DB indisponibles.';
    }

    // 5. Réponse intelligente par classification d'intentions
    const reply = this.getSmartReply(msg, tokens, mode, enrichedContext, serverSettingsText);
    return { reply };
  }

  public static async getDBStats() {
    const cacheKey = 'db_stats';
    const cached = this.getFromCache<{ serversCount: number; botsCount: number; usersCount: number; aiRulesCount: number }>(cacheKey);
    if (cached) return cached;

    try {
      const [serversCount, botsCount, usersCount, aiRulesCount] = await Promise.all([
        Server.countDocuments(),
        CustomBot.countDocuments(),
        User.countDocuments(),
        AIRule.countDocuments()
      ]);
      const stats = { serversCount, botsCount, usersCount, aiRulesCount };
      this.setToCache(cacheKey, stats, 30000);
      return stats;
    } catch (e) {
      return { serversCount: 0, botsCount: 0, usersCount: 0, aiRulesCount: 0 };
    }
  }

  private static async handleAPIMode(
    userMessage: string,
    context: AIContext
  ): Promise<{ reply: string; data?: any }> {
    const msg = userMessage.toLowerCase();
    const dbStats = await this.getDBStats();

    if (msg.includes('stats') || msg.includes('status')) {
      return {
        reply: 'Statistiques récupérées avec succès.',
        data: {
          type: 'stats',
          ...dbStats,
          timestamp: new Date().toISOString()
        }
      };
    }

    if (msg.includes('server') && context.serverId) {
      const server = await Server.findOne({ serverId: context.serverId });
      return {
        reply: server ? `Serveur "${server.name}" trouvé.` : 'Serveur introuvable.',
        data: {
          type: 'server',
          server: server ? {
            id: server.serverId,
            name: server.name,
            isPremium: server.isPremium,
            raidMode: server.raidMode,
            antiLink: server.antiLink
          } : null
        }
      };
    }

    return {
      reply: 'Commande API traitée par l\'IA unifiée d\'Arcant.',
      data: { type: 'generic', dbStats }
    };
  }

  /**
   * Syntétiseur Dynamique de Serveur (NLP & Extraction d'Entités)
   * Génère une architecture sur-mesure mot par mot en fonction du prompt.
   */
  private static handleServerGeneration(userMessage: string): { reply: string; data: any } {
    const prompt = userMessage.toLowerCase();
    const tokens = this.tokenize(prompt);
    
    // 1. Synthèse des Rôles
    const roles: { name: string; color: string }[] = [
      { name: "👑 | Fondateur", color: "#14b8a6" }
    ];

    // Extraction dynamique de rôles personnalisés
    const roleMatches = userMessage.match(/(?:rôle|role|grade)\s+['"\s]?([\w\-\s\|\u00C0-\u00FF]+)['"\s]?/gi);
    if (roleMatches) {
      for (const m of roleMatches) {
        const cleanRole = m.replace(/(?:rôle|role|grade)\s+/i, '').replace(/['"]/g, '').trim();
        if (cleanRole.length > 2 && !roles.some(r => r.name.toLowerCase().includes(cleanRole.toLowerCase()))) {
          const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6", "#10b981", "#22c55e", "#84cc16", "#eab308", "#f97316"];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          roles.push({ name: `👥 | ${cleanRole}`, color: randomColor });
        }
      }
    }

    // Rôles thématiques standards si détectés
    if (this.containsFuzzy(tokens, 'staff', ['mod', 'admin', 'moderateur'])) {
      roles.push({ name: "🛠️ | Staff", color: "#10b981" });
    }
    if (this.containsFuzzy(tokens, 'vip', ['premium', 'soutien'])) {
      roles.push({ name: "💎 | VIP", color: "#3b82f6" });
    }
    if (this.containsFuzzy(tokens, 'gaming', ['jeu', 'player', 'gamer', 'joueur'])) {
      roles.push({ name: "🎮 | Gamer", color: "#a855f7" });
    }
    if (this.containsFuzzy(tokens, 'rp', ['police', 'gta'])) {
      roles.push({ name: "👮 | Police", color: "#3b82f6" });
      roles.push({ name: "🚑 | EMS/Secours", color: "#eab308" });
    }

    // 2. Synthèse Dynamique des Catégories & Salons
    const categories: any[] = [];

    // Catégorie ACCUEIL (toujours créée avec permissions de lecture seule pour everyone)
    const infoChannels = [
      { name: "📌-accueil", type: "text" as const },
      { name: "📜-reglement", type: "text" as const }
    ];
    if (this.containsFuzzy(tokens, 'annonce', ['news', 'annonces'])) {
      infoChannels.push({ name: "📢-annonces", type: "text" as const });
    }
    categories.push({
      name: "📢 | INFORMATIONS",
      permissions: [
        { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
      ],
      channels: infoChannels
    });

    // Catégorie ESPACE DISCUSSIONS
    const talkChannels = [{ name: "💬-general", type: "text" as const }];
    if (this.containsFuzzy(tokens, 'meme', ['memes', 'media', 'images'])) {
      talkChannels.push({ name: "📷-medias", type: "text" as const });
    }
    if (this.containsFuzzy(tokens, 'bot', ['bots', 'commandes'])) {
      talkChannels.push({ name: "🤖-commandes-bot", type: "text" as const });
    }
    categories.push({
      name: "💬 | SECTEUR PUBLIC",
      permissions: [
        { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
      ],
      channels: talkChannels
    });

    // Catégorie JEUX (si Gaming détecté)
    const hasGaming = this.containsFuzzy(tokens, 'gaming', ['jeu', 'gamer', 'valorant', 'lol', 'league', 'minecraft', 'fortnite', 'esport', 'twitch', 'csgo', 'apex', 'cod']);
    if (hasGaming) {
      const gameChannels: any[] = [];
      if (prompt.includes('valorant')) gameChannels.push({ name: "🎮-valorant", type: "text" });
      if (prompt.includes('league') || prompt.includes('lol')) gameChannels.push({ name: "🎮-league-of-legends", type: "text" });
      if (prompt.includes('minecraft')) gameChannels.push({ name: "🎮-minecraft", type: "text" });
      if (prompt.includes('fortnite')) gameChannels.push({ name: "🎮-fortnite", type: "text" });
      if (prompt.includes('apex')) gameChannels.push({ name: "🎮-apex-legends", type: "text" });
      
      if (gameChannels.length === 0) {
        gameChannels.push({ name: "🎮-recherche-de-groupe", type: "text" });
        gameChannels.push({ name: "🏆-clips-gaming", type: "text" });
      }

      categories.push({
        name: "🎮 | ZONE GAMING",
        permissions: [
          { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "Connect", "Speak"] }
        ],
        channels: gameChannels
      });
    }

    // Catégorie ÉTUDES (si Scolaire/Pro détecté)
    const hasStudy = this.containsFuzzy(tokens, 'etude', ['cours', 'travail', 'dev', 'code', 'school', 'ecole', 'projets', 'work']);
    if (hasStudy) {
      const studyChannels: any[] = [];
      if (prompt.includes('math')) studyChannels.push({ name: "📝-mathématiques", type: "text" });
      if (prompt.includes('code') || prompt.includes('dev') || prompt.includes('informatique')) studyChannels.push({ name: "💻-programmation", type: "text" });
      
      if (studyChannels.length === 0) {
        studyChannels.push({ name: "📚-entraide-générale", type: "text" });
      }

      categories.push({
        name: "📚 | MATIÈRES D'ÉTUDE",
        permissions: [
          { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
        ],
        channels: studyChannels
      });
    }

    // Catégorie STAFF PRIVÉE (si Staff demandé ou implicite)
    const hasStaff = this.containsFuzzy(tokens, 'staff', ['mod', 'admin', 'moderateur', 'prive', 'privé', 'secret']);
    if (hasStaff) {
      categories.push({
        name: "🔒 | ESPACE STAFF",
        permissions: [
          { roleName: "🛠️ | Staff", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "Connect", "Speak"] },
          { roleName: "@everyone", deny: ["ViewChannel"] }
        ],
        channels: [
          { name: "🛡️-discussions-staff", type: "text" },
          { name: "📟-rapports-audit", type: "text" },
          { name: "🔊 Réunion Staff", type: "voice" }
        ]
      });
    }

    // Catégorie SALONS VOCAUX (toujours créée avec salons par défaut ou duos)
    const voiceChannels = [
      { name: "🔊 Salon Vocal 1", type: "voice" as const },
      { name: "🔊 Salon Vocal 2", type: "voice" as const }
    ];
    if (prompt.includes("duo") || prompt.includes("trio")) {
      voiceChannels.push({ name: "🔊 Salon Duo 1", type: "voice" as const });
      voiceChannels.push({ name: "🔊 Salon Trio 1", type: "voice" as const });
    }
    categories.push({
      name: "🔊 | SALONS VOCAUX",
      permissions: [
        { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
      ],
      channels: voiceChannels
    });

    return {
      reply: `Architecture dynamique personnalisée générée en analysant les entités de votre prompt.`,
      data: { roles, categories }
    };
  }

  /**
   * Mode Copilot (Site Web) — Configuration interactive de bots.
   */
  private static async handleCopilot(
    userMessage: string, 
    systemContext: string,
    serverId?: string
  ): Promise<{ reply: string; update?: any }> {
    const msg = userMessage.toLowerCase();
    const replyParts: string[] = [];
    const featuresToAdd: string[] = [];
    let newPrompt = "";
    let extractedBotName = "";

    // 1. Lire les paramètres de sécurité existants depuis MongoDB (si disponibles)
    let currentRaidMode = false;
    let currentAntiLink = false;
    let currentSensitivity = 'medium';
    let currentMute = '10m';
    let currentWords: string[] = [];
    let isPremium = false;

    if (serverId) {
      try {
        const cacheKey = `server_${serverId}`;
        let server = this.getFromCache<any>(cacheKey);
        if (!server) {
          server = await Server.findOne({ serverId });
          this.setToCache(cacheKey, server, 20000);
        }

        if (server) {
          currentRaidMode = server.raidMode ?? false;
          currentAntiLink = server.antiLink ?? false;
          currentSensitivity = server.antiSpamSensitivity ?? 'medium';
          currentMute = server.muteDuration ?? '10m';
          currentWords = server.blacklistedWords ?? [];
          isPremium = server.isPremium ?? false;
        }
      } catch (err) {
        console.error("[ArcantAI] Copilot failed to fetch server configs:", err);
      }
    }

    const tokens = this.tokenize(msg);

    // Dictionnaire des synonymes élargis si Premium
    const antiLinkSyns = isPremium ? ['link', 'liens', 'website', 'url', 'pub'] : ['lien', 'liens'];
    const raidSyns = isPremium ? ['raid', 'panic', 'urgence', 'panicbutton', 'bloquer'] : ['raid', 'panic'];

    // 2. Traitement d'intents de configuration de sécurité en direct
    // -- Anti-Lien
    if (this.containsFuzzy(tokens, 'active', ['on', 'activer', 'bloque', 'bloquer']) && this.containsFuzzy(tokens, 'anti-lien', antiLinkSyns)) {
      currentAntiLink = true;
      replyParts.push("✓ Bloqueur de liens (Anti-Lien) activé.");
    } else if (this.containsFuzzy(tokens, 'désactive', ['off', 'desactiver', 'autorise', 'permettre']) && this.containsFuzzy(tokens, 'anti-lien', antiLinkSyns)) {
      currentAntiLink = false;
      replyParts.push("✓ Bloqueur de liens (Anti-Lien) désactivé.");
    }

    // -- Anti-Raid / Panic Button
    if (this.containsFuzzy(tokens, 'active', ['on', 'activer', 'verrouille', 'verrouiller']) && this.containsFuzzy(tokens, 'anti-raid', raidSyns)) {
      currentRaidMode = true;
      replyParts.push("🚨 Mode Anti-Raid activé (Panic Button armé). Le serveur est verrouillé.");
    } else if (this.containsFuzzy(tokens, 'désactive', ['off', 'desactiver', 'déverrouille', 'deverrouiller']) && this.containsFuzzy(tokens, 'anti-raid', raidSyns)) {
      currentRaidMode = false;
      replyParts.push("✓ Mode Anti-Raid désactivé. Le serveur est déverrouillé.");
    }

    // -- Renommer le bot (Extraction de nom)
    const nameMatch = userMessage.match(/(?:renomme le bot en|change le nom du bot en|nomme le bot)\s+['"\s]?([\w\-\s]+)['"\s]?/i);
    if (nameMatch && nameMatch[1]) {
      extractedBotName = nameMatch[1].trim();
      replyParts.push(`✓ Le bot a été renommé en "${extractedBotName}".`);
    }

    // -- Sensibilité Anti-Spam
    const spamMatch = msg.match(/(?:sensibilité|sensibilite|spam)\s+(?:à|a|de)\s+(\d+|haute|basse|moyenne|high|low|medium)/);
    if (spamMatch && spamMatch[1]) {
      const val = spamMatch[1];
      if (val === '1' || val === 'low' || val === 'basse') {
        currentSensitivity = 'low';
      } else if (val === '5' || val === 'high' || val === 'haute') {
        currentSensitivity = 'high';
      } else {
        currentSensitivity = 'medium';
      }
      replyParts.push(`✓ Sensibilité anti-spam réglée sur : ${currentSensitivity}.`);
    }

    // -- Durée de Sourdine (Mute)
    const muteMatch = msg.match(/(?:mute|muet)\s+(?:de|pour)\s+(\d+)\s*(m|h|min|heures|minutes|s|secondes)?/);
    if (muteMatch && muteMatch[1]) {
      const val = muteMatch[1];
      const unit = muteMatch[2]?.startsWith('h') ? 'h' : muteMatch[2]?.startsWith('s') ? 's' : 'm';
      currentMute = `${val}${unit}`;
      replyParts.push(`✓ Durée de sourdine (mute) réglée à ${currentMute}.`);
    }

    // -- Mots interdits / bannis
    const addWordMatch = userMessage.match(/(?:bloque le mot|bannis le mot|ajoute le mot banni)\s+['"\s]?([\w\-]+)['"\s]?/i);
    if (addWordMatch && addWordMatch[1]) {
      const word = addWordMatch[1].trim().toLowerCase();
      if (!currentWords.includes(word)) {
        currentWords.push(word);
        replyParts.push(`✓ Le mot "${word}" a été ajouté à la liste noire.`);
      }
    }
    const removeWordMatch = userMessage.match(/(?:retire le mot banni|débannis le mot|autorise le mot)\s+['"\s]?([\w\-]+)['"\s]?/i);
    if (removeWordMatch && removeWordMatch[1]) {
      const word = removeWordMatch[1].trim().toLowerCase();
      if (currentWords.includes(word)) {
        currentWords = currentWords.filter(w => w !== word);
        replyParts.push(`✓ Le mot "${word}" a été retiré de la liste noire.`);
      }
    }

    // 3. Détection des modules standards du bot (avec Tolérance Fuzzy)
    const activeKeywords = ['active', 'activer', 'ajoute', 'ajouter', 'installe', 'installer', 'on'];
    const shouldAddFeature = this.containsFuzzy(tokens, 'active', activeKeywords);

    if (shouldAddFeature || msg.includes("aide") || msg.includes("help")) {
      if (this.containsFuzzy(tokens, 'aide', ['help', 'menu'])) {
        featuresToAdd.push("help");
        replyParts.push("✓ Module d'aide configuré.");
      }
    }
    if (shouldAddFeature || msg.includes("modér") || msg.includes("mod") || msg.includes("bannir")) {
      if (this.containsFuzzy(tokens, 'modération', ['mod', 'moderation', 'ban', 'kick', 'bannir'])) {
        featuresToAdd.push("mod");
        replyParts.push("✓ Module de modération configuré.");
      }
    }
    if (shouldAddFeature || msg.includes("ticket") || msg.includes("support")) {
      if (this.containsFuzzy(tokens, 'ticket', ['tickets', 'support', 'aide-staff'])) {
        featuresToAdd.push("tickets");
        replyParts.push("✓ Système de tickets activé.");
      }
    }
    if (shouldAddFeature || msg.includes("éco") || msg.includes("eco") || msg.includes("argent")) {
      if (this.containsFuzzy(tokens, 'économie', ['eco', 'economy', 'argent', 'boutique', 'shop'])) {
        featuresToAdd.push("economy");
        replyParts.push("✓ Module d'économie activé.");
      }
    }
    if (shouldAddFeature || msg.includes("log") || msg.includes("audit")) {
      if (this.containsFuzzy(tokens, 'logs', ['audit', 'historique', 'suivi'])) {
        featuresToAdd.push("logs");
        replyParts.push("✓ Module de logs activé.");
      }
    }
    if (shouldAddFeature || msg.includes("level") || msg.includes("xp")) {
      if (this.containsFuzzy(tokens, 'leveling', ['xp', 'levels', 'rang', 'niveaux'])) {
        featuresToAdd.push("leveling");
        replyParts.push("✓ Système de leveling XP activé.");
      }
    }
    if (shouldAddFeature || msg.includes("welcome") || msg.includes("bienvenue")) {
      if (this.containsFuzzy(tokens, 'bienvenue', ['welcome', 'accueil', 'join'])) {
        featuresToAdd.push("welcome");
        replyParts.push("✓ Messages de bienvenue configurés.");
      }
    }

    // 4. Extraction de la personnalité
    if (this.containsFuzzy(tokens, 'sois', ['comporte-toi', 'personnalité', 'prompt'])) {
      const match = userMessage.match(/(?:sois|comporte-toi comme|personnalité d[e''])?\s+([^,.]+)/i);
      if (match && match[1]) {
        newPrompt = `Tu es un assistant qui se comporte comme : ${match[1].trim()}`;
        replyParts.push(`✓ Personnalité mise à jour : ${match[1].trim()}.`);
      } else {
        newPrompt = "Tu es un assistant intelligent et professionnel propulsé par Arcant.";
        replyParts.push("✓ Personnalité mise à jour.");
      }
    }

    if (featuresToAdd.length === 0 && replyParts.length === 0 && (msg.includes("active") || msg.includes("ajoute") || msg.includes("installe"))) {
      featuresToAdd.push("help", "mod");
      replyParts.push("✓ Modules standard installés (Aide, Modération).");
    }

    const replyMessage = replyParts.length > 0 
      ? replyParts.join(" ") 
      : "Configuration mise à jour avec succès par le Copilot d'Arcant.";

    // Parse current features & prompt from systemContext
    let currentFeatures: string[] = ["help"];
    if (systemContext.includes("Modules activés :")) {
      const parts = systemContext.split("Modules activés :")[1]?.split("\n")[0]?.trim();
      if (parts && parts !== "Aucun") {
        currentFeatures = parts.split(",").map(p => p.trim());
      }
    }
    let currentPrompt = "";
    if (systemContext.includes("Personnalité (Prompt) :")) {
      currentPrompt = systemContext.split("Personnalité (Prompt) :")[1]?.split("\n")[0]?.trim() || "";
    }

    // Invalider les caches
    if (serverId) {
      delete this.cache[`server_${serverId}`];
    }

    return {
      reply: replyMessage,
      update: {
        botName: extractedBotName || undefined,
        systemPrompt: newPrompt || currentPrompt || "Tu es l'assistant principal d'Arcant.",
        features: Array.from(new Set([...currentFeatures, ...featuresToAdd])),
        settings: {
          raidMode: currentRaidMode,
          antiLink: currentAntiLink,
          antiSpamSensitivity: currentSensitivity,
          muteDuration: currentMute,
          blacklistedWords: currentWords
        }
      }
    };
  }

  /**
   * Réponse intelligente par classification d'intentions
   */
  private static getSmartReply(
    msg: string,
    words: string[],
    mode: AIContextMode, 
    dbContext: string,
    serverSettingsText: string
  ): string {
    // 1. Salutations
    if (this.containsFuzzy(words, 'bonjour', ['salut', 'yo', 'hello', 'hey', 'bonsoir', 'coucou', 'wsh'])) {
      const replies = [
        `Salut ! Je suis l'IA d'Arcant. ${dbContext} Comment puis-je égayer ta journée aujourd'hui ?`,
        `Bonjour ! Ravi de te parler. Je suis l'IA d'Arcant. ${dbContext} De quoi souhaites-tu discuter ?`,
        `Yo ! Je suis le moteur d'IA d'Arcant. Tout est opérationnel de mon côté. ${dbContext} Qu'est-ce qu'on fait aujourd'hui ?`
      ];
      return replies[Math.floor(Math.random() * replies.length)] + serverSettingsText;
    }

    // 2. Humeur / Petites discussions
    if (this.containsFuzzy(words, 'va', ['comment', 'ca', 'ça', 'forme']) && (this.containsFuzzy(words, 'tu', ['comment', 'ca', 'ça']) || msg.includes("ça va") || msg.includes("ca va"))) {
      const replies = [
        "Je me sens super bien ! Je viens de nettoyer mon cache et tout est fluide. Et toi, comment ça va ?",
        "Tout va pour le mieux ! Mes algorithmes tournent à plein régime. Comment se passe ta journée ?",
        "Ça va nickel ! Prêt à t'aider ou à configurer ton serveur. Et toi ?"
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 3. Ton créateur / Origine
    if (this.containsFuzzy(words, 'créateur', ['crée', 'cree', 'developpeur', 'dev', 'boss', 'patron', 'gorthek', 'qui t\'a'])) {
      return "J'ai été conçu par **Gorthek** (le créateur d'Arcant) pour être un moteur d'IA 100% autonome, ultra-rapide et intégré dans l'écosystème Arcant. Il m'a programmé en TypeScript pur avec amour !";
    }

    // 4. Blagues
    if (this.containsFuzzy(words, 'blague', ['raconte', 'rire', 'drôle', 'humour'])) {
      const jokes = [
        "Pourquoi les développeurs détestent-ils la nature ? Parce qu'il y a trop de bugs ! 🐛",
        "Que dit un bit qui a de la fièvre ? 'Je crois que j'ai un chaud-octet !' 🤒",
        "Combien de développeurs faut-il pour changer une ampoule ? Aucun, c'est un problème matériel ! 💡",
        "Un SQL entre dans un bar, va voir deux tables et demande : 'Je peux me joindre à vous ?' 📊",
        "Pourquoi le bot est-il allé chez le psychologue ? Parce qu'il avait trop de conflits de commit ! 🧠"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 5. Conseils de modération / Sécurité
    if (this.containsFuzzy(words, 'conseil', ['protéger', 'securite', 'securiser', 'conseils', 'moderation', 'anti-raid'])) {
      return "🛡️ **Conseils de sécurité Arcant** :\n" +
        "1. Activez le **Bloqueur de Liens** pour stopper les invitations suspectes.\n" +
        "2. Réglez la **Sensibilité Anti-Spam** sur *medium* ou *high* pour bloquer les spammeurs.\n" +
        "3. En cas d'attaque, écrivez *« active l'anti-raid »* dans le chat du Copilot pour verrouiller instantanément le serveur.\n" +
        "4. Utilisez mes règles personnalisées autonomes (ex: *« quand je dis 'règles', réponds... »*) pour guider vos membres.";
    }

    // 6. Remerciements
    if (this.containsFuzzy(words, 'merci', ['thanks', 'ty', 'super', 'cool', 'parfait', 'gg'])) {
      const replies = [
        "De rien ! C'est un plaisir d'aider.",
        "Avec plaisir ! N'hésite pas si tu as d'autres questions.",
        "Pas de souci ! Je suis là pour ça. 😉"
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 7. Identification
    if (msg.includes("qui es-tu") || msg.includes("qui es tu") || msg.includes("c'est quoi arcant")) {
      return `Je suis l'intelligence artificielle propre à Arcant. Je ne suis ni Gemini, ni ChatGPT — je suis un moteur autonome intégré directement dans l'écosystème Arcant. ${dbContext} Je fonctionne de manière identique sur le site web, l'API REST, et le bot Discord.${serverSettingsText}`;
    }

    // 8. Aide générale
    if (msg.includes("help") || msg.includes("aide") || msg.includes("commande")) {
      if (mode === 'discord') {
        return "Voici mes commandes : `.ask <question>` pour me poser une question, `.help` pour l'aide complète. Mon panneau web vous permet aussi de configurer mes réponses personnalisées et mes modules de sécurité.";
      }
      return "Mon panneau web vous permet d'associer des mots-clés à des réponses personnalisées et de configurer mes modules de modération, sécurité, tickets, économie et leveling. Tout est synchronisé avec la base de données en temps réel.";
    }

    // 9. Premium
    if (msg.includes("premium") || msg.includes("pro") || msg.includes("upgrade")) {
      return "Arcant Premium débloque l'analyse sémantique avancée, la génération d'architecture de serveurs par IA, et le système de bot personnalisé illimité. Rendez-vous sur la page Pricing du site web pour plus d'informations.";
    }

    // 10. Stats
    if (msg.includes("stat") || msg.includes("info") || msg.includes("données")) {
      return `${dbContext} Toutes ces données sont synchronisées en temps réel entre le site web, l'API et le bot Discord.${serverSettingsText}`;
    }

    // Fallback générique intelligent et conversationnel
    const fallbacks = [
      `J'ai bien reçu ton message ! ${dbContext}\nSi tu souhaites m'apprendre des réponses personnalisées, tu peux me dire : *« quand je dis 'mot', réponds 'ma réponse' »* !`,
      `Intéressant ! Je garde ça dans mes variables. ${dbContext}\nJe suis programmé pour répondre à tes questions ou configurer ton serveur. Que veux-tu faire ?`,
      `Message analysé avec succès. ${dbContext}\nTu peux à tout moment personnaliser mes réponses ou ma personnalité depuis le dashboard ou directement par écrit !`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)] + serverSettingsText;
  }

  /**
   * Backward compatible wrapper for existing code that uses the old signature.
   */
  public static async processMessageLegacy(
    userMessage: string,
    serverId?: string,
    systemContext: string = ''
  ): Promise<{ reply: string; update?: any }> {
    const mode: AIContextMode = systemContext.includes('Copilot') ? 'copilot' : 'discord';
    return this.processMessage(userMessage, { mode, serverId, systemContext });
  }
}
