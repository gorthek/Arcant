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
  } else if (req.method === 'POST' && req.url === '/generate-preview') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { prompt, templateUrl, options } = payload;
        
        if (!prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing prompt' }));
          return;
        }

        const { ServerGenerator } = require('./utils/ServerGenerator');
        const structure = await ServerGenerator.generatePreview(client, prompt, templateUrl, options);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Preview generated', structure }));
      } catch (e) {
        console.error('[API] /generate-preview error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/sync-server') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { serverId, structure, options } = payload;
        
        if (!serverId || !structure) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing serverId or structure' }));
          return;
        }

        const { ServerGenerator } = require('./utils/ServerGenerator');
        // Synchronisation asynchrone
        ServerGenerator.applyStructure(client, serverId, structure, options)
          .then(() => console.log(`[ServerGenerator] Sync finished for ${serverId}`))
          .catch((err: any) => console.error(`[ServerGenerator] Error syncing server ${serverId}:`, err));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Sync started' }));
      } catch (e) {
        console.error('[API] /sync-server error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === 'GET' && req.url?.startsWith('/server-structure/')) {
    const serverId = req.url.split('/')[2];
    if (!serverId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing serverId' }));
      return;
    }
    try {
      const { ServerGenerator } = require('./utils/ServerGenerator');
      const structure = await ServerGenerator.readServerStructure(client, serverId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ structure }));
    } catch (e) {
      console.error('[API] /server-structure error:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else if (req.method === 'POST' && req.url === '/copilot') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { botId, userMessage } = payload;
        
        if (!botId || !userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing botId or userMessage' }));
          return;
        }

        const botConfig = await CustomBot.findById(botId);
        if (!botConfig) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Bot not found' }));
          return;
        }

        const { localAI } = require('./utils/LocalAIClient');
        const systemPrompt = `Tu es l'assistant (Copilot) de configuration de bot Discord.
Voici l'état actuel du bot de l'utilisateur :
- Nom : ${botConfig.botName}
- Personnalité (Prompt) : ${botConfig.systemPrompt || "Aucune"}
- Modules activés : ${botConfig.features.join(', ') || "Aucun"}

Le propriétaire te dit : "${userMessage}"

Tu dois exécuter sa demande et répondre OBLIGATOIREMENT et UNIQUEMENT avec ce format JSON pur (sans markdown):
{
  "reply": "Ton message texte à l'utilisateur pour confirmer ce que tu as fait.",
  "update": {
    "systemPrompt": "La nouvelle personnalité du bot (modifie-la si demandé, sinon garde l'ancienne)",
    "features": ["help", "mod", "tickets", "economy", "logs"] // Choisis les modules pertinents à garder/ajouter
  }
}
Rien d'autre que du JSON.`;

        let aiResponse = await localAI.generateResponse(userMessage, systemPrompt);
        aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
          const parsed = JSON.parse(aiResponse);
          
          // Mettre à jour la base de données (Bot)
          botConfig.systemPrompt = parsed.update?.systemPrompt || botConfig.systemPrompt;
          botConfig.features = parsed.update?.features || botConfig.features;
          await botConfig.save();

          // Mettre à jour les paramètres du serveur si demandés par le Copilot
          if (parsed.update?.settings && botConfig.serverId) {
            const { Server } = require('@arcant/database');
            await Server.findOneAndUpdate(
              { serverId: botConfig.serverId },
              parsed.update.settings,
              { upsert: true }
            );
          }

          // Recharger le bot à chaud
          await botManager.reloadBot(botId, botConfig.features, botConfig.systemPrompt);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            reply: parsed.reply,
            botState: {
              systemPrompt: botConfig.systemPrompt,
              features: botConfig.features
            }
          }));
        } catch (parseErr) {
          console.error("Erreur de parsing JSON Copilot:", aiResponse);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "L'IA a mal formaté sa réponse JSON." }));
        }

      } catch (e) {
        console.error('[API] /copilot error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/announce') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const announceMsg = payload.message;
        
        if (!announceMsg) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing message' }));
          return;
        }

        let successCount = 0;
        let failCount = 0;
        const guilds = Array.from(client.guilds.cache.values());
        
        const { EmbedBuilder } = require('discord.js');

        for (const guild of guilds) {
          try {
            const channel = guild.systemChannel || guild.channels.cache.find(
              c => c.isTextBased() && c.permissionsFor(guild.members.me!)?.has('SendMessages')
            );
            if (channel && 'send' in channel) {
              const embed = new EmbedBuilder()
                .setTitle('📢 Annonce Officielle Arcant')
                .setDescription(announceMsg)
                .setColor('#10b981')
                .setThumbnail(client.user?.displayAvatarURL() || null)
                .setTimestamp()
                .setFooter({ text: 'Administration Globale Arcant' });
              
              await (channel as any).send({ embeds: [embed] });
              successCount++;
            } else {
              failCount++;
            }
          } catch (e) {
            failCount++;
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Announcements sent', successCount, failCount }));
      } catch (e) {
        console.error('[API] /announce error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === 'GET' && req.url?.startsWith('/server-stats/')) {
    const serverId = req.url.split('/')[2];
    if (!serverId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing serverId' }));
      return;
    }
    try {
      const guild = client.guilds.cache.get(serverId);
      if (!guild) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Guild not found in cache' }));
        return;
      }

      // Fetch fresh data
      await guild.members.fetch({ withPresences: false, limit: 1 }).catch(() => {});

      const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
      const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
      const categories = guild.channels.cache.filter(c => c.type === 4).size;

      const stats = {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL({ size: 128 }),
        memberCount: guild.memberCount,
        approximatePresenceCount: guild.approximateMemberCount || guild.memberCount,
        boostCount: guild.premiumSubscriptionCount || 0,
        boostTier: guild.premiumTier,
        rolesCount: guild.roles.cache.size,
        textChannels,
        voiceChannels,
        categories,
        totalChannels: guild.channels.cache.size,
        createdAt: guild.createdAt.toISOString(),
        ownerId: guild.ownerId,
        botLatency: client.ws.ping,
        botOnline: client.ws.status === 0,
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stats));
    } catch (e) {
      console.error('[API] /server-stats error:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Arcant Bot Service is alive!\n');
  }
}).listen(port, () => {
  console.log(`[BOT] Internal web server is listening on port ${port} (Required by Render & API)`);
});

// --- ANTI-CRASH GLOBAL ---
process.on('unhandledRejection', (reason, promise) => {
  console.log('[ANTI-CRASH] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err, origin) => {
  console.log('[ANTI-CRASH] Uncaught Exception:', err);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('[ANTI-CRASH] Uncaught Exception Monitor:', err);
});
