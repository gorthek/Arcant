"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("@arcant/database");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
const BOT_SERVICE_URL = process.env.BOT_SERVICE_URL || 'http://localhost:3000';
// 1. Récupérer tous les serveurs enregistrés en DB
router.get('/servers', async (req, res) => {
    try {
        const servers = await database_1.Server.find().sort({ joinedAt: -1 });
        res.status(200).json({ servers });
    }
    catch (error) {
        console.error('[API Owner] GET /servers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. Basculer le statut Premium d'un serveur
router.post('/servers/:id/premium', async (req, res) => {
    try {
        const serverId = req.params.id;
        const { isPremium } = req.body;
        const server = await database_1.Server.findOneAndUpdate({ serverId }, {
            isPremium: !!isPremium,
            premiumUntil: isPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined
        }, { new: true });
        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }
        res.status(200).json({ message: 'Premium status updated', server });
    }
    catch (error) {
        console.error('[API Owner] POST /servers/:id/premium error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 3. Supprimer un serveur de la liste et de la DB
router.delete('/servers/:id', async (req, res) => {
    try {
        const serverId = req.params.id;
        // Supprimer le serveur, les règles IA associées et le bot personnalisé s'il existe
        await database_1.Server.findOneAndDelete({ serverId });
        await database_1.AIRule.deleteMany({ serverId });
        await database_1.CustomBot.findOneAndDelete({ serverId });
        res.status(200).json({ message: 'Server and associated configurations deleted successfully' });
    }
    catch (error) {
        console.error('[API Owner] DELETE /servers/:id error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 4. Envoyer une annonce globale (via le bot)
router.post('/announce', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }
        // Appeler le bot interne
        try {
            const response = await axios_1.default.post(`${BOT_SERVICE_URL}/announce`, { message });
            res.status(200).json(response.data);
        }
        catch (botError) {
            console.error('[API Owner] Failed to reach bot /announce:', botError.message);
            res.status(502).json({ error: 'Failed to broadcast announcement. Is the Bot service running?', details: botError.message });
        }
    }
    catch (error) {
        console.error('[API Owner] POST /announce error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 5. Récupérer les statistiques globales (métriques DB)
router.get('/db-stats', async (req, res) => {
    try {
        const [serversCount, botsCount, usersCount, premiumCount] = await Promise.all([
            database_1.Server.countDocuments(),
            database_1.CustomBot.countDocuments(),
            database_1.User.countDocuments(),
            database_1.Server.countDocuments({ isPremium: true })
        ]);
        res.status(200).json({
            serversCount,
            botsCount,
            usersCount,
            premiumCount
        });
    }
    catch (error) {
        console.error('[API Owner] GET /db-stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=owner.routes.js.map