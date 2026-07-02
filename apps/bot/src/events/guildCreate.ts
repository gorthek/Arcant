import { Events, Guild } from 'discord.js';
import { Server } from '@arcant/database';

export default {
  name: Events.GuildCreate,
  once: false,
  async execute(guild: Guild) {
    console.log(`[BOT] A rejoint le serveur: ${guild.name} (${guild.id})`);
    
    try {
      await Server.findOneAndUpdate(
        { serverId: guild.id },
        { 
          serverId: guild.id,
          name: guild.name,
          ownerId: guild.ownerId,
        },
        { upsert: true, new: true }
      );
      console.log(`[DB] Serveur ${guild.name} enregistré/mis à jour.`);
    } catch (err) {
      console.error(`[DB] Erreur lors de l'enregistrement du serveur ${guild.id}:`, err);
    }
  },
};
