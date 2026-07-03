import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import http from 'http';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { dbConnect } from '@arcant/database';

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

import { botManager } from './utils/BotManager';
import { CustomBot } from '@arcant/database';

const token = process.env.DISCORD_TOKEN;
if (token) {
  // Connect to DB before logging in
  dbConnect().then(async () => {
    client.login(token);
    // Initialiser les bots personnalisés
    await botManager.initAllBots();
  }).catch(err => {
    console.warn('[BOT] MongoDB connection failed. Bot will start anyway, but DB features will be disabled.', err);
    client.login(token);
  });
} else {
  console.warn('[BOT] No DISCORD_TOKEN provided, skipping login.');
}

// Serveur HTTP pour Render et pour l'API interne
const port = process.env.PORT || 3000;
http.createServer(async (req, res) => {
  // CORS basique
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/spawn-bot') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const botId = payload.botId;
        
        if (!botId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing botId' }));
          return;
        }

        const botConfig = await CustomBot.findById(botId);
        if (botConfig) {
          await botManager.spawnBot(botConfig._id.toString(), botConfig.botToken, botConfig.features, botConfig.systemPrompt);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Bot spawn initiated' }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Bot not found in DB' }));
        }
      } catch (e) {
        console.error('[API] /spawn-bot error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/build-server') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { serverId, prompt, template, options } = payload;
        
        if (!serverId || !prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing serverId or prompt' }));
          return;
        }

        const { ServerGenerator } = require('./utils/ServerGenerator');
        // On lance la génération de manière asynchrone pour ne pas bloquer la requête
        ServerGenerator.generate(client, serverId, prompt, template, options)
          .then(() => console.log(`[ServerGenerator] Generation finished for ${serverId}`))
          .catch((err: any) => console.error(`[ServerGenerator] Error generating server ${serverId}:`, err));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Generation started' }));
      } catch (e) {
        console.error('[API] /build-server error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Arcant Bot Service is alive!\n');
  }
}).listen(port, () => {
  console.log(`[BOT] Internal web server is listening on port ${port} (Required by Render & API)`);
});
