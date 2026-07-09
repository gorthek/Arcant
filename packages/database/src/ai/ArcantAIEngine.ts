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
  /**
   * Analyse et génère une réponse unifiée pour le Bot Discord, l'API ou le Site Web.
   * L'IA est propre à Arcant — aucune dépendance externe (pas de Gemini, pas d'OpenAI).
   * Elle utilise un moteur de règles intelligent avec détection de patterns avancés.
   */
  public static async processMessage(
    userMessage: string,
    context: AIContext
  ): Promise<{ reply: string; update?: any; data?: any }> {
    const msg = userMessage.toLowerCase().trim();
    const { mode, serverId, systemContext } = context;

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

    // 3. Recherche de règles personnalisées dans la DB
    if (serverId) {
      try {
        const rules = await AIRule.find({ serverId });
        for (const rule of rules) {
          const trigger = rule.trigger.toLowerCase().trim();
          if (msg.includes(trigger)) {
            let responseText = rule.response;
            
            const serverInfo = await Server.findOne({ serverId });
            const botInfo = await CustomBot.findOne({ serverId });

            // Remplacement des variables dynamiques
            responseText = responseText.replace(/{user}/g, `<@user>`);
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

    // 4. Enrichir le contexte avec les données réelles de la DB
    let enrichedContext = '';
    let serverSettingsText = '';
    try {
      const dbStats = await this.getDBStats();
      enrichedContext = `[Contexte Arcant] ${dbStats.serversCount} serveurs, ${dbStats.botsCount} bots, ${dbStats.usersCount} utilisateurs, ${dbStats.aiRulesCount} règles IA configurées.`;
      
      if (serverId) {
        const serverInfo = await Server.findOne({ serverId });
        if (serverInfo) {
          serverSettingsText = `\n⚙️ **Configuration actuelle de ${serverInfo.name}** :\n` +
            `- 🛡️ **Mode Anti-Raid** : ${serverInfo.raidMode ? '🔴 Activé (Le serveur est verrouillé)' : '🟢 Désactivé'}\n` +
            `- 🔗 **Anti-Lien** : ${serverInfo.antiLink ? '🔒 Activé (Liens bloqués)' : '🔓 Désactivé'}\n` +
            `- ⚠️ **Sensibilité Anti-Spam** : Niveau ${serverInfo.antiSpamSensitivity}/5\n` +
            `- 📝 **Mots interdits** : ${serverInfo.blacklistedWords?.join(', ') || 'Aucun'}`;
        }
      }
    } catch (e) {
      enrichedContext = '[Contexte Arcant] Données DB indisponibles.';
    }

    // 5. Réponse intelligente contextuelle
    const reply = this.getSmartReply(msg, mode, enrichedContext, serverSettingsText);
    return { reply };
  }

  /**
   * Récupère les statistiques réelles de la DB MongoDB.
   */
  public static async getDBStats() {
    try {
      const [serversCount, botsCount, usersCount, aiRulesCount] = await Promise.all([
        Server.countDocuments(),
        CustomBot.countDocuments(),
        User.countDocuments(),
        AIRule.countDocuments()
      ]);
      return { serversCount, botsCount, usersCount, aiRulesCount };
    } catch (e) {
      return { serversCount: 0, botsCount: 0, usersCount: 0, aiRulesCount: 0 };
    }
  }

  /**
   * Mode API — Retourne du JSON structuré pour les appels programmatiques.
   */
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
   * Mode Server Generation (Génération d'architecture de serveur Discord)
   * Analyse et produit un JSON structuré thématique de rôles et salons.
   */
  private static handleServerGeneration(userMessage: string): { reply: string; data: any } {
    const prompt = userMessage.toLowerCase();
    
    // Détection thématique
    const gamingKeywords = ['jeu', 'gaming', 'gamer', 'play', 'valorant', 'lol', 'league', 'minecraft', 'fortnite', 'esport', 'coop', 'potes', 'stream', 'twitch', 'csgo', 'fifa', 'apex', 'overwatch', 'cod', 'warzone'];
    const rpKeywords = ['rp', 'roleplay', 'gta', 'police', 'citoyen', 'mairie', 'secours', 'pompier', 'ville', 'gendarmerie', 'realiste', 'job', 'entreprise', 'mafia', 'gang'];
    const animeKeywords = ['anime', 'manga', 'otaku', 'japon', 'naruto', 'one piece', 'demon slayer', 'dbz', 'ghibli', 'dessin', 'animation', 'snk', 'bleach', 'hunter'];
    const studyKeywords = ['etude', 'cours', 'travail', 'dev', 'code', 'prog', 'school', 'ecole', 'bibliotheque', 'aide', 'entraide', 'projets', 'work', 'universite', 'lycee'];

    let gamingScore = 0;
    let rpScore = 0;
    let animeScore = 0;
    let studyScore = 0;

    const words = prompt.split(/\s+/);
    for (const w of words) {
      const cleanW = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      if (gamingKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw))) gamingScore++;
      if (rpKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw))) rpScore++;
      if (animeKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw))) animeScore++;
      if (studyKeywords.some(kw => kw.includes(cleanW) || cleanW.includes(kw))) studyScore++;
    }

    let theme: 'gaming' | 'rp' | 'anime' | 'study' | 'community' = 'community';
    let maxScore = 0;

    if (gamingScore > maxScore) { maxScore = gamingScore; theme = 'gaming'; }
    if (rpScore > maxScore) { maxScore = rpScore; theme = 'rp'; }
    if (animeScore > maxScore) { maxScore = animeScore; theme = 'anime'; }
    if (studyScore > maxScore) { maxScore = studyScore; theme = 'study'; }

    // Personnalisation des chaînes de jeux ou de matières
    const specificGames: string[] = [];
    if (prompt.includes('valorant')) specificGames.push('Valorant');
    if (prompt.includes('league') || prompt.includes('lol')) specificGames.push('League of Legends');
    if (prompt.includes('minecraft')) specificGames.push('Minecraft');
    if (prompt.includes('fortnite')) specificGames.push('Fortnite');
    if (prompt.includes('apex')) specificGames.push('Apex Legends');
    if (prompt.includes('csgo') || prompt.includes('cs:go') || prompt.includes('counter')) specificGames.push('CS:GO');

    const specificSubjects: string[] = [];
    if (prompt.includes('math')) specificSubjects.push('Mathématiques');
    if (prompt.includes('physique') || prompt.includes('chimie')) specificSubjects.push('Sciences');
    if (prompt.includes('code') || prompt.includes('dev') || prompt.includes('informatique')) specificSubjects.push('Informatique');

    let roles: { name: string; color: string }[] = [];
    let categories: any[] = [];

    switch (theme) {
      case 'gaming':
        roles = [
          { name: "👑 | Fondateur", color: "#14b8a6" },
          { name: "🛠️ | Staff", color: "#10b981" },
          { name: "💎 | VIP", color: "#3b82f6" },
          { name: "🎮 | Gamer", color: "#a855f7" },
        ];
        
        categories = [
          {
            name: "📢 | ACCUEIL",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
            ],
            channels: [
              { name: "📌-nouveautés", type: "text" },
              { name: "📜-règlement", type: "text" },
              { name: "🎁-annonces", type: "text" }
            ]
          },
          {
            name: "💬 | CHAT GENERAL",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
            ],
            channels: [
              { name: "💬-général", type: "text" },
              { name: "🤖-commands", type: "text" },
              { name: "📷-medias", type: "text" }
            ]
          }
        ];

        const gameChannels = specificGames.length > 0 
          ? specificGames.map(g => ({ name: `🎮-${g.toLowerCase().replace(/\s+/g, '-')}`, type: "text" as const }))
          : [{ name: "🎮-recherche-de-groupe", type: "text" as const }, { name: "🏆-clips-gaming", type: "text" as const }];

        categories.push({
          name: "🎮 | ZONE GAMING",
          permissions: [
            { roleName: "🎮 | Gamer", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "Connect", "Speak"] }
          ],
          channels: [
            ...gameChannels,
            { name: "🔊 Salon Vocal 1", type: "voice" },
            { name: "🔊 Duo/Trio 1", type: "voice" }
          ]
        });
        break;

      case 'rp':
        roles = [
          { name: "👑 | Fondateur", color: "#ef4444" },
          { name: "👮 | Police", color: "#3b82f6" },
          { name: "🚑 | EMS/Secours", color: "#eab308" },
          { name: "🚗 | Citoyen", color: "#10b981" }
        ];

        categories = [
          {
            name: "🏢 | HÔTEL DE VILLE",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
            ],
            channels: [
              { name: "📢-annonces-ville", type: "text" },
              { name: "📜-lois-du-serveur", type: "text" },
              { name: "📝-dossier-citoyen", type: "text" }
            ]
          },
          {
            name: "💬 | SECTEUR PUBLIC",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
            ],
            channels: [
              { name: "💬-discussions-rp", type: "text" },
              { name: "🌐-réseaux-sociaux", type: "text" },
              { name: "🏪-petites-annonces", type: "text" }
            ]
          },
          {
            name: "📻 | SECTEUR SERVICES",
            permissions: [
              { roleName: "👮 | Police", allow: ["ViewChannel", "SendMessages"] },
              { roleName: "🚑 | EMS/Secours", allow: ["ViewChannel", "SendMessages"] },
              { roleName: "@everyone", deny: ["ViewChannel"] }
            ],
            channels: [
              { name: "📟-rapport-intervention", type: "text" },
              { name: "🔊 Centrale Radio", type: "voice" },
              { name: "🔊 Fréquence Police", type: "voice" },
              { name: "🔊 Fréquence EMS", type: "voice" }
            ]
          }
        ];
        break;

      case 'anime':
        roles = [
          { name: "🏮 | Hokage", color: "#f97316" },
          { name: "🗡️ | Shinobi", color: "#ec4899" },
          { name: "🌸 | Otaku", color: "#f472b6" },
        ];

        categories = [
          {
            name: "⛩️ | ACCUEIL",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
            ],
            channels: [
              { name: "📌-règlement", type: "text" },
              { name: "📢-annonces", type: "text" }
            ]
          },
          {
            name: "🏮 | SALONS OTAKU",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
            ],
            channels: [
              { name: "💬-général", type: "text" },
              { name: "📚-manga-animes", type: "text" },
              { name: "🖼️-fanarts", type: "text" }
            ]
          },
          {
            name: "🏮 | SALONS VOCAUX",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
            ],
            channels: [
              { name: "🔊 Discussion 1", type: "voice" },
              { name: "🔊 Co-Working Anime", type: "voice" }
            ]
          }
        ];
        break;

      case 'study':
        roles = [
          { name: "👑 | Enseignant/Staff", color: "#3b82f6" },
          { name: "📚 | Tuteur/Expert", color: "#10b981" },
          { name: "✏️ | Étudiant", color: "#6b7280" }
        ];

        const subjectChannels = specificSubjects.length > 0
          ? specificSubjects.map(s => ({ name: `📝-${s.toLowerCase().replace(/\s+/g, '-')}`, type: "text" as const }))
          : [{ name: "📝-entraide-générale", type: "text" as const }, { name: "💻-code-entraide", type: "text" as const }];

        categories = [
          {
            name: "📋 | INFORMATIONS",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
            ],
            channels: [
              { name: "📌-ressources", type: "text" },
              { name: "📢-annonces-etudes", type: "text" }
            ]
          },
          {
            name: "📚 | MATIÈRES D'ÉTUDE",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
            ],
            channels: [
              ...subjectChannels,
              { name: "💬-salon-detente", type: "text" }
            ]
          },
          {
            name: "🔊 | SALLES D'ÉTUDE",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
            ],
            channels: [
              { name: "🔊 Salle d'étude silencieuse", type: "voice" },
              { name: "🔊 Travail de groupe 1", type: "voice" },
              { name: "🔊 Travail de groupe 2", type: "voice" }
            ]
          }
        ];
        break;

      default:
        roles = [
          { name: "👑 | Créateur", color: "#06b6d4" },
          { name: "💎 | VIP", color: "#eab308" },
          { name: "👥 | Membre", color: "#94a3b8" }
        ];

        categories = [
          {
            name: "📢 | INFORMATIONS",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "ReadMessageHistory"], deny: ["SendMessages"] }
            ],
            channels: [
              { name: "📌-accueil", type: "text" },
              { name: "📜-règlement", type: "text" },
              { name: "📢-annonces", type: "text" }
            ]
          },
          {
            name: "💬 | DISCUSSIONS",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
            ],
            channels: [
              { name: "💬-général", type: "text" },
              { name: "🎪-événements", type: "text" },
              { name: "🎥-medias", type: "text" },
              { name: "🤖-commandes-bot", type: "text" }
            ]
          },
          {
            name: "🔊 | CHANNELS VOCAUX",
            permissions: [
              { roleName: "@everyone", allow: ["ViewChannel", "Connect", "Speak"] }
            ],
            channels: [
              { name: "🔊 Salon Public 1", type: "voice" },
              { name: "🔊 Salon Public 2", type: "voice" },
              { name: "🔊 Gaming Voc 1", type: "voice" }
            ]
          }
        ];
        break;
    }

    return {
      reply: `Structure de type "${theme.toUpperCase()}" générée avec succès pour votre serveur.`,
      data: {
        roles,
        categories
      }
    };
  }

  /**
   * Mode Copilot (Site Web) — Configuration interactive de bots.
   * Modifie les fonctionnalités et met à jour à chaud les paramètres de la base de données.
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

    // 1. Lire les paramètres de sécurité existants depuis MongoDB (si disponibles)
    let currentRaidMode = false;
    let currentAntiLink = false;
    let currentSensitivity = 'medium';
    let currentMute = '10m';
    let currentWords: string[] = [];

    if (serverId) {
      try {
        const server = await Server.findOne({ serverId });
        if (server) {
          currentRaidMode = server.raidMode ?? false;
          currentAntiLink = server.antiLink ?? false;
          currentSensitivity = server.antiSpamSensitivity ?? 'medium';
          currentMute = server.muteDuration ?? '10m';
          currentWords = server.blacklistedWords ?? [];
        }
      } catch (err) {
        console.error("[ArcantAI] Copilot failed to fetch server configs:", err);
      }
    }

    // 2. Traitement d'intents de configuration de sécurité en direct
    // -- Anti-Lien
    if (msg.includes("active l'anti-lien") || msg.includes("active anti-lien") || msg.includes("bloque les liens") || msg.includes("active anti-link") || msg.includes("active l'anti-link")) {
      currentAntiLink = true;
      replyParts.push("✓ Bloqueur de liens (Anti-Lien) activé.");
    } else if (msg.includes("désactive l'anti-lien") || msg.includes("désactive anti-lien") || msg.includes("autorise les liens") || msg.includes("désactive anti-link") || msg.includes("désactive l'anti-link")) {
      currentAntiLink = false;
      replyParts.push("✓ Bloqueur de liens (Anti-Lien) désactivé.");
    }

    // -- Anti-Raid / Panic Button
    if (msg.includes("active l'anti-raid") || msg.includes("active anti-raid") || msg.includes("panic button") || msg.includes("bloque le serveur") || msg.includes("verrouille le serveur")) {
      currentRaidMode = true;
      replyParts.push("🚨 Mode Anti-Raid activé (Panic Button armé). Le serveur est verrouillé.");
    } else if (msg.includes("désactive l'anti-raid") || msg.includes("désactive anti-raid") || msg.includes("débloque le serveur") || msg.includes("déverrouille le serveur")) {
      currentRaidMode = false;
      replyParts.push("✓ Mode Anti-Raid désactivé. Le serveur est déverrouillé.");
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

    // 3. Détection des modules standards du bot
    if (msg.includes("aide") || msg.includes("help")) {
      featuresToAdd.push("help");
      replyParts.push("✓ Module d'aide configuré.");
    }
    if (msg.includes("modér") || msg.includes("mod") || msg.includes("bannir") || msg.includes("kick")) {
      featuresToAdd.push("mod");
      replyParts.push("✓ Module de modération configuré.");
    }
    if (msg.includes("ticket") || msg.includes("support")) {
      featuresToAdd.push("tickets");
      replyParts.push("✓ Système de tickets activé.");
    }
    if (msg.includes("éco") || msg.includes("eco") || msg.includes("argent") || msg.includes("boutique")) {
      featuresToAdd.push("economy");
      replyParts.push("✓ Module d'économie activé.");
    }
    if (msg.includes("log") || msg.includes("audit") || msg.includes("historique")) {
      featuresToAdd.push("logs");
      replyParts.push("✓ Module de logs activé.");
    }
    if (msg.includes("level") || msg.includes("xp") || msg.includes("rang")) {
      featuresToAdd.push("leveling");
      replyParts.push("✓ Système de leveling XP activé.");
    }
    if (msg.includes("welcome") || msg.includes("bienvenue") || msg.includes("accueil")) {
      featuresToAdd.push("welcome");
      replyParts.push("✓ Messages de bienvenue configurés.");
    }

    // 4. Extraction de la personnalité
    if (msg.includes("sois") || msg.includes("comporte-toi") || msg.includes("personnalité") || msg.includes("prompt")) {
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

    return {
      reply: replyMessage,
      update: {
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
   * Réponse intelligente contextuelle avec enrichissement DB.
   */
  private static getSmartReply(
    msg: string, 
    mode: AIContextMode, 
    dbContext: string,
    serverSettingsText: string
  ): string {
    // Salutations
    if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("yo") || msg.includes("hello") || msg.includes("hey")) {
      return `Bonjour ! Je suis l'IA d'Arcant, le moteur unifié qui propulse le site web, l'API, le bot Discord et la base de données. ${dbContext}\nComment puis-je vous aider ?${serverSettingsText}`;
    }

    // Identification
    if (msg.includes("qui es-tu") || msg.includes("qui es tu") || msg.includes("c'est quoi arcant")) {
      return `Je suis l'intelligence artificielle propre à Arcant. Je ne suis ni Gemini, ni ChatGPT — je suis un moteur autonome intégré directement dans l'écosystème Arcant. ${dbContext} Je fonctionne de manière identique sur le site web, l'API REST, et le bot Discord.${serverSettingsText}`;
    }

    // Aide
    if (msg.includes("help") || msg.includes("aide") || msg.includes("commande")) {
      if (mode === 'discord') {
        return "Voici mes commandes : `.ask <question>` pour me poser une question, `.help` pour l'aide complète. Mon panneau web vous permet aussi de configurer mes réponses personnalisées et mes modules de sécurité.";
      }
      return "Mon panneau web vous permet d'associer des mots-clés à des réponses personnalisées et de configurer mes modules de modération, sécurité, tickets, économie et leveling. Tout est synchronisé avec la base de données en temps réel.";
    }

    // Premium
    if (msg.includes("premium") || msg.includes("pro") || msg.includes("upgrade")) {
      return "Arcant Premium débloque l'analyse sémantique avancée, la génération d'architecture de serveurs par IA, et le système de bot personnalisé illimité. Rendez-vous sur la page Pricing du site web pour plus d'informations.";
    }

    // Stats
    if (msg.includes("stat") || msg.includes("info") || msg.includes("données")) {
      return `${dbContext} Toutes ces données sont synchronisées en temps réel entre le site web, l'API et le bot Discord.${serverSettingsText}`;
    }

    // Sécurité
    if (msg.includes("sécurité") || msg.includes("raid") || msg.includes("protection") || msg.includes("anti") || msg.includes("config")) {
      return `Le module de sécurité d'Arcant inclut : Anti-Raid (Panic Button), Captcha par MP, Anti-Lien, Anti-Selfbot, Scanner d'âge de compte, Limite de mentions, et Protection Staff anti-mass ban. Tout est configurable depuis le dashboard.${serverSettingsText}`;
    }

    // Fallback générique
    return `Message bien reçu par l'IA unifiée d'Arcant. ${dbContext}\nConfigurez mes réponses personnalisées depuis le tableau de bord web !${serverSettingsText}`;
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
