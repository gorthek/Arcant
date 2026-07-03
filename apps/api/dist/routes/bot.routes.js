"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("@arcant/database");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// L'URL interne du bot (Render permet la communication via le nom de service interne ou localhost en mode dev)
const BOT_SERVICE_URL = process.env.BOT_SERVICE_URL || 'http://localhost:3000';
router.post('/deploy', async (req, res) => {
    try {
        const { ownerId, serverId, botName, botToken, systemPrompt, features } = req.body;
        if (!ownerId || !botName || !botToken) {
            res.status(400).json({ error: 'Missing required fields (ownerId, botName, botToken)' });
            return;
        }
        // Upsert the custom bot in DB
        const bot = await database_1.CustomBot.findOneAndUpdate({ botToken }, {
            ownerId,
            serverId,
            botName,
            systemPrompt,
            features: features || [],
            isActive: true,
        }, { new: true, upsert: true });
        // Notify the Bot service to spawn it
        try {
            await axios_1.default.post(`${BOT_SERVICE_URL}/spawn-bot`, {
                botId: bot._id.toString()
            });
            res.status(200).json({ message: 'Bot deployed successfully', bot });
        }
        catch (botError) {
            console.error('[API] Failed to notify bot service:', botError);
            res.status(500).json({ error: 'Bot saved in DB, but failed to start process. Is the Bot service running?', details: botError });
        }
    }
    catch (error) {
        console.error('[API] Deploy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/copilot', async (req, res) => {
    try {
        const { botId, userMessage } = req.body;
        if (!botId || !userMessage) {
            res.status(400).json({ error: 'Missing botId or userMessage' });
            return;
        }
        // Proxy the request to the Bot service which has the LocalAI client
        const response = await axios_1.default.post(`${BOT_SERVICE_URL}/copilot`, {
            botId,
            userMessage
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error('[API] Copilot error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI Copilot' });
    }
});
exports.default = router;
//# sourceMappingURL=bot.routes.js.map