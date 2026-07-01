import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';

dotenv.config();

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Nécessaire pour lire le contenu des messages (préfixe)
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Charger les gestionnaires
loadCommands();
loadEvents(client);

const token = process.env.DISCORD_TOKEN;
if (token) {
  client.login(token);
} else {
  console.warn('[BOT] No DISCORD_TOKEN provided, skipping login.');
}
