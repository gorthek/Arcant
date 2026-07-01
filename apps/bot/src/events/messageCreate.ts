import { Events, Message } from 'discord.js';
import { commands } from '../handlers/commandHandler';
import { createErrorEmbed } from '../utils/embed';

const PREFIX = '.';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    // Ignore les messages de bots ou ceux qui ne commencent pas par le préfixe
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    // Découper la commande et les arguments
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Chercher la commande ou un alias
    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`[ERROR] Erreur lors de l'exécution de la commande ${commandName}:`, error);
      const errorEmbed = createErrorEmbed("Une erreur inattendue s'est produite lors de l'exécution de cette commande.");
      await message.reply({ embeds: [errorEmbed] }).catch(() => null);
    }
  },
};
