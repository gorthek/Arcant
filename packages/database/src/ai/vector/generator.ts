export type TargetProfile = 'SIMPLE_GAMING' | 'COMPLEX_COMMUNITY' | 'DEV_TEAM' | 'STAFF_MODERATION' | 'ESPORT_TEAM' | 'DEFAULT_FALLBACK';
/**
 * Discord API Channel Types simplified for our generator
 */
export enum DiscordChannelType {
  GUILD_TEXT = 0,
  GUILD_VOICE = 2,
  GUILD_CATEGORY = 4,
  GUILD_FORUM = 15
}

export interface DiscordRoleData {
  name: string;
  color: number;
  hoist: boolean;
  permissions: string; // BigInt string for Discord API
}

export interface DiscordChannelData {
  name: string;
  type: DiscordChannelType;
  parentName?: string; // We use name mapping instead of ID for generation
  topic?: string;
}

export interface DiscordGuildTemplate {
  roles: DiscordRoleData[];
  categories: { name: string }[];
  channels: DiscordChannelData[];
}

export class DiscordGenerator {
  /**
   * Generates a complete Discord Server structure JSON based on the AI's Target Profile.
   */
  public static generateForProfile(profile: TargetProfile): DiscordGuildTemplate {
    switch (profile) {
      case 'SIMPLE_GAMING':
        return this.getSimpleGamingTemplate();
      case 'COMPLEX_COMMUNITY':
        return this.getComplexCommunityTemplate();
      case 'DEV_TEAM':
        return this.getDevTeamTemplate();
      case 'STAFF_MODERATION':
        return this.getStaffModerationTemplate();
      case 'ESPORT_TEAM':
        return this.getEsportTeamTemplate();
      case 'DEFAULT_FALLBACK':
      default:
        return this.getDefaultTemplate();
    }
  }

  private static getSimpleGamingTemplate(): DiscordGuildTemplate {
    return {
      roles: [
        { name: 'Admin', color: 0xff0000, hoist: true, permissions: '8' },
        { name: 'Joueur', color: 0x3498db, hoist: true, permissions: '104320577' }
      ],
      categories: [
        { name: 'ACCUEIL' },
        { name: 'GAMING' },
        { name: 'VOCAUX' }
      ],
      channels: [
        { name: 'bienvenue', type: DiscordChannelType.GUILD_TEXT, parentName: 'ACCUEIL' },
        { name: 'discussions', type: DiscordChannelType.GUILD_TEXT, parentName: 'GAMING' },
        { name: 'recherche-joueurs', type: DiscordChannelType.GUILD_TEXT, parentName: 'GAMING' },
        { name: 'Général Vocal', type: DiscordChannelType.GUILD_VOICE, parentName: 'VOCAUX' },
        { name: 'Gaming 1', type: DiscordChannelType.GUILD_VOICE, parentName: 'VOCAUX' }
      ]
    };
  }

  private static getComplexCommunityTemplate(): DiscordGuildTemplate {
    return {
      roles: [
        { name: 'Fondateur', color: 0xff0000, hoist: true, permissions: '8' },
        { name: 'Administrateur', color: 0xe67e22, hoist: true, permissions: '8' },
        { name: 'Modérateur', color: 0xf1c40f, hoist: true, permissions: '1099511627775' },
        { name: 'VIP', color: 0x9b59b6, hoist: true, permissions: '104320577' },
        { name: 'Membre Actif', color: 0x2ecc71, hoist: false, permissions: '104320577' },
        { name: 'Membre', color: 0x95a5a6, hoist: false, permissions: '104320577' }
      ],
      categories: [
        { name: '📢 INFORMATIONS' },
        { name: '💬 COMMUNAUTÉ' },
        { name: '📚 FORUMS' },
        { name: '🔊 VOCAUX' },
        { name: '🛡️ STAFF' }
      ],
      channels: [
        // Infos
        { name: 'annonces', type: DiscordChannelType.GUILD_TEXT, parentName: '📢 INFORMATIONS' },
        { name: 'règlement', type: DiscordChannelType.GUILD_TEXT, parentName: '📢 INFORMATIONS' },
        // Communauté
        { name: 'général', type: DiscordChannelType.GUILD_TEXT, parentName: '💬 COMMUNAUTÉ' },
        { name: 'médias', type: DiscordChannelType.GUILD_TEXT, parentName: '💬 COMMUNAUTÉ' },
        { name: 'commandes-bots', type: DiscordChannelType.GUILD_TEXT, parentName: '💬 COMMUNAUTÉ' },
        // Forums (Rich structured)
        { name: 'présentations', type: DiscordChannelType.GUILD_FORUM, parentName: '📚 FORUMS', topic: 'Présentez-vous à la communauté !' },
        { name: 'discussions-libres', type: DiscordChannelType.GUILD_FORUM, parentName: '📚 FORUMS', topic: 'Créez un post pour discuter de tout et de rien.' },
        // Vocaux
        { name: 'Lounge Vocal', type: DiscordChannelType.GUILD_VOICE, parentName: '🔊 VOCAUX' },
        { name: 'Discussion 1', type: DiscordChannelType.GUILD_VOICE, parentName: '🔊 VOCAUX' },
        { name: 'Discussion 2', type: DiscordChannelType.GUILD_VOICE, parentName: '🔊 VOCAUX' },
        // Staff
        { name: 'staff-chat', type: DiscordChannelType.GUILD_TEXT, parentName: '🛡️ STAFF' },
        { name: 'Réunion Staff', type: DiscordChannelType.GUILD_VOICE, parentName: '🛡️ STAFF' }
      ]
    };
  }

  private static getDevTeamTemplate(): DiscordGuildTemplate {
    return {
      roles: [
        { name: 'Lead Dev', color: 0xe74c3c, hoist: true, permissions: '8' },
        { name: 'Développeur', color: 0x3498db, hoist: true, permissions: '104320577' },
        { name: 'Testeur QA', color: 0xf1c40f, hoist: true, permissions: '104320577' },
        { name: 'Bot', color: 0x2c3e50, hoist: false, permissions: '104320577' }
      ],
      categories: [
        { name: '🚀 PROJET' },
        { name: '💻 DÉVELOPPEMENT' },
        { name: '🐛 TRACKING' },
        { name: '🎙️ MEETINGS' }
      ],
      channels: [
        { name: 'annonces-projet', type: DiscordChannelType.GUILD_TEXT, parentName: '🚀 PROJET' },
        { name: 'github-logs', type: DiscordChannelType.GUILD_TEXT, parentName: '💻 DÉVELOPPEMENT' },
        { name: 'dev-chat', type: DiscordChannelType.GUILD_TEXT, parentName: '💻 DÉVELOPPEMENT' },
        { name: 'rapport-bugs', type: DiscordChannelType.GUILD_FORUM, parentName: '🐛 TRACKING', topic: 'Signalez les bugs ici' },
        { name: 'Daily Standup', type: DiscordChannelType.GUILD_VOICE, parentName: '🎙️ MEETINGS' }
      ]
    };
  }

  private static getStaffModerationTemplate(): DiscordGuildTemplate {
    return {
      roles: [
        { name: 'Direction', color: 0x000000, hoist: true, permissions: '8' },
        { name: 'SuperAdmin', color: 0xc0392b, hoist: true, permissions: '8' },
        { name: 'Modérateur', color: 0x2980b9, hoist: true, permissions: '1099511627775' },
        { name: 'Support', color: 0x27ae60, hoist: true, permissions: '104320577' }
      ],
      categories: [
        { name: '🚨 SÉCURITÉ' },
        { name: '📝 GESTION TICKETS' },
        { name: '📋 LOGS & AUDITS' },
        { name: '🔐 SALLES PRIVÉES' }
      ],
      channels: [
        { name: 'alertes-raids', type: DiscordChannelType.GUILD_TEXT, parentName: '🚨 SÉCURITÉ' },
        { name: 'support-forum', type: DiscordChannelType.GUILD_FORUM, parentName: '📝 GESTION TICKETS', topic: 'Résolution des problèmes utilisateurs' },
        { name: 'logs-modération', type: DiscordChannelType.GUILD_TEXT, parentName: '📋 LOGS & AUDITS' },
        { name: 'Bureau Direction', type: DiscordChannelType.GUILD_VOICE, parentName: '🔐 SALLES PRIVÉES' }
      ]
    };
  }

  private static getEsportTeamTemplate(): DiscordGuildTemplate {
    return {
      roles: [
        { name: 'Manager', color: 0x8e44ad, hoist: true, permissions: '8' },
        { name: 'Coach', color: 0x2980b9, hoist: true, permissions: '104320577' },
        { name: 'Joueur Pro', color: 0xf1c40f, hoist: true, permissions: '104320577' },
        { name: 'Tryharder', color: 0xe67e22, hoist: true, permissions: '104320577' },
        { name: 'Fan', color: 0xecf0f1, hoist: false, permissions: '104320577' }
      ],
      categories: [
        { name: '🏆 ESPORT' },
        { name: '⚔️ MATCHMAKING' },
        { name: '🧠 STRATÉGIE' },
        { name: '🎙️ VOCAUX TEAM' }
      ],
      channels: [
        { name: 'news-esport', type: DiscordChannelType.GUILD_TEXT, parentName: '🏆 ESPORT' },
        { name: 'recherche-scrims', type: DiscordChannelType.GUILD_FORUM, parentName: '⚔️ MATCHMAKING', topic: 'Trouver des équipes contre qui s\'entraîner' },
        { name: 'analyse-vod', type: DiscordChannelType.GUILD_TEXT, parentName: '🧠 STRATÉGIE' },
        { name: 'Entraînement A', type: DiscordChannelType.GUILD_VOICE, parentName: '🎙️ VOCAUX TEAM' },
        { name: 'Entraînement B', type: DiscordChannelType.GUILD_VOICE, parentName: '🎙️ VOCAUX TEAM' }
      ]
    };
  }

  private static getDefaultTemplate(): DiscordGuildTemplate {
    return {
      roles: [
        { name: 'Propriétaire', color: 0xf1c40f, hoist: true, permissions: '8' },
        { name: 'Membre', color: 0x95a5a6, hoist: false, permissions: '104320577' }
      ],
      categories: [
        { name: 'GÉNÉRAL' }
      ],
      channels: [
        { name: 'général', type: DiscordChannelType.GUILD_TEXT, parentName: 'GÉNÉRAL' },
        { name: 'Général Vocal', type: DiscordChannelType.GUILD_VOICE, parentName: 'GÉNÉRAL' }
      ]
    };
  }
}
