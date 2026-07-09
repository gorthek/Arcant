import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { localAI } from '../utils/LocalAIClient';

export default {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Posez une question directement à l\'IA locale d\'Arcant.')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('Votre question pour l\'IA')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question', true);
    
    await interaction.deferReply();
    
    try {
      // Le contexte principal de l'IA d'Arcant
      const systemContext = "Tu es Arcant, une intelligence artificielle sur-entraînée. Tu réponds de manière concise, intelligente et précise.";
      
      const result = await localAI.generateResponseWithAction(
        question, 
        systemContext, 
        interaction.guildId || undefined,
        interaction.user.id
      );
      
      // Split if > 2000 chars (Discord limit)
      if (result.reply.length > 2000) {
        await interaction.editReply(result.reply.substring(0, 1997) + '...');
      } else {
        await interaction.editReply(result.reply);
      }

      // Si une action critique est déclenchée
      if (result.update?.triggerAction && interaction.guild) {
        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
          await interaction.followUp({
            content: "❌ **Erreur de permissions** : Seuls les administrateurs du serveur peuvent valider cette action.",
            ephemeral: true
          });
          return;
        }

        if (result.update.triggerAction === 'delete_all_channels') {
          const channels = Array.from(interaction.guild.channels.cache.values());
          for (const chan of channels) {
            if (chan.id !== interaction.channelId) {
              await chan.delete().catch(() => {});
            }
          }
          await interaction.followUp("🧹 **Nettoyage terminé.** Tous les autres salons ont été supprimés.");
        }

        if (result.update.triggerAction === 'lock_server') {
          const { Server } = require('@arcant/database');
          await Server.findOneAndUpdate(
            { serverId: interaction.guildId },
            { raidMode: true },
            { upsert: true }
          );
          await interaction.followUp("🔒 **Serveur verrouillé !** Le mode Anti-Raid a été activé en base de données.");
        }
      }
    } catch (error) {
      console.error('[Command: ask] Erreur:', error);
      await interaction.editReply('Une erreur est survenue lors de la communication avec le réseau neuronal d\'Arcant.');
    }
  },
};
