"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = require("@arcant/database");
exports.default = {
    name: discord_js_1.Events.GuildDelete,
    once: false,
    async execute(guild) {
        console.log(`[BOT] A quitté le serveur: ${guild.name} (${guild.id})`);
        try {
            // On peut choisir de supprimer le serveur ou juste de mettre à jour un statut "active: false"
            // Pour l'instant on supprime pour nettoyer la DB, ou on garde s'il a un abo
            const server = await database_1.Server.findOne({ serverId: guild.id });
            if (server && !server.isPremium) {
                await database_1.Server.deleteOne({ serverId: guild.id });
                console.log(`[DB] Serveur ${guild.name} supprimé de la DB (non-premium).`);
            }
            else {
                console.log(`[DB] Serveur ${guild.name} conservé (Premium ou non trouvé).`);
            }
        }
        catch (err) {
            console.error(`[DB] Erreur lors du retrait du serveur ${guild.id}:`, err);
        }
    },
};
//# sourceMappingURL=guildDelete.js.map