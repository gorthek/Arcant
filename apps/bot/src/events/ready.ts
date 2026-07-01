import { Events, Client, ActivityType } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`[BOT] Connecté avec succès en tant que ${client.user?.tag}!`);
    console.log('[BOT] Arcant est en ligne et prêt à recevoir des commandes.');
    
    // Set presence
    client.user?.setActivity({
      name: 'Arcant Network | .help',
      type: ActivityType.Watching,
    });
  },
};
