"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
client.once('ready', () => {
    console.log(`[BOT] Logged in as ${client.user?.tag}!`);
    console.log('[BOT] Running successfully on Render!');
});
const token = process.env.DISCORD_TOKEN;
if (token) {
    client.login(token);
}
else {
    console.warn('[BOT] No DISCORD_TOKEN provided, skipping login.');
}
//# sourceMappingURL=index.js.map