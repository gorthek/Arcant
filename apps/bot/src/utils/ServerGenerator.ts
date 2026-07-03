import { Client, ChannelType, ColorResolvable, PermissionFlagsBits, OverwriteResolvable, Guild } from 'discord.js';
import { localAI } from './LocalAIClient';

export class ServerGenerator {
  static async generate(
    client: Client,
    serverId: string,
    prompt: string,
    template: string,
    options: {
      createRoles?: boolean;
      managePerms?: boolean;
      customFonts?: boolean;
      customShapes?: boolean;
    }
  ) {
    try {
      console.log(`[ServerGenerator] Démarrage pour le serveur ${serverId}`);
      const guild = await client.guilds.fetch(serverId).catch(() => null);
      if (!guild) {
        throw new Error(`Serveur ${serverId} introuvable ou bot non présent.`);
      }

      // 1. Construire le Super Prompt pour forcer la sortie JSON complexe
      const systemPrompt = `Tu es Arcant, un architecte Discord expert.
Ta mission est de générer une architecture complète de serveur Discord au format JSON pur (sans markdown).
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
          "type": "text" | "voice",
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

      console.log(`[ServerGenerator] Appel de l'IA pour structurer le serveur...`);
      let jsonResponse = await localAI.generateResponse(prompt, systemPrompt);
      
      jsonResponse = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let structure;
      try {
        structure = JSON.parse(jsonResponse);
      } catch (err) {
        console.error(`[ServerGenerator] Erreur Parsing JSON :`, jsonResponse);
        throw new Error("L'IA n'a pas réussi à générer une structure valide.");
      }

      console.log(`[ServerGenerator] Architecture générée, début de la construction...`);

      const createdRoles = new Map<string, string>();

      // 3. Création des Rôles
      if (options.createRoles && structure.roles && Array.isArray(structure.roles)) {
        for (const roleDef of structure.roles) {
          try {
            const roleOptions: any = {
              name: roleDef.name,
              reason: 'Création via Arcant IA',
            };
            if (roleDef.color?.startsWith('#')) {
              roleOptions.color = roleDef.color as ColorResolvable;
            }
            const role = await guild.roles.create(roleOptions);
            createdRoles.set(roleDef.name, role.id);
            await this.sleep(300);
          } catch (e) {
            console.warn(`[ServerGenerator] Impossible de créer le rôle ${roleDef.name}:`, e);
          }
        }
      }

      // 4. Création des Catégories et Salons
      if (structure.categories && Array.isArray(structure.categories)) {
        for (const catDef of structure.categories) {
          try {
            const catOverwrites = options.managePerms ? this.parsePermissions(catDef.permissions, createdRoles, guild) : [];
            const category = await guild.channels.create({
              name: catDef.name,
              type: ChannelType.GuildCategory,
              permissionOverwrites: catOverwrites,
              reason: 'Création via Arcant IA',
            });
            await this.sleep(500);

            if (catDef.channels && Array.isArray(catDef.channels)) {
              for (const chanDef of catDef.channels) {
                const chanOverwrites = options.managePerms ? this.parsePermissions(chanDef.permissions, createdRoles, guild) : [];
                await guild.channels.create({
                  name: chanDef.name,
                  type: chanDef.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
                  parent: category.id,
                  permissionOverwrites: chanOverwrites,
                  reason: 'Création via Arcant IA',
                });
                await this.sleep(300);
              }
            }
          } catch (e) {
            console.warn(`[ServerGenerator] Erreur lors de la création de la catégorie ${catDef.name}:`, e);
          }
        }
      }

      console.log(`[ServerGenerator] Succès ! Le serveur ${serverId} a été bâti avec permissions.`);
      
    } catch (error) {
      console.error(`[ServerGenerator] Erreur globale:`, error);
      throw error;
    }
  }

  private static parsePermissions(permsArray: any[], createdRoles: Map<string, string>, guild: Guild): OverwriteResolvable[] {
    if (!permsArray || !Array.isArray(permsArray)) return [];
    const overwrites: OverwriteResolvable[] = [];

    const validFlags: Record<string, bigint> = {
      "ViewChannel": PermissionFlagsBits.ViewChannel,
      "SendMessages": PermissionFlagsBits.SendMessages,
      "ReadMessageHistory": PermissionFlagsBits.ReadMessageHistory,
      "Connect": PermissionFlagsBits.Connect,
      "Speak": PermissionFlagsBits.Speak
    };

    for (const perm of permsArray) {
      let targetId = guild.id; // par défaut @everyone
      if (perm.roleName && perm.roleName !== "@everyone") {
        targetId = createdRoles.get(perm.roleName) || guild.roles.cache.find(r => r.name === perm.roleName)?.id || '';
      }

      if (!targetId) continue;

      let allowBitfield = 0n;
      let denyBitfield = 0n;

      if (Array.isArray(perm.allow)) {
        for (const a of perm.allow) {
          if (validFlags[a]) allowBitfield |= validFlags[a];
        }
      }
      if (Array.isArray(perm.deny)) {
        for (const d of perm.deny) {
          if (validFlags[d]) denyBitfield |= validFlags[d];
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

  private static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
