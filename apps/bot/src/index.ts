import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`[BOT] Logged in as ${client.user?.tag}!`);
  console.log('[BOT] Running successfully on Render!');
});

const token = process.env.DISCORD_TOKEN;
if (token) {
  client.login(token);
} else {
  console.warn('[BOT] No DISCORD_TOKEN provided, skipping login.');
}
