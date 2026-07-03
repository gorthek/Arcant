"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGenerator = void 0;
const discord_js_1 = require("discord.js");
const LocalAIClient_1 = require("./LocalAIClient");
const database_1 = require("@arcant/database");
class ServerGenerator {
    // Étape 1 : Générer le JSON sans l'appliquer
    static async generatePreview(client, prompt, templateUrl, // Lien éventuel discord.new
    options) {
        try {
            // 1. Récupérer des templates depuis la DB pour éduquer l'IA
            const allTemplates = await database_1.AITemplate.find().limit(5); // On prend qq templates pour l'inspiration
            let knowledgeBase = '';
            if (allTemplates.length > 0) {
                knowledgeBase = `Voici des exemples de structures communautaires dont tu DOIS t'inspirer pour le réalisme :\n` +
                    allTemplates.map(t => `- Modèle "${t.name}" : ` + JSON.stringify(t.structure?.channels || {}).substring(0, 300) + '...').join('\n');
            }
            const systemPrompt = `Tu es Arcant, un architecte Discord expert.
Ta mission est de générer une architecture complète de serveur Discord au format JSON pur (sans markdown).
${knowledgeBase}

Règles strictes :
- Réponds UNIQUEMENT avec un objet JSON valide.
- Assigne les permissions intelligemment (ex: annonces en lecture seule, salons staff privés).
- Les permissions supportées (allow/deny) sont : "ViewChannel", "SendMessages", "ReadMessageHistory", "Connect", "Speak".
- Le JSON doit avoir cette structure exacte :
{
  "roles": [
    { "name": "string", "color": "string (Hex code, ex: #FF0000)" }
  ],
  "categories": [
    {
      "name": "string",
      "permissions": [
         { "roleName": "NomDuRole (ou @everyone)", "allow": ["Permission", ...], "deny": ["Permission", ...] }
      ],
      "channels": [
        { 
          "name": "string", 
          "type": "text" | "voice" | "forum",
          "permissions": [
             { "roleName": "NomDuRole (ou @everyone)", "allow": ["Permission"], "deny": ["Permission"] }
          ]
        }
      ]
    }
  ]
}
Options demandées :
- Rôles : ${options.createRoles ? 'Oui' : 'Non'}
- Permissions : ${options.managePerms ? 'Oui' : 'Non'}

Prompt : "${prompt}"
Génère une architecture riche avec des règles de sécurité logiques.`;
            console.log(`[ServerGenerator] Génération Preview demandée...`);
            let jsonResponse = await LocalAIClient_1.localAI.generateResponse(prompt, systemPrompt);
            jsonResponse = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            let structure;
            try {
                structure = JSON.parse(jsonResponse);
            }
            catch (err) {
                console.error(`[ServerGenerator] Erreur Parsing JSON :`, jsonResponse);
                throw new Error("L'IA n'a pas réussi à générer une structure valide.");
            }
            return structure; // On retourne le JSON pour le Dashboard Web
        }
        catch (error) {
            console.error(`[ServerGenerator] Erreur preview:`, error);
            throw error;
        }
    }
    // Étape 2 : Appliquer le JSON final sur Discord (Synchronisation)
    static async applyStructure(client, serverId, structure, options) {
        try {
            const guild = await client.guilds.fetch(serverId).catch(() => null);
            if (!guild) {
                throw new Error(`Serveur ${serverId} introuvable ou bot non présent.`);
            }
            console.log(`[ServerGenerator] Début de la synchronisation pour le serveur ${serverId}...`);
            const createdRoles = new Map();
            // 3. Création des Rôles
            if (options.createRoles && structure.roles && Array.isArray(structure.roles)) {
                for (const roleDef of structure.roles) {
                    try {
                        // Vérifier si le rôle existe déjà
                        let role = guild.roles.cache.find(r => r.name.toLowerCase() === roleDef.name.toLowerCase());
                        if (!role) {
                            const roleOptions = {
                                name: roleDef.name,
                                reason: 'Création via Arcant IA / Sync',
                            };
                            if (roleDef.color?.startsWith('#')) {
                                roleOptions.color = roleDef.color;
                            }
                            role = await guild.roles.create(roleOptions);
                            await this.sleep(300);
                        }
                        createdRoles.set(roleDef.name, role.id);
                    }
                    catch (e) {
                        console.warn(`[ServerGenerator] Impossible de créer le rôle ${roleDef.name}:`, e);
                    }
                }
            }
            // 4. Création des Catégories et Salons (Simplifié pour l'instant : on crée si ça n'existe pas)
            // Une vraie synchro bidirectionnelle parfaite comparerait et supprimerait l'excédent.
            if (structure.categories && Array.isArray(structure.categories)) {
                for (const catDef of structure.categories) {
                    try {
                        let category = guild.channels.cache.find(c => c.name.toLowerCase() === catDef.name.toLowerCase() && c.type === discord_js_1.ChannelType.GuildCategory);
                        const catOverwrites = options.managePerms ? this.parsePermissions(catDef.permissions, createdRoles, guild) : [];
                        if (!category) {
                            category = await guild.channels.create({
                                name: catDef.name,
                                type: discord_js_1.ChannelType.GuildCategory,
                                permissionOverwrites: catOverwrites,
                                reason: 'Création via Arcant IA',
                            });
                            await this.sleep(500);
                        }
                        else {
                            // Update perms si existant
                            await category.edit({ permissionOverwrites: catOverwrites });
                        }
                        if (category && catDef.channels && Array.isArray(catDef.channels)) {
                            for (const chanDef of catDef.channels) {
                                const chanOverwrites = options.managePerms ? this.parsePermissions(chanDef.permissions, createdRoles, guild) : [];
                                let chanType = discord_js_1.ChannelType.GuildText;
                                if (chanDef.type === 'voice')
                                    chanType = discord_js_1.ChannelType.GuildVoice;
                                else if (chanDef.type === 'forum')
                                    chanType = discord_js_1.ChannelType.GuildForum;
                                let channel = guild.channels.cache.find(c => c.name.toLowerCase() === chanDef.name.toLowerCase() && c.parentId === category?.id);
                                if (!channel) {
                                    await guild.channels.create({
                                        name: chanDef.name,
                                        type: chanType,
                                        parent: category.id,
                                        permissionOverwrites: chanOverwrites,
                                        reason: 'Création via Arcant IA',
                                    });
                                    await this.sleep(300);
                                }
                                else {
                                    await channel.edit({ permissionOverwrites: chanOverwrites });
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.warn(`[ServerGenerator] Erreur lors de la synchro de la catégorie ${catDef.name}:`, e);
                    }
                }
            }
            console.log(`[ServerGenerator] Succès ! Le serveur ${serverId} a été synchronisé.`);
            return { success: true };
        }
        catch (error) {
            console.error(`[ServerGenerator] Erreur synchro:`, error);
            throw error;
        }
    }
    // Permet au Dashboard de LIRE l'état actuel du serveur
    static async readServerStructure(client, serverId) {
        const guild = await client.guilds.fetch(serverId).catch(() => null);
        if (!guild)
            throw new Error("Server not found");
        const roles = guild.roles.cache.map(r => ({
            id: r.id,
            name: r.name,
            color: r.hexColor
        }));
        const categories = guild.channels.cache
            .filter(c => c.type === discord_js_1.ChannelType.GuildCategory)
            .map(cat => {
            const children = guild.channels.cache
                .filter(c => c.parentId === cat.id)
                .map(c => ({
                id: c.id,
                name: c.name,
                type: c.type === discord_js_1.ChannelType.GuildVoice ? 'voice' : c.type === discord_js_1.ChannelType.GuildForum ? 'forum' : 'text',
            }));
            return {
                id: cat.id,
                name: cat.name,
                channels: children
            };
        });
        return { roles, categories };
    }
    static parsePermissions(permsArray, createdRoles, guild) {
        if (!permsArray || !Array.isArray(permsArray))
            return [];
        const overwrites = [];
        const validFlags = {
            "ViewChannel": discord_js_1.PermissionFlagsBits.ViewChannel,
            "SendMessages": discord_js_1.PermissionFlagsBits.SendMessages,
            "ReadMessageHistory": discord_js_1.PermissionFlagsBits.ReadMessageHistory,
            "Connect": discord_js_1.PermissionFlagsBits.Connect,
            "Speak": discord_js_1.PermissionFlagsBits.Speak
        };
        for (const perm of permsArray) {
            let targetId = guild.id; // par défaut @everyone
            if (perm.roleName && perm.roleName !== "@everyone") {
                targetId = createdRoles.get(perm.roleName) || guild.roles.cache.find(r => r.name === perm.roleName)?.id || '';
            }
            if (!targetId)
                continue;
            let allowBitfield = 0n;
            let denyBitfield = 0n;
            if (Array.isArray(perm.allow)) {
                for (const a of perm.allow) {
                    if (validFlags[a])
                        allowBitfield |= validFlags[a];
                }
            }
            if (Array.isArray(perm.deny)) {
                for (const d of perm.deny) {
                    if (validFlags[d])
                        denyBitfield |= validFlags[d];
                }
            }
            overwrites.push({
                id: targetId,
                allow: allowBitfield,
                deny: denyBitfield
            });
        }
        return overwrites;
    }
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.ServerGenerator = ServerGenerator;
//# sourceMappingURL=ServerGenerator.js.map