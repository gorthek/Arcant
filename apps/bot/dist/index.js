"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const commandHandler_1 = require("./handlers/commandHandler");
const eventHandler_1 = require("./handlers/eventHandler");
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent, // Nécessaire pour lire le contenu des messages (préfixe)
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction],
});
// Charger les gestionnaires
(0, commandHandler_1.loadCommands)();
(0, eventHandler_1.loadEvents)(client);
const token = process.env.DISCORD_TOKEN;
if (token) {
    client.login(token);
}
else {
    console.warn('[BOT] No DISCORD_TOKEN provided, skipping login.');
}
//# sourceMappingURL=index.js.map