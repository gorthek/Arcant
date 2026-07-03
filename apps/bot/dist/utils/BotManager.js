"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botManager = void 0;
const discord_js_1 = require("discord.js");
const database_1 = require("@arcant/database");
const LocalAIClient_1 = require("./LocalAIClient");
class BotManager {
    bots = new Map();
    // Initialiser les bots depuis la DB au démarrage
    async initAllBots() {
        try {
            const activeBots = await database_1.CustomBot.find({ isActive: true });
            console.log(`[BotManager] Found ${activeBots.length} active custom bots.`);
            for (const botConfig of activeBots) {
                await this.spawnBot(botConfig._id.toString(), botConfig.botToken, botConfig.features, botConfig.systemPrompt);
            }
        }
        catch (error) {
            console.error('[BotManager] Error initializing bots:', error);
        }
    }
    // Démarrer un bot spécifique
    async spawnBot(botId, token, features = [], systemPrompt = '') {
        if (this.bots.has(botId)) {
            console.log(`[BotManager] Bot ${botId} is already running.`);
            return;
        }
        try {
            const client = new discord_js_1.Client({
                intents: [
                    discord_js_1.GatewayIntentBits.Guilds,
                    discord_js_1.GatewayIntentBits.GuildMessages,
                    discord_js_1.GatewayIntentBits.MessageContent,
                ],
                partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel],
            });
            client.once('ready', () => {
                console.log(`[BotManager] Custom bot ${client.user?.tag} is online!`);
            });
            // Gestionnaire de messages simple pour l'IA et les features
            client.on('messageCreate', async (message) => {
                if (message.author.bot)
                    return;
                try {
                    // Fonctionnalité "help" si activée
                    if (features.includes('help') && message.content === '!help') {
                        await message.reply('Bonjour ! Je suis un bot personnalisé hébergé par Arcant.\\n- `!help`: Affiche ce menu\\n- Tu peux me mentionner pour discuter !');
                        return;
                    }
                    // Si le bot est mentionné, répondre avec l'IA Locale
                    if (message.mentions.has(client.user.id)) {
                        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
                        if ('sendTyping' in message.channel) {
                            await message.channel.sendTyping();
                        }
                        const response = await LocalAIClient_1.localAI.generateResponse(prompt, systemPrompt);
                        await message.reply(response);
                    }
                }
                catch (error) {
                    console.error(`[BotManager - ${client.user?.tag}] Commande/Action échouée et ignorée (Anti-Crash):`, error);
                }
            });
            await client.login(token);
            this.bots.set(botId, client);
        }
        catch (error) {
            console.error(`[BotManager] Failed to spawn bot ${botId}:`, error);
        }
    }
    // Arrêter un bot
    async stopBot(botId) {
        const client = this.bots.get(botId);
        if (client) {
            client.destroy();
            this.bots.delete(botId);
            console.log(`[BotManager] Stopped bot ${botId}`);
        }
    }
    // Recharger un bot à chaud (sans le déco/reco)
    async reloadBot(botId, newFeatures, newSystemPrompt) {
        const client = this.bots.get(botId);
        if (!client) {
            console.warn(`[BotManager] Cannot reload bot ${botId} because it is not running.`);
            return;
        }
        // On remplace tous les listeners 'messageCreate' pour ce bot
        client.removeAllListeners('messageCreate');
        client.on('messageCreate', async (message) => {
            if (message.author.bot)
                return;
            try {
                if (newFeatures.includes('help') && message.content === '!help') {
                    await message.reply('Bonjour ! Je suis un bot personnalisé hébergé par Arcant.\\n- `!help`: Affiche ce menu\\n- Tu peux me mentionner pour discuter !');
                    return;
                }
                if (message.mentions.has(client.user.id)) {
                    const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
                    if ('sendTyping' in message.channel) {
                        await message.channel.sendTyping();
                    }
                    const response = await LocalAIClient_1.localAI.generateResponse(prompt, newSystemPrompt);
                    await message.reply(response);
                }
            }
            catch (error) {
                console.error(`[BotManager - ${client.user?.tag}] Commande/Action échouée et ignorée (Anti-Crash):`, error);
            }
        });
        console.log(`[BotManager] Bot ${botId} reloaded successfully with new features.`);
    }
}
exports.botManager = new BotManager();
//# sourceMappingURL=BotManager.js.map