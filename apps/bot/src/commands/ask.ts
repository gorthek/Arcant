import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
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
      
      const response = await localAI.generateResponse(question, systemContext);
      
      // Split if > 2000 chars (Discord limit)
      if (response.length > 2000) {
        await interaction.editReply(response.substring(0, 1997) + '...');
      } else {
        await interaction.editReply(response);
      }
    } catch (error) {
      console.error('[Command: ask] Erreur:', error);
      await interaction.editReply('Une erreur est survenue lors de la communication avec le réseau neuronal d\'Arcant.');
    }
  },
};
