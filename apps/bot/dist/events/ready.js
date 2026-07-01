"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[BOT] Connecté avec succès en tant que ${client.user?.tag}!`);
        console.log('[BOT] Arcant est en ligne et prêt à recevoir des commandes.');
        // Set presence
        client.user?.setActivity({
            name: 'Arcant Network | .help',
            type: discord_js_1.ActivityType.Watching,
        });
    },
};
//# sourceMappingURL=ready.js.map