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
        // Ignore les messages de bots ou ceux qui ne commencent pas par le préfixe
        if (message.author.bot || !message.content.startsWith(PREFIX))
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