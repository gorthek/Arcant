import { Events, Guild } from 'discord.js';
import { Server } from '@arcant/database';

export default {
  name: Events.GuildDelete,
  once: false,
  async execute(guild: Guild) {
    console.log(`[BOT] A quitté le serveur: ${guild.name} (${guild.id})`);
    
    try {
      // On peut choisir de supprimer le serveur ou juste de mettre à jour un statut "active: false"
      // Pour l'instant on supprime pour nettoyer la DB, ou on garde s'il a un abo
      const server = await Server.findOne({ serverId: guild.id });
      if (server && !server.isPremium) {
        await Server.deleteOne({ serverId: guild.id });
        console.log(`[DB] Serveur ${guild.name} supprimé de la DB (non-premium).`);
      } else {
        console.log(`[DB] Serveur ${guild.name} conservé (Premium ou non trouvé).`);
      }
    } catch (err) {
      console.error(`[DB] Erreur lors du retrait du serveur ${guild.id}:`, err);
    }
  },
};
