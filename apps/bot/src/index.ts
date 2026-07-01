import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import http from 'http';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';

dotenv.config();

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
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

// Dummy HTTP server pour Render (Web Service require a port to be bound)
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive!\n');
}).listen(port, () => {
  console.log(`[BOT] Dummy web server is listening on port ${port} (Required by Render)`);
});
