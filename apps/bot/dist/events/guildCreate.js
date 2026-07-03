"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = require("@arcant/database");
exports.default = {
    name: discord_js_1.Events.GuildCreate,
    once: false,
    async execute(guild) {
        console.log(`[BOT] A rejoint le serveur: ${guild.name} (${guild.id})`);
        try {
            await database_1.Server.findOneAndUpdate({ serverId: guild.id }, {
                serverId: guild.id,
                name: guild.name,
                icon: guild.iconURL() || '',
                ownerId: guild.ownerId,
            }, { upsert: true, new: true });
            console.log(`[DB] Serveur ${guild.name} enregistré/mis à jour.`);
        }
        catch (err) {
            console.error(`[DB] Erreur lors de l'enregistrement du serveur ${guild.id}:`, err);
        }
    },
};
//# sourceMappingURL=guildCreate.js.map