import { Client, Guild, ChannelType, OverwriteType, ColorResolvable } from 'discord.js';
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

      // 1. Construire le Super Prompt pour forcer la sortie JSON
      const systemPrompt = `Tu es Arcant, un architecte Discord expert.
Ta mission est de générer une architecture complète de serveur Discord au format JSON pur (sans markdown, sans backticks \`\`\`).
Règles strictes :
- Réponds UNIQUEMENT avec un objet JSON valide, rien d'autre.
- Le JSON doit avoir cette structure exacte :
{
  "roles": [
    { "name": "string", "color": "string (Hex code, ex: #FF0000)" }
  ],
  "categories": [
    {
      "name": "string",
      "channels": [
        { "name": "string", "type": "text" | "voice" }
      ]
    }
  ]
}
Options demandées par l'utilisateur :
- Rôles : ${options.createRoles ? 'Oui' : 'Non'}
- Polices personnalisées : ${options.customFonts ? 'Oui' : 'Non'}
- Formes (Emojis/Séparateurs) : ${options.customShapes ? 'Oui' : 'Non'}

Le prompt de l'utilisateur est : "${prompt}"
Template de base : ${template || 'Aucun'}

Génère une architecture riche et logique.`;

      // 2. Appel à l'IA Locale
      console.log(`[ServerGenerator] Appel de l'IA pour structurer le serveur...`);
      let jsonResponse = await localAI.generateResponse(prompt, systemPrompt);
      
      // Nettoyage de la réponse si l'IA met des backticks quand même
      jsonResponse = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let structure;
      try {
        structure = JSON.parse(jsonResponse);
      } catch (err) {
        console.error(`[ServerGenerator] L'IA n'a pas retourné un JSON valide :`, jsonResponse);
        throw new Error("L'IA n'a pas réussi à générer une structure valide.");
      }

      console.log(`[ServerGenerator] Architecture générée, début de la construction...`);

      // 3. Exécution Discord.js (Création)
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
            await guild.roles.create(roleOptions);
            await this.sleep(500); // Eviter le rate-limit
          } catch (e) {
            console.warn(`[ServerGenerator] Impossible de créer le rôle ${roleDef.name}:`, e);
          }
        }
      }

      if (structure.categories && Array.isArray(structure.categories)) {
        for (const catDef of structure.categories) {
          try {
            const category = await guild.channels.create({
              name: catDef.name,
              type: ChannelType.GuildCategory,
              reason: 'Création via Arcant IA',
            });
            await this.sleep(1000);

            if (catDef.channels && Array.isArray(catDef.channels)) {
              for (const chanDef of catDef.channels) {
                await guild.channels.create({
                  name: chanDef.name,
                  type: chanDef.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
                  parent: category.id,
                  reason: 'Création via Arcant IA',
                });
                await this.sleep(500);
              }
            }
          } catch (e) {
            console.warn(`[ServerGenerator] Erreur lors de la création de la catégorie ${catDef.name}:`, e);
          }
        }
      }

      console.log(`[ServerGenerator] Succès ! Le serveur ${serverId} a été bâti.`);
      
    } catch (error) {
      console.error(`[ServerGenerator] Erreur globale:`, error);
      throw error;
    }
  }

  private static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
