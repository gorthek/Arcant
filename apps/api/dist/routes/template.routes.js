"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("@arcant/database");
const router = (0, express_1.Router)();
// Extraire le code à partir d'un lien (ex: https://discord.new/kW2krnSubVrz)
function extractTemplateCode(url) {
    const match = url.match(/(?:discord\.new\/|discord\.com\/template\/)([a-zA-Z0-9]+)/);
    return match ? match[1] : url; // S'il a juste collé le code, on prend le code
}
router.post('/import', async (req, res) => {
    try {
        const { url, userId } = req.body;
        if (!url || !userId) {
            return res.status(400).json({ error: 'URL and userId are required' });
        }
        const code = extractTemplateCode(url);
        if (!code) {
            return res.status(400).json({ error: 'Invalid template URL' });
        }
        // Fetch the template from Discord API
        const discordRes = await fetch(`https://discord.com/api/v10/guilds/templates/${code}`);
        if (!discordRes.ok) {
            return res.status(404).json({ error: 'Template not found on Discord' });
        }
        const templateData = await discordRes.json();
        // Check if already exists
        let existingTemplate = await database_1.AITemplate.findOne({ code });
        if (existingTemplate) {
            // Just update it
            existingTemplate.structure = templateData;
            existingTemplate.name = templateData.name;
            existingTemplate.description = templateData.description;
            await existingTemplate.save();
        }
        else {
            existingTemplate = await database_1.AITemplate.create({
                code,
                name: templateData.name,
                description: templateData.description || 'Template importé depuis Discord',
                structure: templateData,
                addedBy: userId
            });
        }
        res.json({ success: true, template: existingTemplate });
    }
    catch (error) {
        console.error('[API] /import template error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Récupérer la liste des templates pour affichage ou utilisation
router.get('/', async (req, res) => {
    try {
        const templates = await database_1.AITemplate.find().sort({ createdAt: -1 });
        res.json(templates);
    }
    catch (error) {
        console.error('[API] GET /templates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=template.routes.js.map