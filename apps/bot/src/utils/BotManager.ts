import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { CustomBot } from '@arcant/database';
import { localAI } from './LocalAIClient';

class BotManager {
  private bots: Map<string, Client> = new Map();

  // Initialiser les bots depuis la DB au démarrage
  public async initAllBots() {
    try {
      const activeBots = await CustomBot.find({ isActive: true });
      console.log(`[BotManager] Found ${activeBots.length} active custom bots.`);
      
      for (const botConfig of activeBots) {
        await this.spawnBot(botConfig._id.toString(), botConfig.botToken, botConfig.features, botConfig.systemPrompt);
      }
    } catch (error) {
      console.error('[BotManager] Error initializing bots:', error);
    }
  }

  // Démarrer un bot spécifique
  public async spawnBot(botId: string, token: string, features: string[] = [], systemPrompt: string = '') {
    if (this.bots.has(botId)) {
      console.log(`[BotManager] Bot ${botId} is already running.`);
      return;
    }

    try {
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Message, Partials.Channel],
      });

      client.once('ready', () => {
        console.log(`[BotManager] Custom bot ${client.user?.tag} is online!`);
      });

      // Gestionnaire de messages simple pour l'IA et les features
      client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // Fonctionnalité "help" si activée
        if (features.includes('help') && message.content === '!help') {
          await message.reply('Bonjour ! Je suis un bot personnalisé hébergé par Arcant.\\n- `!help`: Affiche ce menu\\n- Tu peux me mentionner pour discuter !');
          return;
        }

        // Si le bot est mentionné, répondre avec l'IA Locale
        if (message.mentions.has(client.user!.id)) {
          const prompt = message.content.replace(`<@${client.user!.id}>`, '').trim();
          
          await message.channel.sendTyping();
          const response = await localAI.generateResponse(prompt, systemPrompt);
          await message.reply(response);
        }
      });

      await client.login(token);
      this.bots.set(botId, client);
    } catch (error) {
      console.error(`[BotManager] Failed to spawn bot ${botId}:`, error);
    }
  }

  // Arrêter un bot
  public async stopBot(botId: string) {
    const client = this.bots.get(botId);
    if (client) {
      client.destroy();
      this.bots.delete(botId);
      console.log(`[BotManager] Stopped bot ${botId}`);
    }
  }
}

export const botManager = new BotManager();
