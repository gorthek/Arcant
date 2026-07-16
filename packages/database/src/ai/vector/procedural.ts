import { DiscordGuildTemplate, DiscordRoleData, DiscordChannelData, DiscordChannelType } from './generator';
import { Vector16D } from './math';

export class ProceduralBuilder {
  /**
   * Generates a dynamic server blueprint based on the 16D vector score
   */
  public static buildFromVector(vector: Vector16D): DiscordGuildTemplate {
    const template: DiscordGuildTemplate = { roles: [], categories: [], channels: [] };

    const [
      audio, mod, gaming, social, structured, complexity, scale,
      rp, economy, dev, esport, education, content, web3, art, support
    ] = vector;

    // 1. BASE MODULE: Welcome & Rules (always present)
    template.categories.push({ name: '📌 ACCUEIL & INFOS' });
    template.channels.push({ name: 'règlement', type: DiscordChannelType.GUILD_TEXT, parentName: '📌 ACCUEIL & INFOS' });
    template.channels.push({ name: 'annonces', type: DiscordChannelType.GUILD_TEXT, parentName: '📌 ACCUEIL & INFOS' });

    template.categories.push({ name: '💬 HUB COMMUNAUTAIRE' });
    template.channels.push({ name: 'général', type: DiscordChannelType.GUILD_TEXT, parentName: '💬 HUB COMMUNAUTAIRE' });

    // 2. SCALE & COMPLEXITY MODULE (Staff & Logistics)
    if (scale > 0.6 || complexity > 0.6) {
      template.roles.push({ name: '▬▬▬ DIRECTION ▬▬▬', color: 0x000000, hoist: false, permissions: '0' });
      template.roles.push({ name: 'Fondateur', color: 0xff0000, hoist: true, permissions: '8' });
      template.roles.push({ name: 'Administrateur', color: 0xe67e22, hoist: true, permissions: '8' });
      template.roles.push({ name: '▬▬▬ MODERATION ▬▬▬', color: 0x000000, hoist: false, permissions: '0' });
      template.roles.push({ name: 'Head Mod', color: 0x9b59b6, hoist: true, permissions: '1099511627775' });
      template.roles.push({ name: 'Modérateur', color: 0x3498db, hoist: true, permissions: '1099511627775' });
      template.roles.push({ name: 'Trial Mod', color: 0x2ecc71, hoist: true, permissions: '104320577' });
      
      template.categories.push({ name: '🛡️ PANOPTICON (STAFF)' });
      template.channels.push({ name: 'logs-serveur', type: DiscordChannelType.GUILD_TEXT, parentName: '🛡️ PANOPTICON (STAFF)' });
      template.channels.push({ name: 'chat-modération', type: DiscordChannelType.GUILD_TEXT, parentName: '🛡️ PANOPTICON (STAFF)' });
      template.channels.push({ name: 'Réunion Direction', type: DiscordChannelType.GUILD_VOICE, parentName: '🛡️ PANOPTICON (STAFF)' });
    } else {
      template.roles.push({ name: 'Admin', color: 0xff0000, hoist: true, permissions: '8' });
      template.roles.push({ name: 'Modérateur', color: 0x3498db, hoist: true, permissions: '1099511627775' });
    }

    // 3. ROLEPLAY MODULE (FiveM, Gmod...)
    if (rp > 0.4) {
      template.roles.push({ name: '▬▬▬ MÉTIERS RP ▬▬▬', color: 0x000000, hoist: false, permissions: '0' });
      template.roles.push({ name: 'Gouvernement', color: 0xf1c40f, hoist: true, permissions: '0' });
      template.roles.push({ name: 'LSPD', color: 0x2980b9, hoist: true, permissions: '0' });
      template.roles.push({ name: 'EMS', color: 0xe74c3c, hoist: true, permissions: '0' });
      template.roles.push({ name: 'Mécano', color: 0x95a5a6, hoist: true, permissions: '0' });
      template.roles.push({ name: 'Gangs/Cartels', color: 0x8e44ad, hoist: true, permissions: '0' });

      template.categories.push({ name: '🌆 ROLEPLAY - IN CHARACTER' });
      template.channels.push({ name: 'twitter-anonyme', type: DiscordChannelType.GUILD_TEXT, parentName: '🌆 ROLEPLAY - IN CHARACTER' });
      template.channels.push({ name: 'darkweb', type: DiscordChannelType.GUILD_TEXT, parentName: '🌆 ROLEPLAY - IN CHARACTER' });
      template.channels.push({ name: 'annonces-gouvernement', type: DiscordChannelType.GUILD_TEXT, parentName: '🌆 ROLEPLAY - IN CHARACTER' });
      
      template.categories.push({ name: '🏢 FACTIONS (WHITELIST)' });
      template.channels.push({ name: 'dispatch-lspd', type: DiscordChannelType.GUILD_TEXT, parentName: '🏢 FACTIONS (WHITELIST)' });
      template.channels.push({ name: 'radio-ems', type: DiscordChannelType.GUILD_VOICE, parentName: '🏢 FACTIONS (WHITELIST)' });
    }

    // 4. ECONOMY / MINECRAFT MODULE
    if (economy > 0.4 || gaming > 0.8) {
      template.roles.push({ name: 'VIP', color: 0xf1c40f, hoist: true, permissions: '0' });
      template.categories.push({ name: '💰 ÉCONOMIE & COMMERCE' });
      template.channels.push({ name: 'hôtel-des-ventes', type: DiscordChannelType.GUILD_FORUM, parentName: '💰 ÉCONOMIE & COMMERCE' });
      template.channels.push({ name: 'recherche-joueurs', type: DiscordChannelType.GUILD_TEXT, parentName: '💰 ÉCONOMIE & COMMERCE' });
    }

    // 5. DEV / TECH MODULE
    if (dev > 0.4) {
      template.roles.push({ name: 'Développeur', color: 0x2ecc71, hoist: true, permissions: '0' });
      template.categories.push({ name: '💻 DÉVELOPPEMENT' });
      template.channels.push({ name: 'github-logs', type: DiscordChannelType.GUILD_TEXT, parentName: '💻 DÉVELOPPEMENT' });
      template.channels.push({ name: 'bug-tracker', type: DiscordChannelType.GUILD_FORUM, parentName: '💻 DÉVELOPPEMENT' });
    }

    // 6. CONTENT CREATOR MODULE
    if (content > 0.4) {
      template.roles.push({ name: 'Streamer', color: 0x9b59b6, hoist: true, permissions: '0' });
      template.roles.push({ name: 'Abonné Twitch', color: 0x8e44ad, hoist: true, permissions: '0' });
      template.categories.push({ name: '🎥 STREAMING' });
      template.channels.push({ name: 'notifications-live', type: DiscordChannelType.GUILD_TEXT, parentName: '🎥 STREAMING' });
      template.channels.push({ name: 'zone-abonnés', type: DiscordChannelType.GUILD_TEXT, parentName: '🎥 STREAMING' });
    }

    // 7. SUPPORT / TICKETS MODULE
    if (support > 0.4 || scale > 0.5) {
      template.categories.push({ name: '🎫 ASSISTANCE' });
      template.channels.push({ name: 'créer-un-ticket', type: DiscordChannelType.GUILD_TEXT, parentName: '🎫 ASSISTANCE' });
      template.channels.push({ name: 'Ticket Support Vocal', type: DiscordChannelType.GUILD_VOICE, parentName: '🎫 ASSISTANCE' });
    }

    // 8. AUDIO / LOBBIES MODULE
    if (audio > 0.3) {
      template.categories.push({ name: '🎧 ESPACES VOCAUX' });
      template.channels.push({ name: '➕ Créer Vocal', type: DiscordChannelType.GUILD_VOICE, parentName: '🎧 ESPACES VOCAUX' });
      template.channels.push({ name: 'Lounge', type: DiscordChannelType.GUILD_VOICE, parentName: '🎧 ESPACES VOCAUX' });
      template.channels.push({ name: 'AFK', type: DiscordChannelType.GUILD_VOICE, parentName: '🎧 ESPACES VOCAUX' });
    }

    template.roles.push({ name: 'Membre', color: 0x95a5a6, hoist: false, permissions: '104320577' });
    
    return template;
  }
}
