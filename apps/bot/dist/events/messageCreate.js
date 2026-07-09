"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commandHandler_1 = require("../handlers/commandHandler");
const embed_1 = require("../utils/embed");
const PREFIX = '.';
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot)
            return;
        // Si on mentionne le bot principal, il répond avec l'IA
        if (message.client.user && message.mentions.has(message.client.user.id)) {
            const prompt = message.content.replace(`<@${message.client.user.id}>`, '').trim();
            if (prompt.length > 0) {
                try {
                    if ('sendTyping' in message.channel) {
                        await message.channel.sendTyping();
                    }
                    const { localAI } = require('../utils/LocalAIClient');
                    const result = await localAI.generateResponseWithAction(prompt, "Tu es Arcant, l'assistant principal.", message.guildId || undefined, message.author.id);
                    await message.reply(result.reply);
                    // Si une action critique est déclenchée par la confirmation de l'utilisateur
                    if (result.update?.triggerAction && message.guild) {
                        // Vérifier que le confirmateur est ADMINISTRATEUR
                        if (!message.member?.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
                            await message.reply("❌ **Erreur de permissions** : Seuls les administrateurs du serveur peuvent valider cette action.");
                            return;
                        }
                        if (result.update.triggerAction === 'delete_all_channels') {
                            const channels = Array.from(message.guild.channels.cache.values());
                            for (const chan of channels) {
                                if (chan.id !== message.channelId) {
                                    await chan.delete().catch(() => { });
                                }
                            }
                            await message.channel.send("🧹 **Nettoyage terminé.** Tous les autres salons ont été supprimés.");
                        }
                        if (result.update.triggerAction === 'lock_server') {
                            const { Server } = require('@arcant/database');
                            await Server.findOneAndUpdate({ serverId: message.guildId }, { raidMode: true }, { upsert: true });
                            await message.reply("🔒 **Serveur verrouillé !** Le mode Anti-Raid a été activé en base de données.");
                        }
                    }
                }
                catch (error) {
                    console.error(`[MainBot] L'IA a planté sur une commande, ignorée pour éviter le crash:`, error);
                }
            }
            return;
        }
        // Ignore les messages qui ne commencent pas par le préfixe
        if (!message.content.startsWith(PREFIX))
            return;
        // Découper la commande et les arguments
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        // Chercher la commande ou un alias
        const command = commandHandler_1.commands.get(commandName) || commandHandler_1.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command)
            return;
        try {
            await command.execute(message, args);
        }
        catch (error) {
            console.error(`[ERROR] Erreur lors de l'exécution de la commande ${commandName}:`, error);
            const errorEmbed = (0, embed_1.createErrorEmbed)("Une erreur inattendue s'est produite lors de l'exécution de cette commande.");
            await message.reply({ embeds: [errorEmbed] }).catch(() => null);
        }
    },
};
//# sourceMappingURL=messageCreate.js.map